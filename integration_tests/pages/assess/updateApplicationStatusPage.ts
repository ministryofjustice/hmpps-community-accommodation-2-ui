import { Cas2SubmittedApplication as SubmittedApplication, FullPerson } from '@approved-premises/api'
import Page from '../page'

export default class UpdateApplicationStatusPage extends Page {
  constructor(private readonly application: SubmittedApplication) {
    const person = application.person as FullPerson
    super(`What is the status of ${person.name}'s application?`, person.name)
  }

  static visit(application: SubmittedApplication): UpdateApplicationStatusPage {
    cy.visit(`/assess/applications/${application.id}/update-status`)
    return new UpdateApplicationStatusPage(application)
  }
}
