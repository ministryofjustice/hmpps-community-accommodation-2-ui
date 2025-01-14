//  Feature: Assessor views a submitted application
//    So that I can assess a submitted application
//    As an external NACRO assessor
//    I want to view a particular submitted application
//
//  Scenario: follows an external link to the submitted application
//    Given a submitted application exists
//    And I am logged in as a NACRO assessor
//    When I navigate to the url of the submitted application
//    Then I see the assessor's read-only view of the submitted application
//    And I see a print button
//
//  Scenario: navigate to the 'update status' page
//    Given I'm viewing the submitted application
//    When I click the 'Update status' button
//    Then I am taken to the 'Update status' page

import { submittedApplicationFactory } from '../../../server/testutils/factories/index'
import paths from '../../../server/paths/assess'
import Page from '../../pages/page'
import SubmittedApplicationPage from '../../pages/assess/submittedApplicationPage'
import { fullPersonFactory } from '../../../server/testutils/factories/person'
import UpdateApplicationStatusPage from '../../pages/assess/updateApplicationStatusPage'

context('Assessor views submitted application', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAssessorUser')
  })

  beforeEach(() => {
    // Given a submitted application exists
    // I have submitted an application

    cy.fixture('applicationDocument.json').then(applicationDocument => {
      const submittedApplication = submittedApplicationFactory.build({
        id: 'abc123',
        document: applicationDocument,
        submittedAt: '2022-12-10T21:47:28Z',
        person: fullPersonFactory.build({ name: 'Robert Smith' }),
        telephoneNumber: '0800 123',
      })
      cy.wrap(submittedApplication).as('submittedApplication')
      cy.task('stubSubmittedApplicationGet', { application: submittedApplication })
    })

    // And I am logged in as a NACRO assessor
    cy.signIn()
  })

  //  Scenario: follows an external link to the submitted application
  // ----------------------------------------------
  it('follows an external link to the submitted application', function test() {
    // When I navigate to the url of the submitted application
    cy.visit(paths.submittedApplications.show({ id: this.submittedApplication.id }))

    // Then I see the assessor's read-only view of the submitted application
    Page.verifyOnPage(SubmittedApplicationPage, this.submittedApplication)
    const page = new SubmittedApplicationPage(this.submittedApplication)
    page.hasExpectedSummaryData()
    page.hasUpdateStatusButton()
    page.hasApplicantDetails(this.submittedApplication)
    page.hasSideNavBar(this.submittedApplication)
    page.hasQuestionsAndAnswersFromDocument(this.submittedApplication.document)

    //  And I see a print button
    page.shouldShowPrintButton()

    // And visually hidden PDF navigation links are on the page
    page.shouldContainHiddenPDFNavigationLinks()
  })

  //  Scenario: navigate to the 'update status' page
  // ----------------------------------------------
  it('allows me to navigate to the update status page', function test() {
    //  Given I'm viewing the submitted application
    const page = SubmittedApplicationPage.visit(this.submittedApplication)

    //  When I click the 'Update status' button
    cy.task('stubGetApplicationStatuses')
    page.clickLink('Update application status')

    //  Then I am taken to the 'Update status' page
    Page.verifyOnPage(UpdateApplicationStatusPage, this.submittedApplication)
  })
})
