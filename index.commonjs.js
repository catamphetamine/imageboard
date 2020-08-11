'use strict'

exports = module.exports = require('./commonjs/Chan').default

// Added `/index.js` so that there's no warning:
// "There are multiple modules with names that only differ in casing.
//  This can lead to unexpected behavior when compiling on a filesystem with other case-semantic."
exports.getConfig = require('./commonjs/chan/index').getConfig
exports.compileWordPatterns = require('social-components/commonjs/utility/post/compileWordPatterns').default
exports.getCommentText = require('./commonjs/getCommentText').default
// exports.generateQuotes = require('./commonjs/generateQuotes').default
// exports.generatePreview = require('./commonjs/generatePreview').default
// exports.generateThreadTitle = require('./commonjs/generateThreadTitle').default
// exports.setPostLinkQuotes = require('./commonjs/setPostLinkQuotes').default

exports['default'] = require('./commonjs/Chan').default