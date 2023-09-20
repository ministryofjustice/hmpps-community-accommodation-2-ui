/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { execSync } from 'child_process'
import path from 'path'
import { diffStringsUnified } from 'jest-diff'

export {}

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchStringIgnoringWhitespace(expected: string): R
      toMatchOpenAPISpec(): R
    }
  }
}

expect.extend({
  toMatchStringIgnoringWhitespace(received, expected) {
    const pass = received.replace(/\s+/g, ``) === expected.replace(/\s+/g, ``)

    return {
      pass,
      message: pass
        ? () => `expected received not to match expected ${diffStringsUnified(expected, received)}`
        : () => `expected received to match expected ${diffStringsUnified(expected, received)}`,
    }
  },
  toMatchOpenAPISpec(pactPath) {
    const openAPIUrl =
      'https://raw.githubusercontent.com/ministryofjustice/hmpps-approved-premises-api/ddf95a65a402ac9d3c83ab80ecd2442ed4a20b03/src/main/resources/static/api.yml'

    const openAPIPath = path.join(__dirname, '..', '..', 'tmp', 'api.yml')

    try {
      execSync(`
          if [ ! -f ${openAPIPath} ]; then
            curl -s "${openAPIUrl}" > ${openAPIPath}
          fi
        `)
      execSync(`npx swagger-mock-validator ${openAPIPath} ${pactPath}`)
      return {
        message: () => `Swagger mock validator for ${pactPath} did not fail`,
        pass: true,
      }
    } catch (err) {
      return {
        message: () => err.output.toString(),
        pass: false,
      }
    }
  },
})
