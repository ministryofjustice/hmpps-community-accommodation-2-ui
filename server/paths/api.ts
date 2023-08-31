import { path } from 'static-path'

const peoplePath = path('/people')
const personPath = peoplePath.path(':crn')
const oasysPath = personPath.path('oasys')
const applicationsPath = path('/applications')
const singleApplicationPath = applicationsPath.path(':id')

export default {
  people: {
    oasys: {
      sections: oasysPath.path('sections'),
      riskToSelf: oasysPath.path('risk-to-self'),
    },
    search: peoplePath.path('search'),
  },
  applications: {
    new: applicationsPath,
    index: applicationsPath,
    show: singleApplicationPath,
    update: singleApplicationPath,
    submission: singleApplicationPath.path('submission'),
  },
}
