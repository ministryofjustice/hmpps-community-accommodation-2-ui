/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import WillAnswer from './willAnswer'
import Disability from './disability'

@Task({
  name: 'Complete equality and diversity monitoring',
  slug: 'equality-and-diversity-monitoring',
  pages: [WillAnswer, Disability],
})
export default class EqualityAndDiversityMonitoring {}
