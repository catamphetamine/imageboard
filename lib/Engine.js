import Thread from './Thread.js'
import Comment from './Comment.js'

import parseAndFormatCommentContent from './parseAndFormatCommentContent.js'

import getBoards from './engine/getBoards.js'
import getThreads from './engine/getThreads.js'
import getThread from './engine/getThread.js'

import getParameterValues from './utility/getParameterValues.js'
import setParametersInString from './utility/setParametersInString.js'
import addUrlQueryParametersToUrl from './utility/addUrlQueryParametersToUrl.js'
import isObject from './utility/isObject.js'

export default class Engine {
	constructor(chanSettings, {
		useRelativeUrls,
		request,
		...rest
	}) {
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
		} = chanSettings

		if (!useRelativeUrls) {
			this._baseUrl = `https://${domain}`
		}

		this.request = (method, url, options, { returnResponseInfoObject } = {}) => {
			const originalUrl = url
			return request(method, url, options).then(
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
					let headers
					let responseText

					if (isObject(result)) {
						url = result.url
						headers = result.headers
						responseText = result.responseText
					} else {
						url = originalUrl
						headers = undefined
						responseText = result
					}

					// Parse `responseText`.
					const response = parseResponse({
						responseText,
						requestHeaders: options.headers
					})

					if (returnResponseInfoObject) {
						return {
							url,
							headers,
							response
						}
					}

					return response
				},
				(error) => {
					// Parse `error.responseText`.
					if (error.responseText) {
						error.response = parseResponse({
							responseText: error.responseText,
							requestHeaders: options.headers
						})
					}

					// If the engine expects to handle non-2xx HTTP responses
					// normally like 2xx ones, then do that.
					if (this.shouldProcessErrorResponseNormally(error.response)) {
						if (returnResponseInfoObject) {
							return {
								url: error.url,
								headers: error.headers,
								response: error.response
							}
						}
						return error.response
					}

					// Otherwise, re-throw the error.
					return Promise.reject(error)
				}
			)
		}

		this.options = {
			chan: id,
			toAbsoluteUrl: this.toAbsoluteUrl,
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
	 * @param  {object} options — Request options (URL, method, etc).
	 * @param  {object} [params] — The parameters that're used to generate all other parameters. These're used when `urlParameters` or `parameters` use some other parameters for their values.
	 * @return {Promise<(object|string)>} [response]
	 */
	sendRequest = (url, options, params) => {
		// Transform `this.sendRequest(apiMethodDefinition, params)` method signature.
		if (typeof url !== 'string') {
			params = options
			options = url
			url = options.url
		}

		if (!options) {
			options = {}
		}

		let {
			method,
			urlParameters,
			parameters,
			requestType,
			responseType = 'application/json',
			returnResponseInfoObject
		} = options

		let body
		// Get the API endpoint URL.
		if (urlParameters) {
			if (params) {
				urlParameters = getParameterValues(urlParameters, params)
			} else {
				// URL parameters will be transformed.
				urlParameters = { ...urlParameters }
			}
			for (const key in urlParameters) {
				urlParameters[key] = encodeURIComponent(urlParameters[key])
			}
			url = setParametersInString(url, urlParameters)
		}
		url = this.toAbsoluteUrl(url)

		// Apply parameters.
		if (parameters) {
			if (params) {
				parameters = getParameterValues(parameters, params)
			}
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
			headers['Content-Type'] = requestType
		}

		if (responseType) {
			headers['Accept'] = responseType
		}

		// Send HTTP request.
		return this.request(method, url, {
			body,
			headers
		}, {
			returnResponseInfoObject
		})
	}

	/**
	 * Performs a "get boards list" API query and parses the response.
	 * @param  {object} [options] — See the README.
	 * @return {Promise<object[]>} — A list of `Board` objects.
	 */
	getBoards(options = {}) {
		return getBoards({
			boards: this.options.boards,
			boardCategories: this.options.boardCategories,
			api: this.options.api,
			request: this.sendRequest,
			parseBoards: this.parseBoards && this.parseBoards.bind(this),
			parseBoardsPage: this.parseBoardsPage && this.parseBoardsPage.bind(this)
		}, options)
	}

	/**
	 * Performs a "get all boards list" API query and parses the response.
	 * @param  {object} [options] — See the README.
	 * @return {Promise<object[]>} — A list of `Board` objects.
	 */
	getAllBoards(options) {
		return this.getBoards({
			...options,
			all: true
		})
	}

	/**
	 * A "feature-detection" method.
	 * @return {boolean} Returns `true` if an imageboard engine supports `.findBoards()` method.
	 */
	canSearchForBoards() {
		return false
	}

	/**
	 * Searches for boards matching a query.
	 * @param  {string} query
	 * @return {Promise<Board[]>}
	 */
	findBoards(query) {
		// This method isn't currently implemented in any of the supported imageboard engines.
		throw new Error('Not implemented')
	}

	/**
	 * Returns `true` if an imageboard has a "get all boards" API endpoint
	 * that's different from the regular "get boards" API endpoint.
	 * In other words, returns `true` if an imageboard provides separate API
	 * endpoints for getting a list of "most popular boards" and a list of
	 * "all boards available".
	 * @return {boolean}
	 */
	hasMoreBoards() {
		return this.options.api.getAllBoards !== undefined
	}

	/**
	 * Performs a "get threads list" API query and parses the response.
	 * @param  {object} parameters — `{ boardId }`.
	 * @param  {object} [options] — See the README.
	 * @return {Promise<object[]>} — A list of `Thread` objects.
	 */
	getThreads(parameters, options) {
		return getThreads({
			parseThreads: this.parseThreads && this.parseThreads.bind(this),
			parseThreadsPage: this.parseThreadsPage && this.parseThreadsPage.bind(this),
			parseThreadsStats: this.parseThreadsStats && this.parseThreadsStats.bind(this),
			engine: this.options.engine,
			api: this.options.api,
			request: this.sendRequest
		}, parameters, options)
	}

	/**
	 * Performs a "get thread comments" API query and parses the response.
	 * @param  {object} parameters — `{ boardId, threadId }`.
	 * @param  {object} [options] — See the README.
	 * @return {Promise<object>} — A `Thread` object.
	 */
	getThread(parameters, options) {
		return getThread({
			engine: this.options.engine,
			api: this.options.api,
			incrementalThreadUpdateStartsAtCommentsCount: this.options.incrementalThreadUpdateStartsAtCommentsCount,
			request: this.sendRequest,
			parseThread: this.parseThread && this.parseThread.bind(this),
			parseIncrementalThreadResponse: this.parseIncrementalThreadResponse && this.parseIncrementalThreadResponse.bind(this)
		}, parameters, options)
	}

	/**
	 * Performs a "vote" API request and parses the response.
	 * @param  {object} parameters — `{ boardId, threadId, commentId, up }`.
	 * @return {Promise<boolean>} — Returns `true` if the vote has been accepted.  Returns `false` if the user has already voted for this thread or comment.
	 */
	vote(params) {
		if (!this.parseVoteResponse) {
			throw new Error('`.vote()` is not implemented for this engine')
		}
		return this.sendRequest(this.options.api.vote, params).then(
			(response) => this.parseVoteResponse(response)
		)
	}

	/**
	 * Performs a "post thread" API request and parses the response.
	 * @param  {object} parameters — `{ boardId, authorName?, authorEmail?, title?, content?, attachments?, attachmentSpoiler?, attachmentFileTag?, textOnly?, accessToken?, captchaId?, captchaSolution? }`.
	 * @return {Promise<number>} Returns new thread ID or new comment ID. Throws an error in case of an error. If the error is "banned" then the error may have properties: `banId`, `banReason`, `banBoardId`, `banEndsAt`.
	 */
	createThread(params) {
		if (!this.parseCreateThreadResponse) {
			throw new Error('`.createThread()` is not implemented for this engine')
		}
		return this.sendRequest(this.options.api.post, params).then(
			(response) => this.parseCreateThreadResponse(response)
		)
	}

	/**
	 * Performs a "post comment" API request and parses the response.
	 * @param  {object} parameters — `{ boardId, threadId, authorName?, authorEmail?, title?, content?, attachments?, attachmentSpoiler?, attachmentFileTag?, textOnly?, accessToken?, captchaId?, captchaSolution? }`.
	 * @return {Promise<number>} Returns new thread ID or new comment ID. Throws an error in case of an error. If the error is "banned" then the error may have properties: `banId`, `banReason`, `banBoardId`, `banEndsAt`.
	 */
	createComment(params) {
		if (!this.parseCreateCommentResponse) {
			throw new Error('`.createComment()` is not implemented for this engine')
		}
		return this.sendRequest(this.options.api.post, params).then(
			(response) => this.parseCreateCommentResponse(response)
		)
	}

	/**
	 * Requests a new CAPTCHA to be generated.
	 * @return {Promise<object>} Returns CAPTCHA info.
	 */
	getCaptcha() {
		if (!this.parseGetCaptchaResponse) {
			throw new Error('`.getCaptcha()` is not implemented for this engine')
		}
		return this.sendRequest(this.options.api.getCaptcha).then(
			(response) => this.parseGetCaptchaResponse(response, {
				captchaExpiresIn: this.options.captchaExpiresIn,
				captchaImageUrl: this.options.captchaImageUrl,
				captchaImageType: this.options.captchaImageType,
				captchaImageWidth: this.options.captchaImageWidth,
				captchaImageHeight: this.options.captchaImageHeight
			})
		)
	}

	/**
	 * Performs a "report" API request and parses the response.
	 * @param  {object} parameters — `{ boardId, commentId, content }`.
	 * @return {Promise<void>} Throws in case of an error.
	 */
	report(params) {
		if (!this.parseReportResponse) {
			throw new Error('`.report()` is not implemented for this engine')
		}
		return this.sendRequest(this.options.api.report, params).then(
			(response) => this.parseReportResponse(response)
		)
	}

	/**
	 * Performs a "log in" API request and parses the response.
	 * @param  {object} parameters — `{ token, tokenPassword }`.
	 * @return {Promise<string>} Returns an "access token". Throws in case of an error.
	 */
	logIn(params) {
		if (!this.parseLogInResponse) {
			throw new Error('`.logIn()` is not implemented for this engine')
		}
		return this.sendRequest({
			...this.options.api.logIn,
			returnResponseInfoObject: true
		}, params).then(
			({ response, headers }) => this.parseLogInResponse(response, {
				accessTokenCookieName: this.options.accessTokenCookieName,
				headers
			}),
			(error) => {
				if (this.handleLogInError) {
					this.handleLogInError(error)
				} else {
					throw error
				}
			}
		)
	}

	/**
	 * Performs a "log out" API request and parses the response.
	 * @return {Promise<string>} Returns an "access token". Throws in case of an error.
	 */
	logOut() {
		if (!this.parseLogOutResponse) {
			throw new Error('`.logOut()` is not implemented for this engine')
		}
		return this.sendRequest(this.options.api.logOut).then(
			(response) => this.parseLogOutResponse(response)
		)
	}

	/**
	 * Tells if an imageboard supports a certain feature.
	 * @param  {string} feature
	 * @return {boolean}
	 */
	supportsFeature = (feature) => {
		switch (feature) {
			case 'getThreads.sortByRating':
				return Boolean(this.options.api && ((
					this.options.api.getThreads &&
					this.options.api.getThreads.features &&
					this.options.api.getThreads.features.includes('rating')
				) || (
					this.options.api.getThreadsStats &&
					this.options.api.getThreadsStats.features &&
					this.options.api.getThreadsStats.features.includes('rating')
				)))
			default:
				throw new Error(`Unknown feature: ${feature}`)
		}
		return this.options.features.includes(feature)
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
		if (thread.latestComments) {
			thread.latestComments = thread.latestComments.map(parseComment)
		}
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
	 * Whether the engine expects to handle a non-2xx response
	 * same way it would handle a 2xx one.
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

const MAX_LATEST_COMMENTS_PAGES_TO_FETCH = 1

function parseResponse({ responseText, requestHeaders }) {
	if (!responseText) {
		return
	}

	switch (requestHeaders && requestHeaders['Accept']) {
		case 'application/json':
			try {
				return JSON.parse(responseText)
			} catch (error) {
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