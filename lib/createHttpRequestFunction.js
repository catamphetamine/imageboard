import { getCookieInWebBrowser as getCookie } from './utility/getCookie.js'

import addUrlQueryParametersToUrl from './utility/addUrlQueryParametersToUrl.js'

// Sends an HTTP request.
// Any HTTP request library can be used here.
export default function createHttpRequestFunction({
  fetch,
  FormData,
  mode,
  credentials,
  redirect,
  setHeaders,
  attachCookiesInWebBrowser,
  getRequestUrl,
  getResponseStatus,
  getFinalUrlFromResponse
}) {
  // Returns a function that sends an HTTP request.
  return ({
    method,
    url,
    query,
    body: bodyObject,
    headers = {},
    cookies
  }) => {
    let body // : string | FormData

    // If request "Content-Type" is set to be "multipart/form-data",
    // convert the `body` object to a `FormData` instance.
    if (headers['content-type'] === 'multipart/form-data') {
      body = createFormData(bodyObject, FormData)
      // Remove `Content-Type` header so that it autogenerates it from the `FormData`.
      // Example: "multipart/form-data; boundary=----WebKitFormBoundaryZEglkYA7NndbejbB".
      delete headers['content-type']
    } else {
      body = JSON.stringify(bodyObject)
    }

    // Apply `query` to the URL.
    if (query) {
      url = addUrlQueryParametersToUrl(url, query)
    }

    // Set any custom HTTP request headers.
    if (setHeaders) {
      setHeaders({ headers })
    }

    // Web browsers don't allow the client javascript code to set the contents
    // of the `Cookie` HTTP request header.
    //
    // https://developer.mozilla.org/en-US/docs/Web/API/Headers/getSetCookie
    //
    // But it may be required to send some cookies to the server.
    // For example, to authenticate the user.
    //
    if (cookies) {
      // When running not in a web browser.
      if (typeof document === 'undefined') {
        // Send `cookies` when not running in a web browser.
        headers['cookie'] = Object.keys(cookies).map(key => `${key}=${cookies[key]}`).join('; ')
      } else {
        if (attachCookiesInWebBrowser) {
          // Passes `cookies` in `headers`.
          attachCookiesInWebBrowser({ cookies, headers })
        } else {
          // When running in a web browser environment, the application can't control
          // which cookies do get sent as part of an HTTP request.
          // In that case, just validate if the cookies will be sent correctly or not
          // by comparing the specified cookies and the cookies that will actualy be sent
          // by the web browser.
          const cookieNamesThatWillNotBeSetCorrectly = Object.keys(cookies).filter((name) => {
            const expectedValue = cookies[name]
            const actualValue = getCookie(name)
            if (expectedValue && !actualValue) {
              // `Cookie not set: "${name}"`.
              return true
            } else if (expectedValue !== actualValue) {
              // `Cookie value mismatch: "${name}". Expected: ${expectedValue}. Actual: ${actualValue}`.
              return true
            }
          })

          // Report the error.
          throw new Error('Couldn\'t attach correct `cookies` to HTTP request due to running in a (restricted) web browser environment: ' + cookieNamesThatWillNotBeSetCorrectly.join(', '))
        }
      }
    }

    // The application can supply its own implementation of the `fetch()` function.
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    // * `fetch()` is not supported in Safari 9.x and iOS Safari 9.x.
    //   https://caniuse.com/#feat=fetch
    // * `fetch()` is not supported in Node.js.

    // Make an HTTP request using `fetch()`.
    return fetch(getRequestUrl ? getRequestUrl({ url }) : url, {
      method,
      headers,
      body,
      // By default, `fetch()` follows any redirects in the process.
      // Many imageboards have API endpoints that set cookies and then redirect.
      // If `fetch()` was to follow those redirects, those `set-cookie` headers
      // from a `status: 302` response would be ignored, and the `imageboard` library
      // should be able to inspect those `set-cookie` headers in order to extract
      // their values. So `fetch()` is specifically configured to not follow redirects.
      redirect: redirect || 'manual',
      mode,
      credentials
    }).then((response) => {
      // An application may prefer its own method for determining the HTTP response status.
      const responseStatus = getResponseStatus ? getResponseStatus({
        status: response.status,
        headers: response.headers
      }) : response.status

      // "Final" URL after any redirects.
      const finalUrl = getFinalUrlFromResponse ? getFinalUrlFromResponse({
        // If there were any redirects in the proces,
        // `response.url` is gonna be the final "redirected to" URL.
        url: response.url,
        headers: response.headers
      }) : response.url

      // `response.ok` means `response.status` is `2xx`,
      // and so it doesn't include redirects like `response.status: 302`
      // which are still valid responses.
      if (responseStatus >= 400) {
        return rejectWithErrorForResponse(response, {
          status: responseStatus,
          url: finalUrl
        })
      }

      return response.text().then((responseText) => ({
        url: finalUrl,
        status: responseStatus,
        headers: response.headers,
        responseText
      }))
    })
  }
}

// Creates an error from a `fetch()` response.
// Returns a `Promise` and rejects it with the error.
function rejectWithErrorForResponse(response, { status, url }) {
  // Added `as` to fix TypeScript error.
  // const error: HttpResponseError = new Error(response.statusText) as HttpResponseError
  const error = new Error(response.statusText)
  error.url = url
  error.status = status
  error.headers = response.headers
  return response.text().then(
    (responseText) => {
      error.responseText = responseText
      throw error
    },
    (error_) => {
      throw error
    }
  )
}

// Converts an object to a `FormData` instance.
function createFormData(body, FormData) { // (body?: Record<string, any>) {
  // * For 'multipart/form-data', use `FormData` class.
  // * For 'application/x-www-form-urlencoded', use `URLSearchParams` class.
  const formData = new FormData()
  if (body) {
    for (const key of Object.keys(body)) {
      if (body[key] !== undefined && body[key] !== null) {
        if (Array.isArray(body[key])) {
          for (const element of body[key]) {
            formData.append(key + '[]', element)
          }
        } else {
          formData.append(key, body[key])
        }
      }
    }
  }
  return formData
}