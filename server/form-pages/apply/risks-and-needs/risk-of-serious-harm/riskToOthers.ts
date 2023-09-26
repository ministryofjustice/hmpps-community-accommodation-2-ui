import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getOasysImportDateFromApplication } from '../../../utils'
import { convertKeyValuePairToCheckboxItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'

type RiskToOthersBody = { whoIsAtRisk: string; natureOfRisk: string; confirmation: string }

@Page({
  name: 'risk-to-others',
  bodyProperties: ['whoIsAtRisk', 'natureOfRisk', 'confirmation'],
})
export default class RiskToOthers implements TaskListPage {
  documentTitle = 'Risk to others for the person'

  title = `Risk to others for ${nameOrPlaceholderCopy(this.application.person)}`

  body: RiskToOthersBody

  questions = {
    whoIsAtRisk: {
      question: 'Who is at risk?',
    },
    natureOfRisk: {
      question: 'What is the nature of the risk?',
    },
    confirmation: {
      question: 'I confirm this information is relevant and up to date.',
    },
  }

  importDate = getOasysImportDateFromApplication(this.application, 'risk-of-serious-harm')

  constructor(
    body: Partial<RiskToOthersBody>,
    private readonly application: Application,
  ) {
    this.body = body as RiskToOthersBody
  }

  previous() {
    return 'summary'
  }

  next() {
    return 'risk-factors'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.confirmation) {
      errors.confirmation = errorLookups.oasysConfirmation.empty
    }
    if (!this.body.natureOfRisk) {
      errors.natureOfRisk = errorLookups.natureOfRisk.empty
    }
    if (!this.body.whoIsAtRisk) {
      errors.whoIsAtRisk = errorLookups.whoIsAtRisk.empty
    }

    return errors
  }

  response() {
    const response = {
      [this.questions.whoIsAtRisk.question]: this.body.whoIsAtRisk,
      [this.questions.natureOfRisk.question]: this.body.natureOfRisk,
      [this.questions.confirmation.question]: this.body.confirmation,
    }

    return response
  }

  items() {
    return convertKeyValuePairToCheckboxItems({ confirmed: this.questions.confirmation.question }, [
      this.body.confirmation,
    ])
  }
}
