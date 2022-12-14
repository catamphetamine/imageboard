import Thread from './Thread.js'
import Comment from './Comment.js'

import parseAndFormatCommentContent from './parseAndFormatCommentContent.js'

import getBoards from './engine/getBoards.js'
import getThreads from './engine/getThreads.js'
import getThread from './engine/getThread.js'

import {
	applyParameters,
	setParametersInString,
	addQueryParameters
} from './utility/parameters.js'

export default class Engine {
	constructor(chanSettings, {
		useRelativeUrls,
		request,
		...rest
	}) {
		const {
			id,
			domain,
			commentUrl: commentUrlParseTemplate,
			...restChanSettings
		} = chanSettings
		if (!useRelativeUrls) {
			this._baseUrl = `https://${domain}`
		}
		this.request = (method, url, options, { returnResponseInfoObject } = {}) => {
			return request(method, url, options).then((response) => {
				// Some engines (like `makaba`) redirect to a different URL
				// when requesting threads that have been archived.
				// For example, a request to `https://2ch.hk/b/arch/res/119034529.json`
				// redirects to `https://2ch.hk/b/arch/2016-03-06/res/119034529.json`.
				// From that "final" URL, one can get the `archivedAt` date of the thread.
				// For that reason, the application can (optionally) choose to return
				// not simply a `string` from the `request()`'s `Promise`, but instead
				// an `object` having `response: string` and `url: string`.
				// For example, `anychan` uses this undocumented feature
				// in order to get `archivedAt` timestamps on `2ch.hk`.
				if (typeof response === 'object') {
					url = response.url
					response = response.response
				}
				switch (options.headers['Accept']) {
					case 'application/json':
						try {
							response = JSON.parse(response)
						} catch (error) {
							// Sometimes imageboards may go offline while still responding with a web page:
							// an incorrect 2xx HTTP status code with HTML content like "We're temporarily offline".
							// Accepting only `application/json` HTTP responses works around that.
							console.error(`An HTTP request to ${url} returned an invalid JSON:`)
							console.error(response)
							throw new Error('INVALID_RESPONSE')
						}
						break
				}
				if (returnResponseInfoObject) {
					return {
						response,
						url
					}
				}
				return response
			})
		}
		this.options = {
			chan: id,
			toAbsoluteUrl: this.toAbsoluteUrl,
			commentUrl: '/{boardId}/{threadId}#{commentId}',
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
	sendRequest = (url, options = {}, params) => {
		if (typeof url !== 'string') {
			params = options
			options = url
			url = options.url
		}

		let {
			method,
			urlParameters,
			parameters,
			responseType = 'application/json',
			returnResponseInfoObject
		} = options

		let contentType
		let body
		// Get the API endpoint URL.
		if (urlParameters) {
			if (params) {
				urlParameters = applyParameters(urlParameters, params)
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
				parameters = applyParameters(parameters, params)
			}
			if (method === 'GET') {
				url = addQueryParameters(url, parameters)
			} else {
				body = JSON.stringify(parameters)
				contentType = 'application/json'
			}
		}

		// Send HTTP request.
		return this.request(method, url, {
			body,
			headers: {
				'Content-Type': contentType,
				'Accept': responseType
			}
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
		return this.sendRequest(this.options.api.vote, params).then(
			(response) => this.parseVoteResponse(response)
		)
	}

	/**
	 * Performs a "post" API request and parses the response.
	 * @param  {object} parameters — `{ boardId, threadId?, authorName?, authorEmail?, title?, content?, attachments?, attachmentSpoiler?, attachmentFileTag?, textOnly?, accessToken?, captchaId?, captchaSolution? }`.
	 * @return {Promise<number>} Returns new thread ID or new comment ID. Throws an error in case of an error. If the error is "banned" then the error may have properties: `banId`, `banReason`, `banBoardId`, `banEndsAt`.
	 */
	post(params) {
		return this.sendRequest(this.options.api.post, params).then(
			(response) => this.parseLogInResponse(response)
		)
	}

	/**
	 * Performs a "report" API request and parses the response.
	 * @param  {object} parameters — `{ boardId, commentId, content }`.
	 * @return {Promise<void>} Throws in case of an error.
	 */
	report(params) {
		return this.sendRequest(this.options.api.report, params).then(
			(response) => this.parseLogInResponse(response)
		)
	}

	/**
	 * Performs a "log in" API request and parses the response.
	 * @param  {object} parameters — `{ authToken, authTokenPassword }`.
	 * @return {Promise<string>} Returns an "access token". Throws in case of an error.
	 */
	logIn(params) {
		return this.sendRequest(this.options.api.logIn, params).then(
			(response) => this.parseLogInResponse(response)
		)
	}

	/**
	 * Performs a "log out" API request and parses the response.
	 * @return {Promise<string>} Returns an "access token". Throws in case of an error.
	 */
	logOut() {
		return this.sendRequest(this.options.api.logOut).then(
			(response) => this.parseLogOutResponse(response)
		)
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
}

function isJson(response) {
	return Array.isArray(response) || typeof response === 'object'
}

const MAX_LATEST_COMMENTS_PAGES_TO_FETCH = 1