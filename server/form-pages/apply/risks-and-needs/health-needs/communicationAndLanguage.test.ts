import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import CommunicationAndLanguage from './communicationAndLanguage'

describe('CommunicationAndLanguage', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new CommunicationAndLanguage({}, application)

      expect(page.title).toEqual('Communication and language needs for Roger Smith')
    })
  })

  describe('questions', () => {
    const page = new CommunicationAndLanguage({}, application)

    describe('hasCommunicationNeeds', () => {
      it('has a question', () => {
        expect(page.questions.hasCommunicationNeeds.question).toBeDefined()
      })
      it('has a follow-up question', () => {
        expect(page.questions.hasCommunicationNeeds.communicationDetail.question).toBeDefined()
      })
    })

    describe('requiresInterpreter', () => {
      it('has a question', () => {
        expect(page.questions.requiresInterpreter.question).toBeDefined()
      })
      it('has a follow-up question', () => {
        expect(page.questions.requiresInterpreter.interpretationDetail.question).toBeDefined()
      })
    })

    describe('hasSupportNeeds', () => {
      it('has a question', () => {
        expect(page.questions.hasSupportNeeds.question).toBeDefined()
      })
      it('has a follow-up question', () => {
        expect(page.questions.hasSupportNeeds.supportDetail.question).toBeDefined()
      })
    })
  })

  itShouldHaveNextValue(new CommunicationAndLanguage({}, application), 'learning-difficulties')
  itShouldHavePreviousValue(new CommunicationAndLanguage({}, application), 'mental-health')

  describe('response', () => {
    it('returns the correct plain english responses for the questions', () => {
      const page = new CommunicationAndLanguage(
        {
          hasCommunicationNeeds: 'yes',
          communicationDetail: 'Is hard of hearing',
          requiresInterpreter: 'yes',
          interpretationDetail: 'Welsh',
          hasSupportNeeds: 'yes',
          supportDetail: 'Struggles with written comprehension',
        },
        application,
      )

      expect(page.response()).toEqual({
        'Do they have any additional communication needs?': 'Yes',
        'Please describe their communication needs.': 'Is hard of hearing',

        'Do they need an interpreter?': 'Yes',
        'What language do they need an interpreter for?': 'Welsh',

        'Do they need any support to see, hear, speak, or understand?': 'Yes',
        'Please describe their support needs.': 'Struggles with written comprehension',
      })
    })
  })

  describe('errors', () => {
    it('not implemented', () => {
      const page = new CommunicationAndLanguage({}, application)

      expect(page.errors()).toEqual({})
    })
  })
})
