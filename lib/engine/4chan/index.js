import Engine from '../../Engine.js'

import parseBoardsResponse from './board/parseBoardsResponse.js'
import parseThreadsResponse from './thread/parseThreadsResponse.js'
import parseThreadsPageResponse from './thread/parseThreadsPageResponse.js'
import parseThreadResponse from './thread/parseThreadResponse.js'
import parseIncrementalThreadResponse from './thread/parseIncrementalThreadResponse.js'
import parseComment from './comment/parseComment.js'
import parseCreateThreadResponse from './thread/parseCreateThreadResponse.js'
import parseCreateCommentResponse from './comment/parseCreateCommentResponse.js'
import parseReportCommentResponse from './report/parseReportCommentResponse.js'
import parseGetCaptchaResponse from './captcha/parseGetCaptchaResponse.js'
import parseLogInResponse from './logIn/parseLogInResponse.js'
import parseLogOutResponse from './logOut/parseLogOutResponse.js'

import Board from '../../Board.js'
import Thread from '../../Thread.js'
import Comment from '../../Comment.js'

import PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.4chan.js'
import EIGHT_CHAN_PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.8ch.js'
import LAIN_CHAN_PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.lainchan.js'
import ARISU_CHAN_PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.arisuchan.js'

export default class FourChan extends Engine {
	constructor(chanSettings, options) {
		super(chanSettings, {
			...options,
			parseCommentContentPlugins: getParseCommentContentPlugins(chanSettings.id)
		})
	}

	/**
	 * Parses "get boards list" API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {Board[]}
	 */
	parseBoards(response, options) {
		return parseBoardsResponse(response, this.getOptions(options)).map(Board)
	}

	/**
	 * Parses "get threads list" API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {Thread[]}
	 */
	parseThreads(response, options) {
		const { threads } = parseThreadsResponse(response, options)
		return threads.map(thread => this.createThreadObject(thread, options))
	}

	/**
	 * Parses "get threads list" page API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {Thread[]}
	 */
	parseThreadsPage(response, options) {
		const { threads } = parseThreadsPageResponse(response)
		return threads.map(thread => this.createThreadObject(thread, options))
	}

	/**
	 * Parses "get thread comments" API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {Thread}
	 */
	parseThread(response, options) {
		const { thread } = parseThreadResponse(response)
		// Fix incorrect attachments count for certain engines.
		//
		// `8ch.net` returns incorrect `images` count:
		// for example, a thread having `6` replies and `3` images
		// (one image being part of the "opening post")
		// `replies` is `6` (correct) but `images` and `omitted_images` are both `1`.
		// https://github.com/OpenIB/OpenIB/issues/295
		//
		// Or, in `/catalog.json`, it can sometimes be as weird as:
		// {
		// 	"omitted_posts": 249,
		// 	"omitted_images": 250,
		// 	"replies": 250,
		// 	"images": 1,
		// }
		//
		// Therefore, attachments are counted "by hand" in case of `8ch.net` (OpenIB).
		//
		// `vichan` also has the same bug:
		// https://github.com/vichan-devel/vichan/issues/327
		//
		// Also, `vichan` and `OpenIB` don't have `replies` property
		// in "get thread comments" API response.
		//
		if (this.options.engine === 'OpenIB' || this.options.engine === 'vichan') {
			if (thread.commentsCount === undefined) {
				thread.commentsCount = thread.comments.length
			}
			thread.attachmentsCount = thread.comments.reduce(
				(sum, comment) => sum += comment.attachments ? comment.attachments.length : 0,
				0
			)
		}
		return this.createThreadObject(thread, options)
	}

	/**
	 * Parses comment data.
	 * @param  {object} comment
	 * @param  {object} options
	 * @return {object}
	 */
	_parseComment(comment, options) {
		return parseComment(comment, options)
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
	 * Parses "create thread" API response.
	 * @param  {object} response
	 * @return {number} Returns new thread ID or new comment ID.
	 */
	parseCreateThreadResponse(response) {
		return parseCreateThreadResponse(response)
	}

	/**
	 * Parses "create comment" API response.
	 * @param  {object} response
	 * @return {number} Returns new thread ID or new comment ID.
	 */
	parseCreateCommentResponse(response) {
		return parseCreateCommentResponse(response)
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
}

function getParseCommentContentPlugins(chan) {
	switch (chan) {
		case '8ch':
			return EIGHT_CHAN_PARSE_COMMENT_CONTENT_PLUGINS
		case 'lainchan':
			return LAIN_CHAN_PARSE_COMMENT_CONTENT_PLUGINS
		case 'arisuchan':
			return ARISU_CHAN_PARSE_COMMENT_CONTENT_PLUGINS
		default:
			return PARSE_COMMENT_CONTENT_PLUGINS
	}
}