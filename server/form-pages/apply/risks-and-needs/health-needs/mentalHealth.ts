import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type MentalHealthBody = {
  hasMentalHealthNeeds: YesOrNo
  needsDetail: string
  isEngagedWithCommunity: YesOrNo
  servicesDetail: string
  hasPrescribedMedication: YesOrNo
  isInPossessionOfMeds: YesOrNo
  medicationDetail: string
  medicationIssues: string
}

@Page({
  name: 'mental-health',
  bodyProperties: [
    'hasMentalHealthNeeds',
    'needsDetail',
    'isEngagedWithCommunity',
    'servicesDetail',
    'hasPrescribedMedication',
    'isInPossessionOfMeds',
    'medicationDetail',
    'medicationIssues',
  ],
})
export default class MentalHealth implements TaskListPage {
  documentTitle = 'Mental health needs for the person'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Mental health needs for ${this.personName}`

  questions = getQuestions(this.personName)['health-needs']['mental-health']

  body: MentalHealthBody

  constructor(
    body: Partial<MentalHealthBody>,
    private readonly application: Application,
  ) {
    this.body = body as MentalHealthBody
  }

  previous() {
    return 'physical-health'
  }

  next() {
    return 'communication-and-language'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.hasMentalHealthNeeds) {
      errors.hasMentalHealthNeeds = 'Confirm whether they have mental health needs'
    }
    if (this.body.hasMentalHealthNeeds === 'yes' && !this.body.needsDetail) {
      errors.needsDetail = 'Describe mental health needs'
    }

    if (!this.body.isEngagedWithCommunity) {
      errors.isEngagedWithCommunity = 'Confirm whether they are engaged with services'
    }
    if (this.body.isEngagedWithCommunity === 'yes' && !this.body.servicesDetail) {
      errors.servicesDetail = 'State the services with which they have engaged'
    }

    if (!this.body.hasPrescribedMedication) {
      errors.hasPrescribedMedication = 'Confirm whether they are prescribed medication'
    }

    if (this.body.hasPrescribedMedication === 'yes') {
      if (!this.body.isInPossessionOfMeds) {
        errors.isInPossessionOfMeds = 'Confirm whether they have their medication'
      }

      if (!this.body.medicationDetail) {
        errors.medicationDetail = 'List their mental health medication'
      }
    }

    return errors
  }

  onSave(): void {
    if (this.body.hasMentalHealthNeeds !== 'yes') {
      delete this.body.needsDetail
    }

    if (this.body.isEngagedWithCommunity !== 'yes') {
      delete this.body.servicesDetail
    }

    if (this.body.hasPrescribedMedication !== 'yes') {
      delete this.body.isInPossessionOfMeds
      delete this.body.medicationDetail
      delete this.body.medicationIssues
    }
  }
}
