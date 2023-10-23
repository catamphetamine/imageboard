import Engine from '../../Engine.js'

import parseBoardsResponse from './board/parseBoardsResponse.js'
import parseThreadsResponse from './thread/parseThreadsResponse.js'
import parseThreadsPageResponse from './thread/parseThreadsPageResponse.js'
import parseThreadsStatsResponse from './thread/parseThreadsStatsResponse.js'
import parseThreadResponse from './thread/parseThreadResponse.js'
import parseIncrementalThreadResponse from './thread/parseIncrementalThreadResponse.js'
import parseComment from './comment/parseComment.js'
import parseVoteResponse from './vote/parseVoteResponse.js'
import parseCreateCommentResponse from './comment/parseCreateCommentResponse.js'
import parseCreateThreadResponse from './thread/parseCreateThreadResponse.js'
import parseGetCaptchaResponse from './captcha/parseGetCaptchaResponse.js'
import parseReportResponse from './report/parseReportResponse.js'
import parseLogInResponse from './logIn/parseLogInResponse.js'
import parseLogOutResponse from './logOut/parseLogOutResponse.js'

import Board from '../../Board.js'
import Thread from '../../Thread.js'
import Comment from '../../Comment.js'

import PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.js'

export default class Makaba extends Engine {
	constructor(chanSettings, options) {
		super(chanSettings, {
			...options,
			parseCommentContentPlugins: PARSE_COMMENT_CONTENT_PLUGINS
		})
	}

	/**
	 * Parses "get boards list" API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {Board[]}
	 */
	parseBoards(response, options) {
		return parseBoardsResponse(response, options).map(Board)
	}

	/**
	 * Parses "get threads list" API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {Thread[]}
	 */
	parseThreads(response, options) {
		const { board, threads } = parseThreadsResponse(response)
		return threads.map(thread => this.createThreadObject(thread, options, { board }))
	}

	/**
	 * Parses "get threads list" with stats API response.
	 * @param  {any} response
	 * @return {object} Thread stats index
	 */
	parseThreadsStats(response) {
		return parseThreadsStatsResponse(response)
	}

	/**
	 * Parses "get threads list" page API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {Thread[]}
	 */
	parseThreadsPage(response, options) {
		const { board, threads } = parseThreadsPageResponse(response)
		return threads.map(thread => this.createThreadObject(thread, options, { board }))
	}

	/**
	 * Parses "get thread comments" API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {Thread}
	 */
	parseThread(response, options) {
		const { thread, board } = parseThreadResponse(response)
		return this.createThreadObject(thread, options, { board })
	}

	/**
	 * Parses comment data.
	 * @param  {object} comment
	 * @param  {object} options
	 * @param  {object} parameters.board
	 * @return {object}
	 */
	_parseComment(comment, options, { board }) {
		return parseComment(comment, options, { board })
	}

	/**
	 * Parses "incremental" comments list refresh response for a thread.
	 * @param {object} response
	 * @param {object} options
	 * @return {object} [response]
	 */
	parseIncrementalThreadResponse(response, options) {
		return parseIncrementalThreadResponse(response, options)
	}

	/**
	 * Parses "vote" API response.
	 * @param  {object} response
	 * @return {boolean} Returns `true` if the vote has been accepted.
	 */
	parseVoteResponse(response) {
		return parseVoteResponse(response)
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
	 * Parses "get CAPTCHA" API response.
	 * @param {object} options
	 * @param {object} response
	 */
	parseGetCaptchaResponse(response, options) {
		return parseGetCaptchaResponse(response, {
			...options,
			toAbsoluteUrl: this.toAbsoluteUrl
		})
	}

	/**
	 * Parses "report" API response.
	 * @param  {object} response
	 */
	parseReportResponse(response) {
		return parseReportResponse(response)
	}

	/**
	 * Parses "log in" API response.
	 * @param  {object} response
	 */
	parseLogInResponse(response) {
		return parseLogInResponse(response)
	}

	/**
	 * Parses "log out" API response.
	 * @param  {object} response
	 */
	parseLogOutResponse(response) {
		return parseLogOutResponse(response)
	}
}