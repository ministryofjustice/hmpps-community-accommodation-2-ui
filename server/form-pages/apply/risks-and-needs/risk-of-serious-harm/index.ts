import { Task } from '../../../utils/decorators'
import OasysImport from './custom-forms/oasysImport'
import Summary from './summary'
import RiskToOthers from './riskToOthers'
import RiskFactors from './riskFactors'
import ReducingRisk from './reducingRisk'
import RiskManagementArrangements from './riskManagementArrangements'
import CellShareInformation from './cellShareInformation'

@Task({
  name: 'Review risk of serious harm (RoSH) information',
  slug: 'risk-of-serious-harm',
  pages: [
    OasysImport,
    Summary,
    RiskToOthers,
    RiskFactors,
    ReducingRisk,
    RiskManagementArrangements,
    CellShareInformation,
  ],
})
export default class RiskOfSeriousHarm {}
