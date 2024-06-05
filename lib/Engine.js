import Thread from './Thread.js'
import Comment from './Comment.js'

import parseAndFormatCommentContent from './parseAndFormatCommentContent.js'

import supportsFeature from './supportsFeature.js'
import getImageboardConfig from './getImageboardConfig.js'

import getBoards from './engine/getBoards.js'
import getThreads from './engine/getThreads.js'
import getThread from './engine/getThread.js'

import getParameterValues from './utility/getParameterValues.js'
import setParametersInString from './utility/setParametersInString.js'
import addUrlQueryParametersToUrl from './utility/addUrlQueryParametersToUrl.js'
import isObject from './utility/isObject.js'

export default class Engine {
	constructor(chanSettings, {
		engineSettings,
		useRelativeUrls,
		sendHttpRequest,
		...rest
	}) {
		this.config = getImageboardConfig(engineSettings, chanSettings)

		const {
			id,
			domain,
			// `commentUrl` template here is how comment links look like
			// on the original imageboard website.
			commentUrl: commentUrlParseTemplate,
			// `threadUrl` template here is how thread links look like
			// on the original imageboard website.
			threadUrl: threadUrlParseTemplate,
			...restChanSettings
		} = this.config

		if (!useRelativeUrls) {
			this._baseUrl = `https://${domain}`
		}

		this.sendRequest = (method, url, options) => {
			const originalUrl = url
			return sendHttpRequest({
				method,
				url,
				...options
			}).then(
				(result) => {
					// In older versions of this library,
					// `request()` could just resolve to reponse text.
					// Later the resolved value type was changed to be an object.
					//
					// Some engines (like `makaba`) redirect to a different URL
					// when requesting threads that have been archived.
					// For example, a request to `https://2ch.hk/b/arch/res/119034529.json`
					// redirects to `https://2ch.hk/b/arch/2016-03-06/res/119034529.json`.
					// From that "final" URL, one can get the `archivedAt` date of the thread.
					// For that reason, the application can (optionally) choose to return
					// not simply a `string` from the `request()`'s `Promise`, but instead
					// an `object` having `responseText: string`, `url: string` and `headers: object`.
					// For example, `anychan` uses this undocumented feature
					// in order to get `archivedAt` timestamps on `2ch.hk`.
					// Also, `headers` are examined in order to parse authentication token
					// cookie value from a `Set-Cookie` header on `2ch.hk`.
					//
					let url
					let status
					let headers
					let responseText

					if (isObject(result)) {
						url = result.url
						status = result.status
						headers = result.headers
						responseText = result.responseText
					} else {
						url = originalUrl
						status = 200
						headers = undefined
						responseText = result
					}

					// Parse `responseText`.
					const response = parseResponseText({
						responseText,
						requestHeaders: options.headers,
						url
					})

					return {
						url,
						status,
						headers,
						response
					}
				},
				(error) => {
					// Parse `error.responseText`.
					if (error.responseText) {
						error.response = parseResponseText({
							responseText: error.responseText,
							requestHeaders: options.headers,
							url,
							error
						})
					}

					// If the engine expects to handle non-2xx HTTP responses
					// normally like 2xx ones, then do that.
					if (this.shouldProcessErrorResponseNormally(error.response)) {
						return {
							url: error.url,
							status: error.status,
							headers: error.headers,
							response: error.response
						}
					}

					// Otherwise, re-throw the error.
					return Promise.reject(error)
				}
			)
		}

		this.options = {
			chan: id,
			// `commentUrl` template here is how comment `post-link` `href`s
			// should be formatted in the output of this library.
			commentUrl: '/{boardId}/{threadId}#{commentId}',
			// `threadUrl` template here is how thread `post-link` `href`s
			// should be formatted in the output of this library.
			threadUrl: '/{boardId}/{threadId}',
			parseCommentContent: this.parseCommentContent,
			...restChanSettings,
			...rest
		}

		// Compile `commentUrl` template into a parsing regular expression.
		if (commentUrlParseTemplate) {
			this.options.commentUrlParser = new RegExp(
				'^' +
				commentUrlParseTemplate
					// Escape slashes.
					.replace(/\//g, '\\/')
					// The "?" at the end of the `boardId` "capturing group"
					// means "non-greedy" regular expression matching.
					// (in other words, it means "stop at the first slash").
					// (could be written as "([^\\/]+)" instead).
					.replace('{boardId}', '(.+?)')
					.replace('{threadId}', '(\\d+)')
					.replace('{commentId}', '(\\d+)') +
				'$'
			)
		}
	}

	getOptions(options) {
		return {
			...this.options,
			...options
		}
	}

	toAbsoluteUrl = (url) => {
		// Convert relative URLs to absolute ones.
		if (this._baseUrl) {
			if (url[0] === '/' && url[1] !== '/') {
				return this._baseUrl + url
			}
		}
		return url
	}

	/**
	 * Sends an HTTP request to the API.
	 * @param  {object} specification — Request specification (URL, method, etc).
	 * @param  {object} [params] — The parameters that're used to generate all other parameters. These're used when `urlParameters` or `parameters` use some other parameters for their values.
	 * @return {Promise<(object|string)>} [response]
	 */
	request = (specification, params = {}) => {
		let {
			method,
			url,
			urlParameters,
			parameters,
			cookies,
			requestType = 'application/json',
			responseType = 'application/json'
		} = specification

		let body
		// Get the API endpoint URL.
		if (urlParameters) {
			urlParameters = getParameterValues(urlParameters, params)
			// Encode URL parameters.
			for (const key in urlParameters) {
				urlParameters[key] = encodeURIComponent(String(urlParameters[key]))
			}
			url = setParametersInString(url, urlParameters)
		}
		url = this.toAbsoluteUrl(url)

		// Apply parameters.
		if (parameters) {
			parameters = getParameterValues(parameters, params)
			if (method === 'GET') {
				url = addUrlQueryParametersToUrl(url, parameters)
			} else {
				if (requestType === 'multipart/form-data') {
					body = parameters
				} else {
					body = JSON.stringify(parameters)
					requestType = 'application/json'
				}
			}
		}

		const headers = {}

		if (requestType) {
			headers['content-type'] = requestType
		}

		if (responseType) {
			headers['accept'] = responseType
		}

		// Set `Cookie` header value, if required.
		if (cookies) {
			cookies = getParameterValues(cookies, params)
		}

		// Send HTTP request.
		return this.sendRequest(method, url, {
			body,
			headers,
			cookies
		})
	}

	/**
	 * Performs a "get boards list" API query and parses the response.
	 * @param  {object} [options] — See the README.
	 * @return {Promise<{ boards: Board[] }>}
	 */
	getBoards(parameters) {
		return getBoards({
			boards: this.options.boards,
			boardCategories: this.options.boardCategories,
			api: this.options.api,
			request: this.request,
			parseBoards: this.parseBoards && this.parseBoards.bind(this),
			parseBoardsPage: this.parseBoardsPage && this.parseBoardsPage.bind(this)
		}, parameters)
	}

	/**
	 * Performs a "get top boards list" API query and parses the response.
	 * @param  {object} [options] — See the README.
	 * @return {Promise<{ boards: Board[] }>}
	 */
	getTopBoards(parameters) {
		return this.getBoards({
			...parameters,
			limit: true
		})
	}

	/**
	 * Searches for boards matching a query.
	 * @param  {string} [parameters.query]
	 * @return {Promise<{ boards: Board[] }>}
	 */
	findBoards(parameters) {
		// This method isn't currently implemented in any of the supported imageboard engines.
		throw new Error('Not implemented')
	}

	/**
	 * Performs a "get threads list" API query and parses the response.
	 * @param  {object} parameters — `{ boardId }` plus options. See `README.md` or TypeScript definitions.
	 * @return {Promise<{ threads: Thread[], board?: Board }>}
	 */
	getThreads(parameters) {
		return getThreads({
			parseThreads: this.parseThreads && this.parseThreads.bind(this),
			parseThreadsPage: this.parseThreadsPage && this.parseThreadsPage.bind(this),
			parseThreadsStats: this.parseThreadsStats && this.parseThreadsStats.bind(this),
			engine: this.options.engine,
			api: this.options.api,
			request: this.request
		}, parameters)
	}

	/**
	 * Searches for threads on a board matching a query.
	 * @param  {string} parameters.boardId
	 * @param  {string} parameters.query
	 * @return {Promise<{ threads: Thread[], board?: Board }>}
	 */
	findThreads(parameters) {
		// This method isn't currently implemented in any of the supported imageboard engines.
		throw new Error('Not implemented')
	}

	/**
	 * Performs a "get thread comments" API query and parses the response.
	 * @param  {object} parameters — `{ boardId, threadId }` plus options. See `README.md` or TypeScript definitions.
	 * @return {Promise<{ thread: Thread, board?: Board }>}
	 */
	getThread(parameters) {
		return getThread({
			engine: this.options.engine,
			api: this.options.api,
			incrementalThreadUpdateStartsAtCommentsCount: this.options.incrementalThreadUpdateStartsAtCommentsCount,
			request: this.request,
			parseThread: this.parseThread && this.parseThread.bind(this),
			parseIncrementalThreadResponse: this.parseIncrementalThreadResponse && this.parseIncrementalThreadResponse.bind(this)
		}, parameters)
	}

	/**
	 * Searches for comments in a thread matching a query.
	 * @param  {string} parameters.boardId
	 * @param  {number} [parameters.threadId]
	 * @param  {string} parameters.query
	 * @return {Promise<{ comments: Comment[], thread?: Thread, board?: Board }>}
	 */
	findComments(parameters) {
		// This method isn't currently implemented in any of the supported imageboard engines.
		throw new Error('Not implemented')
	}

	callApiEndpoint(apiEndpointRequestSpec, params, {
		parseResponse,
		parseResponseParameters,
		onError
	}) {
		if (!apiEndpointRequestSpec || !parseResponse) {
			throw new Error('Not implemented for this engine')
		}
		return this.request(apiEndpointRequestSpec, params).then(
			({ response, status, headers }) => parseResponse.call(this, response, {
				...this.options,
				...parseResponseParameters,
				status,
				headers
			}),
			(error) => {
				if (onError) {
					if (onError(error) === true) {
						return
					}
				}
				return Promise.reject(error)
			}
		)
	}

	/**
	 * Legacy name for `voteForComment()` method is `vote()`.
	 */
	vote(...args) {
		return this.voteForComment.apply(this, args)
	}

	/**
	 * Performs a "vote" API request and parses the response.
	 * @param  {object} parameters — `{ boardId, threadId, commentId, up }`.
	 * @return {Promise<boolean>} — Returns `true` if the vote has been accepted.  Returns `false` if the user has already voted for this thread or comment.
	 */
	voteForComment(params) {
		return this.callApiEndpoint(this.options.api.vote, params, {
			parseResponse: this.parseVoteForCommentResponse
		})
	}

	/**
	 * Performs a "post thread" API request and parses the response.
	 * @param  {object} parameters — `{ boardId, ... }`.
	 * @return {Promise<{ id: number }>} Returns new thread ID or new comment ID. Throws an error in case of an error. If the error is "banned" then the error may have properties: `banId`, `banReason`, `banBoardId`, `banEndsAt`.
	 */
	createThread(params) {
		return this.callApiEndpoint(this.options.api.post, params, {
			parseResponse: this.parseCreateThreadResponse
		})
	}

	/**
	 * Performs an "update thread" API request and parses the response.
	 * @param  {object} parameters — `{ boardId, threadId, ... }`.
	 * @return {Promise<void>}
	 */
	updateThread(parameters) {
		// This method isn't currently implemented in any of the supported imageboard engines.
		throw new Error('Not implemented')
	}

	/**
	 * Performs a "post comment" API request and parses the response.
	 * @param  {object} parameters — `{ boardId, threadId, ... }`.
	 * @return {Promise<{ id: number }>} Returns new thread ID or new comment ID. Throws an error in case of an error. If the error is "banned" then the error may have properties: `banId`, `banReason`, `banBoardId`, `banEndsAt`.
	 */
	createComment(params) {
		return this.callApiEndpoint(this.options.api.post, params, {
			parseResponse: this.parseCreateCommentResponse
		})
	}

	/**
	 * Performs an "update comment" API request and parses the response.
	 * @param  {object} parameters — `{ boardId, threadId, commentId,  ... }`.
	 * @return {Promise<void>}
	 */
	updateComment(parameters) {
		// This method isn't currently implemented in any of the supported imageboard engines.
		throw new Error('Not implemented')
	}

	/**
	 * Returns board info.
	 * @return {Promise<Board>} Returns `Board` object.
	 */
	getBoard(params) {
		return this.callApiEndpoint(this.options.api.getBoard, params, {
			parseResponse: this.parseBoardResponse,
			parseResponseParameters: {
				boardId: params.boardId
			}
		})
	}

	/**
	 * Requests a new CAPTCHA to be generated.
	 * @return {Promise<object>} Returns CAPTCHA info.
	 */
	getCaptcha(params) {
		return this.callApiEndpoint(this.options.api.getCaptcha, params, {
			parseResponse: this.parseGetCaptchaResponse
		})
	}

	/**
	 * Submits a CAPTCHA solution.
	 */
	solveCaptcha(params) {
		return this.callApiEndpoint(this.options.api.solveCaptcha, params, {
			parseResponse: this.parseSolveCaptchaResponse
		})
	}

	/**
	 * Creates a board.
	 */
	createBoard(params) {
		return this.callApiEndpoint(this.options.api.createBoard, params, {
			parseResponse: this.parseCreateBoardResponse
		})
	}

	/**
	 * Deletes a board.
	 */
	deleteBoard(params) {
		return this.callApiEndpoint(this.options.api.deleteBoard, params, {
			parseResponse: this.parseDeleteBoardResponse
		})
	}

	/**
	 * Performs a "report" API request and parses the response.
	 * @param  {object} parameters — `{ boardId, commentId, content }`.
	 * @return {Promise<void>} Throws in case of an error.
	 */
	reportComment(params) {
		return this.callApiEndpoint(this.options.api.report, params, {
			parseResponse: this.parseReportCommentResponse
		})
	}

	/**
	 * Performs a "log in" API request and parses the response.
	 * @param  {object} parameters — `{ token, tokenPassword }`.
	 * @return {Promise<string>} Returns an "access token". Throws in case of an error.
	 */
	logIn(params) {
		return this.callApiEndpoint(this.options.api.logIn, params, {
			parseResponse: this.parseLogInResponse,
			onError: (error) => {
				if (this.handleLogInError) {
					this.handleLogInError(error)
					return true
				}
			}
		})
	}

	/**
	 * Performs a "log out" API request and parses the response.
	 * @return {Promise<string>} Returns an "access token". Throws in case of an error.
	 */
	logOut(params) {
		return this.callApiEndpoint(this.options.api.logOut, params, {
			parseResponse: this.parseLogOutResponse
		})
	}

	/**
	 * Gets a "block bypass".
	 * See LynxChan API docs.
	 */
	getBlockBypass(params) {
		return this.callApiEndpoint(this.options.api.getBlockBypass, params, {
			parseResponse: this.parseGetBlockBypassResponse
		})
	}

	/**
	 * Renews a "block bypass".
	 * See LynxChan API docs / JsChan API docs.
	 */
	createBlockBypass(params) {
		return this.callApiEndpoint(this.options.api.createBlockBypass, params, {
			parseResponse: this.parseCreateBlockBypassResponse
		})
	}

	/**
	 * Validates a "block bypass".
	 * See LynxChan API docs.
	 */
	validateBlockBypass(params) {
		return this.callApiEndpoint(this.options.api.validateBlockBypass, params, {
			parseResponse: this.parseValidateBlockBypassResponse
		})
	}

	/**
	 * Tells if an imageboard supports a certain feature.
	 * @param  {string} feature
	 * @return {boolean}
	 */
	supportsFeature = (feature) => {
		return supportsFeature(this.config, feature)
	}

	/**
	 * Creates a Thread object from thread data.
	 * @param  {object} thread
	 * @param  {object} [options]
	 * @param  {object} [parameters.board]
	 * @return {Thread}
	 */
	createThreadObject(thread, options, { board } = {}) {
		const parseComment = (comment) => this.parseComment(comment, options, { board, thread })
		thread.comments = thread.comments.map(parseComment)
		return Thread(
			thread,
			this.getOptions(options),
			{ board }
		)
	}

	/**
	 * Creates a `Comment` from comment data.
	 * @param  {object} comment
	 * @param  {object} options
	 * @param  {object} parameters.board
	 * @param  {object} parameters.thread
	 * @return {Comment}
	 */
	parseComment(comment, options, { board, thread } = {}) {
		options = this.getOptions(options)
		return Comment(this._parseComment(comment, options, { board, thread }), options)
	}

	/**
	 * Can be used when `parseContent: false` option is passed.
	 * @param {object} comment
	 * @param {object} [options] — `{ threadId }` if `threadId` isn't already part of `this.options`.
	 */
	parseCommentContent = (comment, options) => {
		// `post-link` parser uses `boardId` and `threadId`
		// for parsing links like `4chan`'s `href="#p265789424"`
		// that're present in "get thread comments" API response.
		if (!options.boardId || !options.threadId) {
			console.error('`boardId` and `threadId` options are required when parsing thread comments.')
		}
		comment.content = parseAndFormatCommentContent(comment.content, {
			comment,
			...this.getOptions(options)
		})
	}

	/**
	 * Controls whether the engine expects to handle a non-2xx response
	 * same way it would handle a 2xx one, i.e. by analyzing the response content.
	 * Return `true` if the error response should be passed as the `response` argument
	 * to the same function that handles a non-error response.
	 * @param  {any} response
	 * @return {boolean}
	 */
	shouldProcessErrorResponseNormally(response) {
		return false
	}
}

function isJson(response) {
	return Array.isArray(response) || typeof response === 'object'
}

function parseResponseText({ responseText, requestHeaders, url, error }) {
	if (!responseText) {
		return
	}

	switch (requestHeaders && requestHeaders['accept']) {
		case 'application/json':
			try {
				return JSON.parse(responseText)
			} catch (parseError) {
				// If the `responseText` was obtained from an `error`,
				// don't overwrite that error by throwing a new one.
				// That's important in case of `makaba` engine when fetching
				// a deleted thread's JSON and receiving a 404 Not Found response:
				// in that case, the application should get the original error
				// with status `404` in order to figure out that the thread wasn't found.
				// If in that case it threw a new error, its `status` would be `undefined`
				// and the application wouldn't know that the thread might've been deleted.
				if (error) {
					return
				}
				// Sometimes imageboards may go offline while still responding with a web page:
				// an incorrect 2xx HTTP status code with HTML content like "We're temporarily offline".
				// Accepting only `application/json` HTTP responses works around that.
				console.error(`An HTTP request to ${url} returned an invalid JSON:`)
				console.error(responseText)
				throw new Error('INVALID_RESPONSE')
			}
			return
		default:
			return responseText
	}
}