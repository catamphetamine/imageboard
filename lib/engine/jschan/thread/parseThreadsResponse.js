import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

import parseThread from './parseThread.js'

/**
 * Parses "get threads list" API response.
 * @param  {object} response — "get threads list" API response.
 * @return {object} `{ threads }`
 */
export default function parseThreadsResponse(response, { status }) {
  throwErrorForErrorResponse(response, { status })

  return {
    threads: response.map(thread => parseThread(thread))
  }
}