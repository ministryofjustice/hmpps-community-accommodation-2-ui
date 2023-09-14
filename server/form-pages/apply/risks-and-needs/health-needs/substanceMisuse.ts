import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy, sentenceCase } from '../../../../utils/utils'
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
  documentTitle = 'Health needs for the person'

  title = `Health needs for ${nameOrPlaceholderCopy(this.application.person)}`

  questions = {
    usesIllegalSubstances: {
      question: 'Do they take any illegal substances?',
      substanceMisuseHistory: {
        question: 'What substances do they take?',
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

    if (!this.body.usesIllegalSubstances) {
      errors.usesIllegalSubstances = `Confirm whether they take any illegal substances`
    }

    if (this.body.usesIllegalSubstances === 'yes' && !this.body.substanceMisuseHistory) {
      errors.substanceMisuseHistory = 'Name the illegal substances they take'
    }

    if (this.body.usesIllegalSubstances === 'yes' && !this.body.substanceMisuseDetail) {
      errors.substanceMisuseDetail = 'Describe how often they take substances, by what method and how much'
    }

    if (!this.body.engagedWithDrugAndAlcoholService) {
      errors.engagedWithDrugAndAlcoholService = `Confirm whether they are engaged with a drug and alcohol service`
    }

    if (this.body.engagedWithDrugAndAlcoholService === 'yes' && !this.body.drugAndAlcoholServiceDetail) {
      errors.drugAndAlcoholServiceDetail = 'Provide the name of the drug and alcohol service'
    }

    if (!this.body.requiresSubstituteMedication) {
      errors.requiresSubstituteMedication = `Confirm whether they require substitute medication`
    }

    if (this.body.requiresSubstituteMedication === 'yes' && !this.body.substituteMedicationDetail) {
      errors.substituteMedicationDetail = 'Provide details of their substitute medication'
    }

    return errors
  }

  response() {
    const response = {
      [this.questions.usesIllegalSubstances.question]: sentenceCase(this.body.usesIllegalSubstances),
      [this.questions.usesIllegalSubstances.substanceMisuseHistory.question]: this.body.substanceMisuseHistory,
      [this.questions.usesIllegalSubstances.substanceMisuseDetail.question]: this.body.substanceMisuseDetail,

      [this.questions.engagedWithDrugAndAlcoholService.question]: sentenceCase(
        this.body.engagedWithDrugAndAlcoholService,
      ),
      [this.questions.engagedWithDrugAndAlcoholService.drugAndAlcoholServiceDetail.question]:
        this.body.drugAndAlcoholServiceDetail,

      [this.questions.requiresSubstituteMedication.question]: sentenceCase(this.body.requiresSubstituteMedication),
      [this.questions.requiresSubstituteMedication.substituteMedicationDetail.question]:
        this.body.substituteMedicationDetail,
    }

    return response
  }
}
