import { path } from 'static-path'

const peoplePath = path('/people')
const personPath = peoplePath.path(':crn')
const oasysPath = personPath.path('oasys')
const applicationsPath = path('/applications')

export default {
  people: {
    oasys: {
      sections: oasysPath.path('sections'),
    },
    search: peoplePath.path('search'),
  },
  applications: {
    new: applicationsPath,
    index: applicationsPath,
  },
}
