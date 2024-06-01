import Engine from '../../Engine.js'

import engineSettings from './settings.json.js'

import parseBoardsResponse from './board/parseBoardsResponse.js'
import parseBoardsPageResponse from './board/parseBoardsPageResponse.js'
import parseThreadsResponse from './thread/parseThreadsResponse.js'
import parseThreadsPageResponse from './thread/parseThreadsPageResponse.js'
import parseThreadResponse from './thread/parseThreadResponse.js'
import parseComment from './comment/parseComment.js'
import parseCreateCommentResponse from './post/parseCreateCommentResponse.js'
import parseUpdateCommentResponse from './post/parseUpdateCommentResponse.js'
import parseCreateThreadResponse from './post/parseCreateThreadResponse.js'
import parseReportCommentResponse from './report/parseReportCommentResponse.js'
import parseGetCaptchaResponse from './captcha/parseGetCaptchaResponse.js'
import parseSolveCaptchaResponse from './captcha/parseSolveCaptchaResponse.js'
import parseCreateBoardResponse from './board/parseCreateBoardResponse.js'
import parseDeleteBoardResponse from './board/parseDeleteBoardResponse.js'
import parseLogInResponse from './logIn/parseLogInResponse.js'
import parseLogOutResponse from './logOut/parseLogOutResponse.js'
import parseGetBlockBypassResponse from './blockBypass/parseGetBlockBypassResponse.js'
import parseCreateBlockBypassResponse from './blockBypass/parseCreateBlockBypassResponse.js'
import parseValidateBlockBypassResponse from './blockBypass/parseValidateBlockBypassResponse.js'

import Board from '../../Board.js'
import Thread from '../../Thread.js'
import Comment from '../../Comment.js'

import PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.js'
import KOHLCHAN_PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.kohlchan.js'

export default class LynxChan extends Engine {
	constructor(imageboardConfig, options) {
		super(imageboardConfig, {
			...options,
			engineSettings,
			parseCommentContentPlugins: getParseCommentContentPlugins(imageboardConfig.id)
		})
	}

	/**
	 * Parses "get boards list" API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {object} { boards: Board[] }
	 */
	parseBoards(response, options) {
		return {
			boards: parseBoardsResponse(response, options).map(Board)
		}
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
	 * @return {object} { threads: Thread[], board: Board }
	 */
	parseThreadsPage(response, options) {
		const { pageCount, board, threads } = parseThreadsPageResponse(response, options)
		return {
			threads: threads.map((thread) => this.createThreadObject(thread, options, { board })),
			board
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
	 * Parses "post thread" API response.
	 * @param  {object} response
	 * @return {number} Returns new thread ID.
	 */
	parseCreateThreadResponse(response) {
		return parseCreateThreadResponse(response)
	}

	/**
	 * Parses "post comment" API response.
	 * @param  {object} response
	 * @return {number} Returns new comment ID.
	 */
	parseCreateCommentResponse(response) {
		return parseCreateCommentResponse(response)
	}

	/**
	 * Parses "edit comment" API response.
	 * @param  {object} response
	 */
	parseUpdateCommentResponse(response) {
		return parseUpdateCommentResponse(response)
	}

	/**
	 * Parses "report" API response.
	 * @param  {object} response
	 */
	parseReportCommentResponse(response) {
		return parseReportCommentResponse(response)
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
	 * Parses "solve CAPTCHA" API response.
	 * @param {object} response
	 * @param {object} options
	 */
	parseSolveCaptchaResponse(response) {
		return parseSolveCaptchaResponse(response)
	}

	/**
	 * Parses "create board" API response.
	 * @param {object} response
	 * @param {object} options
	 */
	parseCreateBoardResponse(response) {
		return parseCreateBoardResponse(response)
	}

	/**
	 * Parses "delete board" API response.
	 * @param {object} response
	 * @param {object} options
	 */
	parseDeleteBoardResponse(response) {
		return parseDeleteBoardResponse(response)
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
	 * Parses "get block bypass" API response.
	 * @param  {object} response
	 */
	parseGetBlockBypassResponse(response) {
		return parseGetBlockBypassResponse(response)
	}

	/**
	 * Parses "create block bypass" API response.
	 * @param  {object} response
	 */
	parseCreateBlockBypassResponse(response) {
		return parseCreateBlockBypassResponse(response)
	}

	/**
	 * Parses "validate block bypass" API response.
	 * @param  {object} response
	 */
	parseValidateBlockBypassResponse(response) {
		return parseValidateBlockBypassResponse(response)
	}
}

function getParseCommentContentPlugins(imageboardId) {
	switch (imageboardId) {
		case 'kohlchan':
			return KOHLCHAN_PARSE_COMMENT_CONTENT_PLUGINS
		default:
			return PARSE_COMMENT_CONTENT_PLUGINS
	}
}