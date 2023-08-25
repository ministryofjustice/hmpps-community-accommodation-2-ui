import type { OASysSections, Person } from '@approved-premises/api'
import type { PersonClient, RestClientBuilder } from '../data'

export default class PersonService {
  constructor(private readonly personClientFactory: RestClientBuilder<PersonClient>) {}

  async findByCrn(token: string, crn: string): Promise<Person> {
    const personClient = this.personClientFactory(token)

    const person = await personClient.search(crn)
    return person
  }

  async getOasysSections(token: string, crn: string): Promise<OASysSections> {
    const personClient = this.personClientFactory(token)

    const oasysSections = await personClient.oasysSections(crn)
    return oasysSections
  }
}
