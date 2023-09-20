import type { Cas2Application as Application, Cas2Application } from '@approved-premises/api'
import { stubFor } from '../../wiremock'

export default {
  stubCreateApplication: (args: { application: Application }) =>
    stubFor({
      request: {
        method: 'POST',
        url: `/cas2/applications`,
      },
      response: {
        status: 201,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: args.application,
      },
    }),
  stubApplications: (applications: Array<Application>) =>
    stubFor({
      request: {
        method: 'GET',
        url: `/cas2/applications`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: applications,
      },
    }),
  stubApplicationGet: (args: { application: Application }) =>
    stubFor({
      request: {
        method: 'GET',
        url: `/cas2/applications/${args.application.id}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: args.application,
      },
    }),
  stubApplicationUpdate: (args: { application: Application }) =>
    stubFor({
      request: {
        method: 'PUT',
        url: `/cas2/applications/${args.application.id}`,
      },
      response: {
        status: 201,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        body: `
        {
          "id": "{{request.pathSegments.[1]}}",
          "person": ${JSON.stringify(args.application.person)},
          "createdByProbationOfficerId": "${args.application.createdByUserId}",
          "schemaVersion": "${args.application.schemaVersion}",
          "createdAt": "${args.application.createdAt}",
          "submittedAt": "${args.application.submittedAt}",
          "data": {{{jsonPath request.body '$.data'}}}
        }
        `,
        transformers: ['response-template'],
      },
    }),
  stubApplicationSubmit: (args: { application: Cas2Application }) =>
    stubFor({
      request: {
        method: 'POST',
        url: `/cas2/applications/${args.application.id}/submission`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      },
    }),
}
