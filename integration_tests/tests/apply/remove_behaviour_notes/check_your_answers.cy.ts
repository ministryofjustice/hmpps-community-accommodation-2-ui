//  Scenario: check my answers
//  Given a complete application exists with the previous application schema
//  When I view the 'check your answers' page
//  Then the page loads successfully

import Page from '../../../pages/page'
import CheckYourAnswersPage from '../../../pages/apply/check_your_answers/check-your-answers/checkYourAnswersPage'
import { personFactory, applicationFactory } from '../../../../server/testutils/factories/index'
import TaskListPage from '../../../pages/apply/taskListPage'

context('Check your answers page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationDataPreviousSchema.json').then(applicationData => {
      delete applicationData['check-your-answers']['check-your-answers']
      const application = applicationFactory.build({
        id: 'abc123',
        person,
        data: applicationData,
      })
      cy.wrap(application).as('application')
    })
  })

  beforeEach(function test() {
    // And an application exists with the previous application schema
    // -------------------------
    cy.task('stubApplicationGet', { application: this.application })
    cy.task('stubApplicationUpdate', { application: this.application })

    // Given I am logged in
    //---------------------
    cy.signIn()
  })

  //  Scenario: check my answers
  //  When I view the 'check your answers' page
  //  Then the page loads successfully
  it('presents check your answers page', function test() {
    //  When I view the 'check your answers' page
    TaskListPage.visit(this.application)
    const taskListPage = Page.verifyOnPage(TaskListPage)
    taskListPage.visitTask('Check application answers')
    const page = Page.verifyOnPage(CheckYourAnswersPage, this.application)

    //  Then the page loads successfully
    page.hasExpectedSummaryData()
    page.hasApplicantDetails(this.application)
  })
})