/* eslint-disable import/no-duplicates */
import { differenceInDays, formatDistanceStrict, isFuture, isToday } from 'date-fns'
import type { ObjectWithDateParts } from '@approved-premises/ui'

import {
  DateFormats,
  InvalidDateStringError,
  dateAndTimeInputsAreValidDates,
  dateIsTodayOrInTheFuture,
} from './dateUtils'

jest.mock('date-fns', () => {
  return {
    ...jest.requireActual('date-fns'),
    formatDistanceStrict: jest.fn(() => '1 day'),
    differenceInDays: jest.fn(() => 1),
    isFuture: jest.fn(() => true),
    isToday: jest.fn(() => false),
  }
})

describe('DateFormats', () => {
  describe('convertIsoToDateObj', () => {
    it('converts a ISO8601 date string', () => {
      const date = '2022-11-11T00:00:00.000Z'

      expect(DateFormats.isoToDateObj(date)).toEqual(new Date(2022, 10, 11))
    })

    it('raises an error if the date is not a valid ISO8601 date string', () => {
      const date = '23/11/2022'

      expect(() => DateFormats.isoToDateObj(date)).toThrow(new InvalidDateStringError(`Invalid Date: ${date}`))
    })

    it('raises an error if the date is not a date string', () => {
      const date = 'NOT A DATE'

      expect(() => DateFormats.isoToDateObj(date)).toThrow(new InvalidDateStringError(`Invalid Date: ${date}`))
    })
  })

  describe('isoDateToUIDate', () => {
    it('converts a ISO8601 date string to a GOV.UK formatted date', () => {
      const date = '2022-11-11T00:00:00.000Z'

      expect(DateFormats.isoDateToUIDate(date)).toEqual('Friday 11 November 2022')
    })

    it('raises an error if the date is not a valid ISO8601 date string', () => {
      const date = '23/11/2022'

      expect(() => DateFormats.isoDateToUIDate(date)).toThrow(new InvalidDateStringError(`Invalid Date: ${date}`))
    })

    it('raises an error if the date is not a date string', () => {
      const date = 'NOT A DATE'

      expect(() => DateFormats.isoDateToUIDate(date)).toThrow(new InvalidDateStringError(`Invalid Date: ${date}`))
    })
  })

  describe('dateObjToUiDate', () => {
    it('converts a date to a short format date', () => {
      const date = new Date('2022-11-11T00:00:00.000Z')

      expect(DateFormats.dateObjtoUIDate(date, { format: 'short' })).toEqual('11/11/2022')
    })

    it('converts a date to a medium format date', () => {
      const date = new Date('2022-11-11T00:00:00.000Z')

      expect(DateFormats.dateObjtoUIDate(date, { format: 'medium' })).toEqual('11 November 2022')
    })

    it('converts a date to a long format date', () => {
      const date = new Date('2022-11-11T00:00:00.000Z')

      expect(DateFormats.dateObjtoUIDate(date)).toEqual('Friday 11 November 2022')
    })
  })

  describe('isoDateTimeToUIDateTime', () => {
    it('converts a ISO8601 date string to a GOV.UK formatted date', () => {
      const date = '2022-11-11T10:00:00.000Z'

      expect(DateFormats.isoDateTimeToUIDateTime(date)).toEqual('11 November 2022 at 10:00am')
    })

    it('raises an error if the date is not a valid ISO8601 date string', () => {
      const date = '23/11/2022'

      expect(() => DateFormats.isoDateTimeToUIDateTime(date)).toThrow(
        new InvalidDateStringError(`Invalid Date: ${date}`),
      )
    })

    it('raises an error if the date is not a date string', () => {
      const date = 'NOT A DATE'

      expect(() => DateFormats.isoDateTimeToUIDateTime(date)).toThrow(
        new InvalidDateStringError(`Invalid Date: ${date}`),
      )
    })
  })

  describe('convertDateAndTimeInputsToIsoString', () => {
    it('converts a date object', () => {
      const obj: ObjectWithDateParts<'date'> = {
        'date-year': '2022',
        'date-month': '12',
        'date-day': '11',
      }

      const result = DateFormats.dateAndTimeInputsToIsoString(obj, 'date')

      expect(result.date).toEqual('2022-12-11')
    })

    it('pads the months and days', () => {
      const obj: ObjectWithDateParts<'date'> = {
        'date-year': '2022',
        'date-month': '1',
        'date-day': '1',
      }

      const result = DateFormats.dateAndTimeInputsToIsoString(obj, 'date')

      expect(result.date).toEqual('2022-01-01')
    })

    it('returns the date with a time if passed one', () => {
      const obj: ObjectWithDateParts<'date'> = {
        'date-year': '2022',
        'date-month': '1',
        'date-day': '1',
        'date-time': '12:35',
      }

      const result = DateFormats.dateAndTimeInputsToIsoString(obj, 'date')

      expect(result.date).toEqual('2022-01-01T12:35:00.000Z')
    })

    it('returns an empty string when given empty strings as input', () => {
      const obj: ObjectWithDateParts<'date'> = {
        'date-year': '',
        'date-month': '',
        'date-day': '',
      }

      const result = DateFormats.dateAndTimeInputsToIsoString(obj, 'date')

      expect(result.date).toBeUndefined()
    })

    it('returns an invalid ISO string when given invalid strings as input', () => {
      const obj: ObjectWithDateParts<'date'> = {
        'date-year': 'twothousandtwentytwo',
        'date-month': '20',
        'date-day': 'foo',
      }

      const result = DateFormats.dateAndTimeInputsToIsoString(obj, 'date')

      expect(result.date.toString()).toEqual('twothousandtwentytwo-20-oo')
    })
  })

  describe('differenceInDays', () => {
    it('calls the date-fns functions and returns the results as an object', () => {
      const date1 = new Date(2023, 3, 12)
      const date2 = new Date(2023, 3, 11)

      expect(DateFormats.differenceInDays(date1, date2)).toEqual({
        ui: '1 day',
        number: 1,
      })
      expect(formatDistanceStrict).toHaveBeenCalledWith(date1, date2, { unit: 'day' })
      expect(differenceInDays).toHaveBeenCalledWith(date1, date2)
    })
  })

  describe('dateAndTimeInputsToUiDate', () => {
    it('converts a date and time input object to a human readable date', () => {
      const dateTimeInputs = { 'key-day': '1', 'key-month': '11', 'key-year': '2022' }

      expect(DateFormats.dateAndTimeInputsToUiDate(dateTimeInputs, 'key')).toEqual('1 November 2022')
    })

    it('throws an error if an object without date inputs for the key is entered', () => {
      expect(() => DateFormats.dateAndTimeInputsToUiDate({}, 'key')).toThrow(TypeError)
    })
  })

  describe('dateAndTimeInputsAreValidDates', () => {
    it('returns true when the date is valid', () => {
      const obj: ObjectWithDateParts<'date'> = {
        'date-year': '2022',
        'date-month': '12',
        'date-day': '11',
      }

      const result = dateAndTimeInputsAreValidDates(obj, 'date')

      expect(result).toEqual(true)
    })

    it('returns false when the date is invalid', () => {
      const obj: ObjectWithDateParts<'date'> = {
        'date-year': '99',
        'date-month': '99',
        'date-day': '99',
      }

      const result = dateAndTimeInputsAreValidDates(obj, 'date')

      expect(result).toEqual(false)
    })

    it('returns false when the year is not 4 digits', () => {
      const obj: ObjectWithDateParts<'date'> = {
        'date-year': '22',
        'date-month': '12',
        'date-day': '11',
      }

      const result = dateAndTimeInputsAreValidDates(obj, 'date')

      expect(result).toEqual(false)
    })

    it('returns false when empty object passed in', () => {
      const result = dateAndTimeInputsAreValidDates(undefined, 'date')

      expect(result).toEqual(false)
    })
  })

  describe('dateIsInTheFuture', () => {
    it('calls the date-fns function', () => {
      const obj: ObjectWithDateParts<'date'> = {
        'date-year': '2022',
        'date-month': '12',
        'date-day': '11',
      }

      dateIsTodayOrInTheFuture(obj, 'date')

      expect(isFuture).toHaveBeenCalled()
      expect(isToday).toHaveBeenCalled()
    })
  })
})
