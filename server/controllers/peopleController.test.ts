import type { NextFunction, Request, Response } from 'express'
import { DeepMocked, createMock } from '@golevelup/ts-jest'

import paths from '../paths/apply'
import PeopleController from './peopleController'
import { errorMessage, errorSummary } from '../utils/validation'
import PersonService from '../services/personService'
import ApplicationService from '../services/applicationService'
import { fullPersonFactory, restrictedPersonFactory } from '../testutils/factories/person'
import applicationFactory from '../testutils/factories/application'

describe('peopleController', () => {
  const flashSpy = jest.fn()
  const token = 'SOME_TOKEN'
  const prisonNumber = '1234'

  let request: DeepMocked<Request> = createMock<Request>({ user: { token } })
  let response: DeepMocked<Response> = createMock<Response>({})
  const next: DeepMocked<NextFunction> = jest.fn()

  const personService = createMock<PersonService>({})
  const applicationService = createMock<ApplicationService>({})

  let peopleController: PeopleController

  beforeEach(() => {
    peopleController = new PeopleController(applicationService, personService)
    request = createMock<Request>({
      body: { prisonNumber },
      user: { token },
      flash: flashSpy,
      headers: {
        referer: 'some-referrer/',
      },
    })
    response = createMock<Response>({})
    jest.clearAllMocks()
  })

  describe('find', () => {
    describe('when there is a prison number', () => {
      it('redirects to the show applications path', async () => {
        const requestHandler = peopleController.find()

        personService.findByPrisonNumber.mockResolvedValue(fullPersonFactory.build({}))
        applicationService.createApplication.mockResolvedValue(applicationFactory.build({ id: '123abc' }))

        await requestHandler(request, response, next)

        expect(response.redirect).toHaveBeenCalledWith(paths.applications.show({ id: '123abc' }))
      })

      describe('when there are errors', () => {
        describe('when there is a 404 error', () => {
          it('renders a not found error message', async () => {
            const requestHandler = peopleController.find()

            const err = { data: {}, status: 404 }

            personService.findByPrisonNumber.mockImplementation(() => {
              throw err
            })

            request.body.prisonNumber = 'SOME_NUMBER'

            await requestHandler(request, response, next)

            expect(request.flash).toHaveBeenCalledWith('errors', {
              prisonNumber: errorMessage(
                'prisonNumber',
                `No person with a prison number of '${request.body.prisonNumber}' was found`,
              ),
            })
            expect(request.flash).toHaveBeenCalledWith('errorSummary', [
              errorSummary(
                'prisonNumber',
                `No person with a prison number of '${request.body.prisonNumber}' was found`,
              ),
            ])
            expect(response.redirect).toHaveBeenCalledWith(request.headers.referer)
          })
        })

        describe('when there is a 403 error', () => {
          it('renders a permissions error message', async () => {
            const requestHandler = peopleController.find()

            const err = { data: {}, status: 403 }

            personService.findByPrisonNumber.mockImplementation(() => {
              throw err
            })

            request.body.prisonNumber = 'SOME_NUMBER'

            await requestHandler(request, response, next)

            expect(request.flash).toHaveBeenCalledWith('errors', {
              prisonNumber: errorMessage(
                'prisonNumber',
                'You do not have permission to access the prison number SOME_NUMBER',
              ),
            })
            expect(request.flash).toHaveBeenCalledWith('errorSummary', [
              errorSummary('prisonNumber', 'You do not have permission to access the prison number SOME_NUMBER'),
            ])
            expect(response.redirect).toHaveBeenCalledWith(request.headers.referer)
          })
        })

        describe('when there is an error of another type', () => {
          it('throws the error', async () => {
            const requestHandler = peopleController.find()

            const err = new Error()

            personService.findByPrisonNumber.mockImplementation(() => {
              throw err
            })

            request.body.nomsNumber = 'SOME_NUMBER'

            expect(async () => requestHandler(request, response, next)).rejects.toThrow(err)
          })
        })
      })
    })

    describe('when there is not a prison number', () => {
      it('sends an error to the flash if a prison number has not been provided', async () => {
        request.body = {}

        const requestHandler = peopleController.find()

        await requestHandler(request, response, next)

        expect(response.redirect).toHaveBeenCalledWith('some-referrer/')

        expect(flashSpy).toHaveBeenCalledWith('errors', {
          prisonNumber: errorMessage('prisonNumber', 'You must enter a prison number'),
        })
        expect(flashSpy).toHaveBeenCalledWith('errorSummary', [
          errorSummary('prisonNumber', 'You must enter a prison number'),
        ])
      })
    })
  })
})
