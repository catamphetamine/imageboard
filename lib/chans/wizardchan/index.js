import Engine from '../../engine/vichan/index.js'
import config from '../../../chans/wizardchan/index.json.js'
export default (options) => new Engine(config, options)