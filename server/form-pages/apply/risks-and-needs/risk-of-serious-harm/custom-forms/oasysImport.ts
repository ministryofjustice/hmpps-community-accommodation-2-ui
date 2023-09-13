import type { DataServices, TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application, OASysRiskOfSeriousHarm } from '@approved-premises/api'
import { Page } from '../../../../utils/decorators'
import TaskListPage from '../../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../../utils/utils'
import RiskToOthers from '../riskToOthers'
import { DateFormats } from '../../../../../utils/dateUtils'
import Summary from '../summary'

type OasysImportBody = Record<string, never>

export type RoshTaskData = {
  'risk-of-serious-harm': {
    'risk-to-others': {
      whoIsAtRisk: string
      natureOfRisk: string
      dateOfOasysImport: Date
    }
    'risk-factors': {
      circumstancesLikelyToIncreaseRisk: string
      whenIsRiskLikelyToBeGreatest: string
      dateOfOasysImport: Date
    }
    'reducing-risk': {
      factorsLikelyToReduceRisk: string
      dateOfOasysImport: Date
    }
  }
}

@Page({
  name: 'oasys-import',
  bodyProperties: [],
})
export default class OasysImport implements TaskListPage {
  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Import ${nameOrPlaceholderCopy(this.application.person)}'s risk of serious harm (RoSH) data from OASys`

  body: OasysImportBody

  taskData: string

  hasOasysRecord: boolean

  oasysCompleted: string

  oasysStarted: string

  noOasysBannerText = `No OASys record available to import for ${this.personName}`

  noOasysDescriptiveText = `No information can be imported for the Risk of Serious Harm (RoSH) section because ${this.personName} 
                            does not have a Layer 3 OASys completed in the last 6 months.`

  taskName = 'risk-of-serious-harm'

  constructor(
    body: Partial<OasysImportBody>,
    private readonly application: Application,
    oasys: OASysRiskOfSeriousHarm,
    taskData: string,
  ) {
    this.body = body as OasysImportBody
    this.hasOasysRecord = (oasys && Boolean(Object.keys(oasys).length)) || false
    if (this.hasOasysRecord) {
      this.oasysStarted = oasys.dateStarted && DateFormats.isoDateToUIDate(oasys.dateStarted, { format: 'medium' })
      this.oasysCompleted =
        oasys.dateCompleted && DateFormats.isoDateToUIDate(oasys.dateCompleted, { format: 'medium' })
    }
    this.taskData = taskData
  }

  static async initialize(
    body: Partial<OasysImportBody>,
    application: Application,
    token: string,
    dataServices: DataServices,
  ) {
    let oasys
    let taskDataJson

    if (!application.data['risk-of-serious-harm']) {
      try {
        oasys = await dataServices.personService.getOasysRosh(token, application.person.crn)

        taskDataJson = JSON.stringify(OasysImport.getTaskData(oasys))
      } catch (e) {
        if (e.status === 404) {
          oasys = null
        } else {
          throw e
        }
      }
      return new OasysImport(body, application, oasys, taskDataJson)
    }
    if (OasysImport.isRoshApplicationDataImportedFromOASys(application)) {
      return new Summary(application.data['risk-of-serious-harm'].summary ?? {}, application)
    }
    return new RiskToOthers(application.data['risk-of-serious-harm']['risk-to-others'] ?? {}, application)
  }

  private static isRoshApplicationDataImportedFromOASys(application: Application): boolean {
    const rosh = application.data['risk-of-serious-harm']
    if (
      (rosh?.['risk-to-others'] && 'dateOfOasysImport' in rosh['risk-to-others']) ||
      (rosh?.['risk-factors'] && 'dateOfOasysImport' in rosh['risk-factors']) ||
      (rosh?.['reducing-risk'] && 'dateOfOasysImport' in rosh['reducing-risk'])
    ) {
      return true
    }
    return false
  }

  private static getTaskData(oasysSections: OASysRiskOfSeriousHarm): Partial<RoshTaskData> {
    const taskData = { 'risk-of-serious-harm': {} } as Partial<RoshTaskData>
    const today = new Date()

    oasysSections.rosh.forEach(question => {
      switch (question.questionNumber) {
        case 'R10.1':
          taskData['risk-of-serious-harm']['risk-to-others'] = {
            ...taskData['risk-of-serious-harm']['risk-to-others'],
            whoIsAtRisk: question.answer,
            dateOfOasysImport: today,
          }
          break
        case 'R10.2':
          taskData['risk-of-serious-harm']['risk-to-others'] = {
            ...taskData['risk-of-serious-harm']['risk-to-others'],
            natureOfRisk: question.answer,
            dateOfOasysImport: today,
          }
          break
        case 'R10.3':
          taskData['risk-of-serious-harm']['risk-factors'] = {
            ...taskData['risk-of-serious-harm']['risk-factors'],
            whenIsRiskLikelyToBeGreatest: question.answer,
            dateOfOasysImport: today,
          }
          break
        case 'R10.4':
          taskData['risk-of-serious-harm']['risk-factors'] = {
            ...taskData['risk-of-serious-harm']['risk-factors'],
            circumstancesLikelyToIncreaseRisk: question.answer,
            dateOfOasysImport: today,
          }
          break
        case 'R10.5':
          taskData['risk-of-serious-harm']['reducing-risk'] = {
            factorsLikelyToReduceRisk: question.answer,
            dateOfOasysImport: today,
          }
          break
        default:
          break
      }
    })

    return taskData
  }

  previous() {
    return 'taskList'
  }

  next() {
    return 'summary'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }

  response() {
    const response = {}

    return response
  }
}
