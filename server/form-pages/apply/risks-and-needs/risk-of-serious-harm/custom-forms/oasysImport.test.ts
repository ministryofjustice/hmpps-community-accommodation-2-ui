import { createMock } from '@golevelup/ts-jest'
import type { DataServices } from '@approved-premises/ui'
import { DateFormats } from '../../../../../utils/dateUtils'
import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../../shared-examples'
import { personFactory, applicationFactory, roshRisksEnvelopeFactory } from '../../../../../testutils/factories/index'
import OasysImport, { RoshTaskData } from './oasysImport'
import PersonService from '../../../../../services/personService'
import oasysRoshFactory from '../../../../../testutils/factories/oasysRosh'
import RiskToOthers from '../riskToOthers'
import Summary from '../summary'

jest.mock('../riskToOthers')
jest.mock('../summary')

describe('OasysImport', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })
  const oasys = oasysRoshFactory.build({
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
      const page = new OasysImport({}, application, oasys, '')

      expect(page.title).toEqual("Import Roger Smith's risk of serious harm (RoSH) data from OASys")
    })
  })

  describe('initialize', () => {
    describe('when oasys sections are returned', () => {
      it('instantiates the class with the task data in the correct format', async () => {
        oasys.rosh = [
          {
            label: 'Who is at risk',
            questionNumber: 'R10.1',
            answer: 'who is at risk answer',
          },
          {
            label: 'What is the nature of the risk',
            questionNumber: 'R10.2',
            answer: 'nature of risk answer',
          },
          {
            label: 'When is the risk likely to be the greatest',
            questionNumber: 'R10.3',
            answer: 'risk likely to be greatest answer',
          },
          {
            label: 'What circumstances are likely to increase risk',
            questionNumber: 'R10.4',
            answer: 'circumstances likely to increase risk answer',
          },
          {
            label: 'What circumstances are likely to reduce the risk',
            questionNumber: 'R10.5',
            answer: 'circumstances likely to reduce risk answer',
          },
        ]

        const riskSummary = roshRisksEnvelopeFactory.build()

        const taskData = {
          'risk-of-serious-harm': {
            'summary-data': {
              ...riskSummary,
              dateOfOasysImport: now,
            },
            'risk-to-others': {
              whoIsAtRisk: 'who is at risk answer',
              natureOfRisk: 'nature of risk answer',
            },
            'risk-factors': {
              whenIsRiskLikelyToBeGreatest: 'risk likely to be greatest answer',
              circumstancesLikelyToIncreaseRisk: 'circumstances likely to increase risk answer',
            },
            'reducing-risk': {
              factorsLikelyToReduceRisk: 'circumstances likely to reduce risk answer',
            },
            'oasys-import': { oasysImportDate: now },
          },
        }

        ;(dataServices.personService.getOasysRosh as jest.Mock).mockResolvedValue(oasys)
        ;(dataServices.personService.getRoshRisks as jest.Mock).mockResolvedValue(riskSummary)

        const page = (await OasysImport.initialize({}, application, 'some-token', dataServices)) as OasysImport

        expect(page.taskData).toBe(JSON.stringify(taskData))
        expect(page.hasOasysRecord).toBe(true)
        expect(page.oasysCompleted).toBe('29 August 2023')
        expect(page.oasysStarted).toBe('28 August 2023')
      })

      describe('when there is not a completed date', () => {
        it('does not assign a completed date', async () => {
          const oasysIncomplete = oasysRoshFactory.build({ dateCompleted: null })

          ;(dataServices.personService.getOasysRosh as jest.Mock).mockResolvedValue(oasysIncomplete)
          ;(dataServices.personService.getRoshRisks as jest.Mock).mockResolvedValue(null)

          const page = (await OasysImport.initialize({}, application, 'some-token', dataServices)) as OasysImport

          expect(page.oasysCompleted).toBe(null)
        })
      })
    })

    describe('when oasys sections are not returned', () => {
      it('sets hasOasysRecord to false when a 404 is returned', async () => {
        ;(dataServices.personService.getOasysRosh as jest.Mock).mockRejectedValue({ status: 404 })

        const page = (await OasysImport.initialize({}, application, 'some-token', dataServices)) as OasysImport

        expect(page.hasOasysRecord).toBe(false)
        expect(page.oasysCompleted).toBe(undefined)
        expect(page.oasysStarted).toBe(undefined)
      })

      it('throws error when an unexpected error is returned', async () => {
        const error = new Error()
        ;(dataServices.personService.getOasysRosh as jest.Mock).mockImplementation(() => {
          throw error
        })

        expect(OasysImport.initialize({}, application, 'some-token', dataServices)).rejects.toThrow(error)
      })
    })

    describe('when OASys data has already been imported', () => {
      it('returns the Rosh summary page', async () => {
        const roshData = {
          'risk-of-serious-harm': {
            'oasys-import': { oasysImportDate: now },
            'risk-factors': { circumstancesLikelyToIncreaseRisk: 'some answer' },
          },
        } as RoshTaskData

        const applicationWithData = applicationFactory.build({
          person: personFactory.build({ name: 'Roger Smith' }),
          data: roshData,
        })

        const roshSummaryPageConstructor = jest.fn()

        ;(Summary as jest.Mock).mockImplementation(() => {
          return roshSummaryPageConstructor
        })

        expect(OasysImport.initialize({}, applicationWithData, 'some-token', dataServices)).resolves.toEqual(
          roshSummaryPageConstructor,
        )

        expect(Summary).toHaveBeenCalledWith({}, applicationWithData)
      })

      describe("when there is data but it hasn't been imported from OASys", () => {
        it('returns the risk to others page', async () => {
          const roshData = {
            'risk-of-serious-harm': {
              'risk-factors': {
                circumstancesLikelyToIncreaseRisk: 'some answer',
                whenIsRiskLikelyToBeGreatest: 'some answer',
              },
            },
          } as RoshTaskData

          const applicationWithData = applicationFactory.build({
            person: personFactory.build({ name: 'Roger Smith' }),
            data: roshData,
          })

          const riskToOthersPageConstructor = jest.fn()

          ;(RiskToOthers as jest.Mock).mockImplementation(() => {
            return riskToOthersPageConstructor
          })

          expect(OasysImport.initialize({}, applicationWithData, 'some-token', dataServices)).resolves.toEqual(
            riskToOthersPageConstructor,
          )

          expect(RiskToOthers).toHaveBeenCalledWith({}, applicationWithData)
        })
      })
    })
  })

  itShouldHaveNextValue(new OasysImport({}, application, oasys, ''), 'summary')
  itShouldHavePreviousValue(new OasysImport({}, application, oasys, ''), 'taskList')

  describe('errors', () => {
    it('returns empty object', () => {
      const page = new OasysImport({}, application, oasys, '')

      expect(page.errors()).toEqual({})
    })
  })

  describe('response', () => {
    it('returns empty object', () => {
      const page = new OasysImport({}, application, oasys, '')

      expect(page.response()).toEqual({})
    })
  })
})
