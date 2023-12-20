/* eslint-disable no-param-reassign */
/* istanbul ignore file */

import * as pathModule from 'path'
import nunjucks from 'nunjucks'
import express from 'express'

import { PersonStatus, ErrorMessages } from '@approved-premises/ui'
import applicationPaths from '../paths/apply'
import assessPaths from '../paths/assess'
import reportPaths from '../paths/report'
import config from '../config'
import { initialiseName, removeBlankSummaryListItems } from './utils'
import {
  documentSummaryListRows,
  inProgressApplicationTableRows,
  submittedApplicationTableRows,
} from './applicationUtils'
import * as TaskListUtils from './taskListUtils'
import * as OasysImportUtils from './oasysImportUtils'
import { dateFieldValues } from './formUtils'
import { checkYourAnswersSections, getApplicantDetails } from './checkYourAnswersUtils'
import { DateFormats } from './dateUtils'
import { getApplicationTimelineEvents } from './applications/utils'
import { applicationStatusRadios } from './assessUtils'
import { statusTag } from './personUtils'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, path: pathModule.PlatformPath): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'CAS-2'

  // Cachebusting version string
  if (production) {
    // Version only changes on reboot
    app.locals.version = Date.now().toString()
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/',
      'node_modules/govuk-frontend/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  njkEnv.addFilter('initialiseName', initialiseName)

  njkEnv.addGlobal('fetchContext', function fetchContext() {
    return this.ctx
  })

  njkEnv.addGlobal('mergeObjects', (obj1: Record<string, unknown>, obj2: Record<string, unknown>) => {
    return { ...obj1, ...obj2 }
  })

  njkEnv.addGlobal('OasysImportUtils', OasysImportUtils)

  njkEnv.addGlobal('paths', { ...applicationPaths, ...assessPaths, ...reportPaths })
  njkEnv.addGlobal('TaskListUtils', TaskListUtils)

  njkEnv.addGlobal('inProgressApplicationTableRows', inProgressApplicationTableRows)
  njkEnv.addGlobal('submittedApplicationTableRows', submittedApplicationTableRows)
  njkEnv.addGlobal('documentSummaryListRows', documentSummaryListRows)

  const {
    analytics: { tagManagerId },
  } = config
  if (tagManagerId) {
    njkEnv.addGlobal('tagManagerId', tagManagerId.trim())
    njkEnv.addGlobal('tagManagerUrl', `https://www.googletagmanager.com/ns.html?id=${tagManagerId.trim()}`)
  }

  njkEnv.addGlobal('dateFieldValues', function sendContextToDateFieldValues(fieldName: string, errors: ErrorMessages) {
    return dateFieldValues(fieldName, this.ctx, errors)
  })
  njkEnv.addGlobal('formatDate', DateFormats.isoDateToUIDate)

  njkEnv.addGlobal('checkYourAnswersSections', checkYourAnswersSections)
  njkEnv.addGlobal('getApplicantDetails', getApplicantDetails)

  njkEnv.addGlobal('getApplicationTimelineEvents', getApplicationTimelineEvents)
  njkEnv.addGlobal('applicationStatusRadios', applicationStatusRadios)

  njkEnv.addFilter('removeBlankSummaryListItems', removeBlankSummaryListItems)

  const markAsSafe = (html: string): string => {
    const safeFilter = njkEnv.getFilter('safe')
    return safeFilter(html)
  }

  njkEnv.addGlobal('statusTag', (status: PersonStatus) => markAsSafe(statusTag(status)))
}
