/**
 * A simple analog of Node.js's `path.join(...)`.
 * https://gist.github.com/creationix/7435851#gistcomment-3698888
 * @param  {...string} segments
 * @return {string}
 */
export default function joinPath(...segments) {
  const parts = segments.reduce((parts, segment) => {
    // Remove leading slashes from non-first part.
    if (parts.length > 0) {
      segment = segment.replace(/^\//, '')
    }
    // Remove trailing slashes.
    segment = segment.replace(/\/$/, '')
    return parts.concat(segment.split('/'))
  }, [])
  const resultParts = []
  for (const part of parts) {
    if (part === '.') {
      continue
    }
    if (part === '..') {
      resultParts.pop()
      continue
    }
    resultParts.push(part)
  }
  return resultParts.join('/')
}