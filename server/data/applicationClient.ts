import {
  Cas2Application as Application,
  Cas2ApplicationSummary,
  Cas2NewApplication,
  SubmitCas2Application,
  UpdateApplication,
} from '@approved-premises/api'
import { UpdateCas2Application } from '../@types/shared/models/UpdateCas2Application'
import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import paths from '../paths/api'

export default class ApplicationClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('applicationClient', config.apis.approvedPremises as ApiConfig, token)
  }

  async find(applicationId: string): Promise<Application> {
    return (await this.restClient.get({
      path: paths.applications.show({ id: applicationId }),
    })) as Application
  }

  async create(newApplication: Cas2NewApplication): Promise<Application> {
    return (await this.restClient.post({
      path: paths.applications.new.pattern,
      data: {
        ...newApplication,
      },
    })) as Application
  }

  async all(): Promise<Array<Cas2ApplicationSummary>> {
    return (await this.restClient.get({ path: paths.applications.index.pattern })) as Array<Application>
  }

  async update(applicationId: string, updateData: UpdateCas2Application): Promise<Application> {
    return (await this.restClient.put({
      path: paths.applications.update({ id: applicationId }),
      data: { ...updateData, type: 'CAS2' } as UpdateApplication,
    })) as Application
  }

  async submit(applicationId: string, submissionData: SubmitCas2Application): Promise<void> {
    await this.restClient.post({
      path: paths.submissions.create.pattern,
      data: { ...submissionData, applicationId },
    })
  }
}
