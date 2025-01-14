import { ApplicationDocument } from '@approved-premises/ui'
import { Result } from 'axe-core'
import errorLookups from '../../server/i18n/en/errors.json'
import { DateFormats } from '../../server/utils/dateUtils'
import { Cas2Application as Application } from '../../server/@types/shared/models/Cas2Application'
import { Cas2SubmittedApplication as SubmittedApplication } from '../../server/@types/shared/models/Cas2SubmittedApplication'
import { FullPerson } from '../../server/@types/shared/models/FullPerson'
import { stringToKebabCase } from '../../server/utils/utils'
import { Cas2ApplicationSummary } from '../../server/@types/shared/models/Cas2ApplicationSummary'
import paths from '../../server/paths/apply'
import 'cypress-axe'

export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new (...args: Array<unknown>) => T, ...args: Array<unknown>): T {
    return new constructor(...args)
  }

  constructor(
    private readonly title: string,
    private readonly name: string,
  ) {
    this.checkOnPage()
    this.checkNameIsNotInDocumentTitle()
  }

  checkOnPage(): void {
    cy.get('h1').contains(this.title)
    cy.injectAxe()
    cy.configureAxe({
      rules: [
        // Temporary rule whilst this issue is resolved https://github.com/w3c/aria/issues/1404
        { id: 'aria-allowed-attr', reviewOnFail: true },
        // Ignore the "All page content should be contained by landmarks", which conflicts with GOV.UK guidance (https://design-system.service.gov.uk/components/back-link/#how-it-works)
        { id: 'region', reviewOnFail: true, selector: '.govuk-back-link' },
      ],
    })
    cy.checkA11y(undefined, undefined, this.logAccessibilityViolations)
  }

  checkNameIsNotInDocumentTitle(): void {
    cy.title().should('not.include', this.name)
  }

  signOut = (): PageElement => cy.get('[data-qa=signOut]')

  manageDetails = (): PageElement => cy.get('[data-qa=manageDetails]')

  clickSubmit(text = 'Save and continue'): void {
    cy.get('button').contains(text).click()
  }

  clickContinue(): void {
    cy.get('a').contains('Continue').click()
  }

  shouldShowErrorMessagesForFields(fields: Array<string>, error?: string): void {
    fields.forEach(field => {
      const errorMessagesLookup = error || errorLookups[error || field].empty

      cy.get('.govuk-error-summary').should('contain', errorMessagesLookup)
      cy.get(`[data-cy-error-${field}]`).should('contain', errorMessagesLookup)
    })
  }

  shouldShowErrorSummaryForId(id: string, errorMessage: string): void {
    cy.get('a').contains(errorMessage).should('have.attr', 'href', `#${id}`)
  }

  checkRadioByNameAndValue(name: string, option: string): void {
    cy.get(`input[name="${name}"][value="${option}"]`).check()
  }

  clickBack(): void {
    cy.get('a').contains('Back').click()
  }

  getTextInputByIdAndEnterDetails(id: string, details: string): void {
    cy.get(`#${id}`).type(details)
  }

  getSelectInputByIdAndSelectAnEntry(id: string, entry: string): void {
    cy.get(`#${id}`).select(entry)
  }

  checkCheckboxByValue(option: string): void {
    cy.get(`input[value="${option}"]`).check()
  }

  uncheckAllCheckboxes(): void {
    cy.get(':checkbox').uncheck()
  }

  completeDateInputs(prefix: string, date: string): void {
    const parsedDate = DateFormats.isoToDateObj(date)
    cy.get(`#${prefix}-day`).type(parsedDate.getDate().toString())
    cy.get(`#${prefix}-month`).type(`${parsedDate.getMonth() + 1}`)
    cy.get(`#${prefix}-year`).type(parsedDate.getFullYear().toString())
  }

  checkValueOfTextInputById(id: string, expectedValue: string): void {
    cy.get(`#${id}`).should('have.value', expectedValue)
  }

  clickRemove(): void {
    cy.get('a').contains('Remove').click()
  }

  removeWhiteSpaceAndLineBreaks(stringToReplace: string = ''): string {
    return stringToReplace.trim().replace(/(\r\n|\n|\r)/gm, '')
  }

  removeHtmlBreaks(stringToReplace: string): string {
    return stringToReplace.replace(/<br \/>/g, '')
  }

  hasQuestionsAndAnswersFromDocument(document: ApplicationDocument) {
    const { sections } = document
    sections.forEach(section => {
      cy.get('h2').contains(section.title)
      section.tasks.forEach(task => {
        cy.get('h3').contains(task.title)
        task.questionsAndAnswers.forEach(question => {
          this.checkTermAndDescription(question.question, question.answer)
        })
      })
    })
  }

  checkTermAndDescription(term: string, description: string): void {
    const formattedDescription = this.removeWhiteSpaceAndLineBreaks(description)
    const formattedTerm = this.removeHtmlBreaks(term)

    cy.get('dt')
      .contains(formattedTerm)
      .parents('.govuk-summary-list__row')
      .within(() => {
        cy.get('dd').invoke('text').should('contain', formattedDescription)
      })
  }

  clickLink(label: string): void {
    cy.get('a:visible').contains(label).click()
  }

  shouldShowPrintButton(text = 'Download as a PDF'): void {
    cy.get('button').contains(text)
  }

  shouldContainHiddenPDFNavigationLinks(): void {
    cy.get('a:hidden').contains('View application overview')
    cy.get('a:hidden').contains('Update application status')
  }

  clickPrintButton(): void {
    cy.get('button').contains('Download as a PDF').click()
  }

  shouldPrint(): void {
    cy.window().then(win => {
      cy.stub(win, 'print').as('printStub')
    })

    this.clickPrintButton()

    cy.get('@printStub').should('be.calledOnce')
  }

  hasApplicantDetails(application: SubmittedApplication): void {
    const person = application.person as FullPerson
    cy.get(`[data-cy-check-your-answers-section="applicant-details"]`).within(() => {
      this.checkTermAndDescription('Full name', person.name)
      this.checkTermAndDescription(
        'Date of birth',
        DateFormats.isoDateToUIDate(person.dateOfBirth, { format: 'short' }),
      )
      this.checkTermAndDescription('Nationality', person.nationality)
      this.checkTermAndDescription('Sex', person.sex)
      this.checkTermAndDescription('Prison number', person.nomsNumber)
      cy.get('dt')
        .contains(/Prison $/)
        .parent()
        .within(() => {
          cy.get('dd').invoke('text').should('contain', person.prisonName)
        })
      this.checkTermAndDescription('PNC number', person.pncNumber)
      this.checkTermAndDescription('CRN from NDelius', person.crn)
    })
  }

  hasSideNavBar(application: SubmittedApplication) {
    const document = application.document as ApplicationDocument

    cy.get('.side-nav').within(() => {
      document.sections.forEach(section => {
        section.tasks.forEach(task => {
          cy.get(`a[href="#${stringToKebabCase(task.title)}"]`)
        })
      })
    })
  }

  shouldShowApplicationSummaryDetails(application: Application | SubmittedApplication): void {
    const person = application.person as FullPerson
    cy.get('h1').contains(person.name)

    const status = application.assessment?.statusUpdates?.length
      ? application.assessment.statusUpdates[0].label
      : 'Received'

    cy.get('p').contains(`Current status: ${status}`)

    cy.get('p').contains(
      `This application was submitted on ${DateFormats.isoDateToUIDate(application.submittedAt, {
        format: 'medium',
      })}.`,
    )
  }

  shouldShowTimeline(application: Application | SubmittedApplication): void {
    const sortedTimelineEvents = application.timelineEvents.sort((a, b) => {
      return new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    })

    cy.get('.moj-timeline').within(() => {
      cy.get('.moj-timeline__item').should('have.length', application.timelineEvents.length)

      cy.get('.moj-timeline__item').each(($el, index) => {
        cy.wrap($el).within(() => {
          cy.get('.moj-timeline__header').should('contain', sortedTimelineEvents[index].label)
          cy.get('.moj-timeline__byline').should('contain', sortedTimelineEvents[index].createdByName)
          cy.get('time').should('have.attr', { time: sortedTimelineEvents[index].occurredAt })
          cy.get('time').should('contain', DateFormats.isoDateTimeToUIDateTime(sortedTimelineEvents[index].occurredAt))
          if (sortedTimelineEvents[index].body) {
            cy.get('.moj-timeline__description').should('contain', sortedTimelineEvents[index].body)
          }
        })
      })
    })
  }

  shouldShowSuccessMessage(message: string): void {
    cy.get('h2').contains('Success')
    cy.get('h3').contains(message)
  }

  shouldShowApplications(applications: Array<Cas2ApplicationSummary>, inProgress = false): void {
    applications.forEach(application => {
      const { personName } = application
      cy.contains(personName)
        .should(
          'have.attr',
          'href',
          inProgress
            ? paths.applications.show({ id: application.id })
            : paths.applications.overview({ id: application.id }),
        )
        .parent()
        .parent()
        .within(() => {
          cy.get('th').eq(0).contains(personName)
        })
    })
  }

  logAccessibilityViolations(violations: Result[]): void {
    cy.task('logAccessibilityViolationsSummary', `Accessibility violations detected: ${violations.length}`)

    const violationData = violations.map(({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
      nodeTargets: nodes.map(node => node.target).join(' - '),
    }))

    cy.task('logAccessibilityViolationsTable', violationData)
  }
}
