import { createMock } from '@golevelup/ts-jest'
import type { DataServices } from '@approved-premises/ui'
import { DateFormats } from '../../../../utils/dateUtils'
import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory, oasysRiskToSelfFactory } from '../../../../testutils/factories/index'
import RiskToSelfGuidance, { RiskToSelfTaskData } from './riskToSelfGuidance'
import PersonService from '../../../../services/personService'
import Vulnerability from './vulnerability'

jest.mock('./vulnerability')

describe('RiskToSelfGuidance', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })
  const oasys = oasysRiskToSelfFactory.build({
    dateCompleted: DateFormats.dateObjToIsoDateTime(new Date(2023, 7, 29)),
    dateStarted: DateFormats.dateObjToIsoDateTime(new Date(2023, 7, 28)),
  })

  const dataServices = createMock<DataServices>({ personService: createMock<PersonService>({}) })

  const now = new Date()

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(now)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new RiskToSelfGuidance({}, application, oasys, '')

      expect(page.title).toEqual("Import Roger Smith's risk to self data from OASys")
    })
  })

  describe('initialize', () => {
    describe('when oasys sections are returned', () => {
      it('instantiates the class with the task data in the correct format', async () => {
        oasys.riskToSelf = [
          {
            label: 'Current concerns about self-harm or suicide',
            questionNumber: 'R8.1.1',
            answer: 'self harm answer',
          },
          {
            label: 'Current concerns about Coping in Custody or Hostel',
            questionNumber: 'R8.2.1',
            answer: 'coping in custody answer',
          },
          {
            label: 'Current concerns about Vulnerability',
            questionNumber: 'R8.3.1',
            answer: 'vulnerability answer',
          },
          {
            label: 'Historical concerns about self-harm or suicide',
            questionNumber: 'R8.1.4',
            answer: 'historical answer',
          },
        ]

        const taskData = {
          'risk-to-self': {
            'current-risk': { currentRiskDetail: 'self harm answer', dateOfOasysImport: now },
            vulnerability: { vulnerabilityDetail: 'vulnerability answer', dateOfOasysImport: now },
            'historical-risk': { historicalRiskDetail: 'historical answer', dateOfOasysImport: now },
          },
        }

        ;(dataServices.personService.getOasysRiskToSelf as jest.Mock).mockResolvedValue(oasys)

        const page = (await RiskToSelfGuidance.initialize(
          {},
          application,
          'some-token',
          dataServices,
        )) as RiskToSelfGuidance

        expect(page.taskData).toBe(JSON.stringify(taskData))
        expect(page.hasOasysRecord).toBe(true)
        expect(page.oasysCompleted).toBe('29 August 2023')
        expect(page.oasysStarted).toBe('28 August 2023')
      })

      describe('when there is not a completed date', () => {
        it('does not assign a completed date', async () => {
          const oasysIncomplete = oasysRiskToSelfFactory.build({ dateCompleted: null })

          ;(dataServices.personService.getOasysRiskToSelf as jest.Mock).mockResolvedValue(oasysIncomplete)

          const page = (await RiskToSelfGuidance.initialize(
            {},
            application,
            'some-token',
            dataServices,
          )) as RiskToSelfGuidance

          expect(page.oasysCompleted).toBe(null)
        })
      })
    })

    describe('when oasys sections are not returned', () => {
      it('sets hasOasysRecord to false when a 404 is returned', async () => {
        ;(dataServices.personService.getOasysRiskToSelf as jest.Mock).mockRejectedValue({ status: 404 })

        const page = (await RiskToSelfGuidance.initialize(
          {},
          application,
          'some-token',
          dataServices,
        )) as RiskToSelfGuidance

        expect(page.hasOasysRecord).toBe(false)
        expect(page.oasysCompleted).toBe(undefined)
        expect(page.oasysStarted).toBe(undefined)
      })

      it('throws error when an unexpected error is returned', async () => {
        const error = new Error()
        ;(dataServices.personService.getOasysRiskToSelf as jest.Mock).mockImplementation(() => {
          throw error
        })

        expect(RiskToSelfGuidance.initialize({}, application, 'some-token', dataServices)).rejects.toThrow(error)
      })
    })

    describe('when questions have already been answered', () => {
      it('returns the Vulnerability page', async () => {
        const riskToSelfData = {
          'risk-to-self': { vulnerability: { vulnerabilityDetail: 'some answer' } },
        } as RiskToSelfTaskData

        const applicationWithData = applicationFactory.build({
          person: personFactory.build({ name: 'Roger Smith' }),
          data: riskToSelfData,
        })

        const vulnerabilityPageConstructor = jest.fn()

        ;(Vulnerability as jest.Mock).mockImplementation(() => {
          return vulnerabilityPageConstructor
        })

        expect(RiskToSelfGuidance.initialize({}, applicationWithData, 'some-token', dataServices)).resolves.toEqual(
          vulnerabilityPageConstructor,
        )

        expect(Vulnerability).toHaveBeenCalledWith(
          applicationWithData.data['risk-to-self'].vulnerability,
          applicationWithData,
        )
      })
    })
  })

  itShouldHaveNextValue(new RiskToSelfGuidance({}, application, oasys, ''), 'vulnerability')
  itShouldHavePreviousValue(new RiskToSelfGuidance({}, application, oasys, ''), 'taskList')

  describe('errors', () => {
    it('returns empty object', () => {
      const page = new RiskToSelfGuidance({}, application, oasys, '')

      expect(page.errors()).toEqual({})
    })
  })

  describe('response', () => {
    it('returns empty object', () => {
      const page = new RiskToSelfGuidance({}, application, oasys, '')

      expect(page.response()).toEqual({})
    })
  })
})
