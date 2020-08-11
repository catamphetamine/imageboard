// Added `/index.js` so that there's no warning:
// "There are multiple modules with names that only differ in casing.
//  This can lead to unexpected behavior when compiling on a filesystem with other case-semantic."
export { default as default } from './modules/Chan'
export { getConfig } from './modules/chan/index'
export { default as compileWordPatterns } from 'social-components/modules/utility/post/compileWordPatterns'
export { default as getCommentText } from './modules/getCommentText'
// export { default as generateQuotes } from './modules/generateQuotes'
// export { default as generatePreview } from './modules/generatePreview'
// export { default as generateThreadTitle } from './modules/generateThreadTitle'
// export { default as setPostLinkQuotes } from './modules/setPostLinkQuotes'