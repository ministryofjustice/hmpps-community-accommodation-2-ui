import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import OtherBackground from './otherBackground'

describe('OtherBackground', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new OtherBackground({}, application)

      expect(page.title).toEqual('Equality and diversity questions for Roger Smith')
    })
  })

  itShouldHaveNextValue(new OtherBackground({}, application), '')
  itShouldHavePreviousValue(new OtherBackground({}, application), 'ethnic-group')

  describe('response', () => {
    it('Adds selected option to page response in _translated_ form', () => {
      const page = new OtherBackground({ otherBackground: 'arab' }, application)

      expect(page.response()).toEqual({
        "Which of the following best describes Roger Smith's background?": 'Arab',
        'How would they describe their background? (optional)': undefined,
      })
    })

    it('Adds optional background data to page response in _translated_ form', () => {
      const page = new OtherBackground({ otherBackground: 'other', optionalOtherBackground: 'example' }, application)

      expect(page.response()).toEqual({
        "Which of the following best describes Roger Smith's background?": 'Any other ethnic group',
        'How would they describe their background? (optional)': 'example',
      })
    })

    it('Deletes fields where there is not an answer', () => {
      const page = new OtherBackground({ otherBackground: undefined, optionalOtherBackground: undefined }, application)

      expect(page.response()).toEqual({})
    })
  })

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new OtherBackground({ otherBackground: 'arab' }, application)
      const optionalExample = 'example'

      expect(page.items(optionalExample)).toEqual([
        {
          checked: true,
          text: 'Arab',
          value: 'arab',
        },
        {
          checked: false,
          conditional: {
            html: 'example',
          },
          text: 'Any other ethnic group',
          value: 'other',
        },
        {
          divider: 'or',
        },
        {
          checked: false,
          text: 'Prefer not to say',
          value: 'preferNotToSay',
        },
      ])
    })
  })

  describe('errors', () => {
    it('should return errors when the questions are blank', () => {
      const page = new OtherBackground({}, application)

      expect(page.errors()).toEqual({
        otherBackground: "Select a background or 'Prefer not to say'",
      })
    })

    it('should not return an error when the optional question is missing', () => {
      const page = new OtherBackground({ otherBackground: 'other', optionalOtherBackground: undefined }, application)

      expect(page.errors()).toEqual({})
    })
  })
})
