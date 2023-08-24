import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { ApprovedPremisesApplicationSummary as ApplicationSummary } from '@approved-premises/api'

import { DateFormats } from '../../utils/dateUtils'
import { fullPersonFactory } from './person'

export default Factory.define<ApplicationSummary>(() => ({
  id: faker.string.uuid(),
  type: 'CAS2',
  person: fullPersonFactory.build(),
  createdAt: DateFormats.dateObjToIsoDateTime(faker.date.past()),
  submittedAt: DateFormats.dateObjToIsoDateTime(faker.date.past()),
  createdByUserId: faker.string.uuid(),
  status: 'inProgress',
}))
