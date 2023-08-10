import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'

type SubstanceMisuseBody = {
  usesIllegalSubstances: YesOrNo
  substanceMisuseHistory: string
  substanceMisuseDetail: string
  engagedWithDrugAndAlcoholService: YesOrNo
  drugAndAlcoholServiceDetail: string
  requiresSubstituteMedication: YesOrNo
  substituteMedicationDetail: string
}

@Page({
  name: 'substance-misuse',
  bodyProperties: [
    'usesIllegalSubstances',
    'substanceMisuseHistory',
    'substanceMisuseDetail',
    'engagedWithDrugAndAlcoholService',
    'drugAndAlcoholServiceDetail',
    'requiresSubstituteMedication',
    'substituteMedicationDetail',
  ],
})
export default class SubstanceMisuse implements TaskListPage {
  title = `Health needs for ${this.application.person.name}`

  questions = {
    usesIllegalSubstances: {
      question: 'Do they take any illegal substances?',
      substanceMisuseHistory: {
        question: 'What substances do they take?',
        hint: 'Please describe their recent history of substance misuse.',
      },
      substanceMisuseDetail: {
        question: 'How often do they take these substances, by what method, and how much?',
      },
    },
    engagedWithDrugAndAlcoholService: {
      question: 'Are they engaged with a drug and alcohol service?',
      drugAndAlcoholServiceDetail: {
        question: 'Name the drug and alcohol service',
      },
    },
    requiresSubstituteMedication: {
      question: 'Do they require any substitute medication for misused substances?',
      substituteMedicationDetail: {
        question: 'What substitute medication do they take?',
      },
    },
  }

  body: SubstanceMisuseBody

  constructor(
    body: Partial<SubstanceMisuseBody>,
    private readonly application: Application,
  ) {
    this.body = body as SubstanceMisuseBody
  }

  previous() {
    return 'taskList'
  }

  next() {
    return 'physical-health'
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
