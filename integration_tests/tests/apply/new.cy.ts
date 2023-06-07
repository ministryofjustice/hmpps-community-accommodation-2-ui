import { Cas2Application as Application } from '@approved-premises/api'
import IndexPage from '../../pages'
import { personFactory, applicationFactory } from '../../../server/testutils/factories/index'

context('New', () => {
  const person = personFactory.build({})
  const applications = applicationFactory.buildList(3) as Array<Application>

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  beforeEach(() => {
    // Given I am logged in
    cy.signIn()
    // and there is Oasys data
    cy.fixture('oasysSections.json').then(riskData => {
      cy.task('stubOasysSections', {
        crn: person.crn,
        oasysSections: riskData,
      })
    })
    // and existing applications
    cy.task('stubApplications', applications)
  })

  it('shows existing applications, allows user to enter a CRN and see the first risk question data', () => {
    // Given I visit the start page
    IndexPage.visit()
    // And I click on the start button
    cy.get('[role="button"]').click()

    // Then I see all existing applications
    applications.forEach(app => {
      cy.get('td').contains(app.person.crn)
    })

    // And I see the CRN form
    // And enter a valid CRN
    cy.task('stubFindPerson', {
      person,
    })
    cy.get('#crn').type(person.crn)
    cy.get('button').contains('Save and continue').click()

    // Then I see the risks for that person
    cy.get('[id^=roshAnswers]').contains('Some answer for the first RoSH question')
  })

  it('renders with an empty CRN error if the CRN is not entered', () => {
    // Given I visit the start page
    IndexPage.visit()
    // And I click on the start button
    cy.get('[role="button"]').click()

    // And I see the CRN form
    // And I click submit without entering a CRN
    cy.get('button').contains('Save and continue').click()

    // Then I see an error message
    cy.get('.govuk-error-summary').should('contain', `You must enter a CRN`)
    cy.get(`[data-cy-error-crn]`).should('contain', `You must enter a CRN`)
  })

  it('renders with a CRN not found error if the API returns a 404', () => {
    // Given I visit the start page
    IndexPage.visit()
    // And I click on the start button
    cy.get('[role="button"]').click()

    // And I see the CRN form
    // And enter a CRN
    cy.task('stubPersonNotFound', {
      person,
    })
    cy.get('#crn').type(person.crn)
    cy.get('button').contains('Save and continue').click()

    // Then I see an error message
    cy.get('.govuk-error-summary').should('contain', `No person with a CRN of '${person.crn}' was found`)
    cy.get(`[data-cy-error-crn]`).should('contain', `No person with a CRN of '${person.crn}' was found`)
  })

  it('renders with an authorisation error if the API returns a 403', () => {
    // Given I visit the start page
    IndexPage.visit()
    // And I click on the start button
    cy.get('[role="button"]').click()

    // Then I see the CRN form
    // And enter a valid CRN
    cy.task('stubFindPersonForbidden', {
      person,
    })
    cy.get('#crn').type(person.crn)
    cy.get('button').contains('Save and continue').click()

    // Then I see an error message
    cy.get('.govuk-error-summary').should('contain', `You do not have permission to access this CRN`)
    cy.get(`[data-cy-error-crn]`).should('contain', `You do not have permission to access this CRN`)
  })

  it('does not render existing applications if none are returned', () => {
    // Given I visit the start page
    IndexPage.visit()
    // And there are no existing applications
    cy.task('stubApplications', [])
    // And I click on the start button
    cy.get('[role="button"]').click()

    // Then I see the new applications section
    cy.get('h2').contains('New applications')

    // And I do not see the existing applications section
    cy.get('h2').contains('Existing applications').should('not.exist')
  })
})
