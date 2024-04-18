import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { Cas2ApplicationSummary } from '@approved-premises/api'

import { DateFormats } from '../../utils/dateUtils'
import { fullPersonFactory } from './person'

export default Factory.define<Cas2ApplicationSummary>(() => ({
  id: faker.string.uuid(),
  type: 'CAS2',
  person: fullPersonFactory.build(),
  createdAt: DateFormats.dateObjToIsoDateTime(faker.date.past()),
  submittedAt: DateFormats.dateObjToIsoDateTime(faker.date.past()),
  createdByUserId: faker.string.uuid(),
  status: 'inProgress',
  personName: faker.person.fullName(),
  crn: `C${faker.number.int({ min: 100000, max: 999999 })}`,
  nomsNumber: `NOMS${faker.number.int({ min: 100, max: 999 })}`,
}))
