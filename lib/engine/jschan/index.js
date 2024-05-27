import Engine from '../../Engine.js'

import engineSettings from './settings.json.js'

import parseBoardsPageResponse from './board/parseBoardsPageResponse.js'
import parseBoardResponse from './board/parseBoardResponse.js'
import parseThreadsResponse from './thread/parseThreadsResponse.js'
import parseThreadsPageResponse from './thread/parseThreadsPageResponse.js'
import parseThreadResponse from './thread/parseThreadResponse.js'
import parseComment from './comment/parseComment.js'
import parseGetCaptchaResponse from './captcha/parseGetCaptchaResponse.js'
import parseCreateCommentResponse from './post/parseCreateCommentResponse.js'
import parseCreateThreadResponse from './post/parseCreateThreadResponse.js'
import parseReportCommentResponse from './report/parseReportCommentResponse.js'
import parseLogInResponse from './logIn/parseLogInResponse.js'
import parseLogOutResponse from './logOut/parseLogOutResponse.js'
import parseCreateBlockBypassResponse from './blockBypass/parseCreateBlockBypassResponse.js'

import isObject from '../../utility/isObject.js'

import Board from '../../Board.js'
import Thread from '../../Thread.js'
import Comment from '../../Comment.js'

import PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.js'

export default class JsChan extends Engine {
	constructor(imageboardConfig, options) {
		super(imageboardConfig, {
			...options,
			engineSettings,
			parseCommentContentPlugins: PARSE_COMMENT_CONTENT_PLUGINS
		})
	}

	/**
	 * Parses "get boards list page" API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {object} An object of shape `{ boards: Board[], pageCount }`.
	 */
	parseBoardsPage(response, options) {
		const { boards, pageCount } = parseBoardsPageResponse(response, this.getOptions(options))
		return {
			boards: boards.map(Board),
			pageCount
		}
	}

	/**
	 * Parses "get threads list" API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {object} { thread: Thread[], board?: Board }
	 */
	parseThreads(response, options) {
		const { threads } = parseThreadsResponse(response, options)
		return {
			threads: threads.map(thread => this.createThreadObject(thread, options))
		}
	}

	/**
	 * Parses "get threads list" page API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {object} { threads: Thread[], board?: Board }
	 */
	parseThreadsPage(response, options) {
		const { threads } = parseThreadsPageResponse(response, options)
		return {
			threads: threads.map((thread) => this.createThreadObject(thread, options))
		}
	}

	/**
	 * Parses "get thread comments" API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {object} { thread: Thread, board?: Board }
	 */
	parseThread(response, options) {
		const { board, thread } = parseThreadResponse(response, options)
		return {
			thread: this.createThreadObject(thread, options, { board }),
			board
		}
	}

	/**
	 * Parses comment data.
	 * @param  {object} comment
	 * @param  {object} options
	 * @param  {object} parameters.thread
	 * @return {object}
	 */
	_parseComment(comment, options, { thread }) {
		return parseComment(comment, options, { thread })
	}

	/**
	 * Parses "get board settings" API response.
	 * @param {object} response
	 * @param {object} options
	 */
	parseBoardResponse(response, options) {
		return parseBoardResponse(response, options)
	}

	/**
	 * Parses "get CAPTCHA" API response.
	 * @param {object} response
	 * @param {object} options
	 */
	parseGetCaptchaResponse(response, options) {
		return parseGetCaptchaResponse(response, options)
	}

	/**
	 * Parses "report comment" API response.
	 * @param {object} response
	 * @param {object} options
	 */
	parseReportCommentResponse(response, options) {
		return parseReportCommentResponse(response, options)
	}

	/**
	 * Parses "create comment" API response.
	 * @param {object} response
	 * @param {object} options
	 */
	parseCreateCommentResponse(response, options) {
		return parseCreateCommentResponse(response, options)
	}

	/**
	 * Parses "create thread" API response.
	 * @param {object} response
	 * @param {object} options
	 */
	parseCreateThreadResponse(response, options) {
		return parseCreateThreadResponse(response, options)
	}

	/**
	 * Parses "create block bypass" API response.
	 * @param  {object} response
	 * @param  {object} options
	 */
	parseCreateBlockBypassResponse(response, options) {
		return parseCreateBlockBypassResponse(response, options)
	}

	/**
	 * Parses "log in" API response.
	 * @param  {object} response
	 * @param  {object} options
	 */
	parseLogInResponse(response, options) {
		return parseLogInResponse(response, options)
	}

	/**
	 * Parses "log out" API response.
	 * @param  {object} response
	 */
	parseLogOutResponse(response) {
		return parseLogOutResponse(response)
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
		// Handle JSON responses normally: they contain `title` and `message` properties.
		if (isObject(response)) {
			return true
		}
		return false
	}
}