import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { sentenceCase } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'

type CommunicationAndLanguageBody = {
  hasCommunicationNeeds: YesOrNo
  communicationDetail: string
  requiresInterpreter: YesOrNo
  interpretationDetail: string
  hasSupportNeeds: YesOrNo
  supportDetail: string
}

@Page({
  name: 'communication-and-language',
  bodyProperties: [
    'hasCommunicationNeeds',
    'communicationDetail',
    'requiresInterpreter',
    'interpretationDetail',
    'hasSupportNeeds',
    'supportDetail',
  ],
})
export default class CommunicationAndLanguage implements TaskListPage {
  title = `Communication and language needs for ${this.application.person.name}`

  questions = {
    hasCommunicationNeeds: {
      question: 'Do they have any additional communication needs?',
      communicationDetail: {
        question: 'Please describe their communication needs.',
      },
    },
    requiresInterpreter: {
      question: 'Do they need an interpreter?',
      interpretationDetail: {
        question: 'What language do they need an interpreter for?',
      },
    },
    hasSupportNeeds: {
      question: 'Do they need any support to see, hear, speak, or understand?',
      supportDetail: {
        question: 'Please describe their support needs.',
      },
    },
  }

  body: CommunicationAndLanguageBody

  constructor(
    body: Partial<CommunicationAndLanguageBody>,
    private readonly application: Application,
  ) {
    this.body = body as CommunicationAndLanguageBody
  }

  previous() {
    return 'mental-health'
  }

  next() {
    return 'learning-difficulties'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }

  response() {
    const response = {
      [this.questions.hasCommunicationNeeds.question]: sentenceCase(this.body.hasCommunicationNeeds),
      [this.questions.hasCommunicationNeeds.communicationDetail.question]: this.body.communicationDetail,

      [this.questions.requiresInterpreter.question]: sentenceCase(this.body.requiresInterpreter),
      [this.questions.requiresInterpreter.interpretationDetail.question]: this.body.interpretationDetail,

      [this.questions.hasSupportNeeds.question]: sentenceCase(this.body.hasSupportNeeds),
      [this.questions.hasSupportNeeds.supportDetail.question]: this.body.supportDetail,
    }

    return response
  }
}
