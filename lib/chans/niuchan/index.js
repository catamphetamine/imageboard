import Engine from '../../engine/jschan/index.js'
import config from '../../../chans/niuchan/index.json.js'
export default (options) => new Engine(config, options)