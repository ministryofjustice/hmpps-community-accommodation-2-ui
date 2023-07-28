import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import FundingInformation from './fundingInformation'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'

jest.mock('../../../../utils/formUtils', () => ({
  convertKeyValuePairToRadioItems: jest.fn().mockImplementation(() => [
    {
      value: 'foo',
      text: 'Foo',
      checked: false,
    },
    {
      value: 'bar',
      text: 'Bar',
      checked: false,
    },
  ]),
}))

describe('FundingInformation', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('sets the question title as the page title', () => {
      const page = new FundingInformation({ fundingSource: 'personalSavings' }, application)

      expect(page.questions).toEqual({
        fundingSource: 'How will Roger Smith pay for their accommodation and service charge?',
      })
    })
  })

  it('should set the body', () => {
    const page = new FundingInformation(
      {
        fundingSource: 'personalSavings',
      },
      application,
    )

    expect(page.body).toEqual({
      fundingSource: 'personalSavings',
    })
  })

  describe('response', () => {
    it('Adds selected option to page response in _translated_ form', () => {
      const page = new FundingInformation({ fundingSource: 'personalSavings' }, application)

      expect(page.response()).toEqual({
        'How will Roger Smith pay for their accommodation and service charge?': 'Personal money or savings',
      })
    })

    it('Deletes fields where there is not an answer', () => {
      const page = new FundingInformation({ fundingSource: undefined }, application)

      expect(page.response()).toEqual({})
    })
  })

  describe('items', () => {
    describe('when there is a radio for benefits', () => {
      it('returns the benefits hint', () => {
        ;(convertKeyValuePairToRadioItems as jest.Mock).mockImplementation(() => [
          {
            value: 'benefits',
            text: 'Foo',
            checked: false,
          },
        ])
        const page = new FundingInformation({ fundingSource: 'personalSavings' }, application)

        expect(page.items()).toEqual([
          {
            value: 'benefits',
            text: 'Foo',
            checked: false,
            hint: {
              text: 'This includes Housing Benefit and Universal Credit, Disability Living Allowance, and Employment and Support Allowance',
            },
          },
        ])
      })
    })

    describe('when there is not a radio for benefits', () => {
      it('returns the radio without a hint', () => {
        ;(convertKeyValuePairToRadioItems as jest.Mock).mockImplementation(() => [
          {
            value: 'foo',
            text: 'Foo',
            checked: false,
          },
        ])
        const page = new FundingInformation({ fundingSource: 'personalSavings' }, application)

        expect(page.items()).toEqual([
          {
            value: 'foo',
            text: 'Foo',
            checked: false,
          },
        ])
      })
    })
  })

  itShouldHaveNextValue(new FundingInformation({ fundingSource: 'personalSavings' }, application), '')
  itShouldHavePreviousValue(new FundingInformation({ fundingSource: 'personalSavings' }, application), 'taskList')

  describe('errors', () => {
    it('should return errors when yes/no questions are blank', () => {
      const page = new FundingInformation({}, application)

      expect(page.errors()).toEqual({
        fundingSource: 'Select a funding source',
      })
    })
  })
})
