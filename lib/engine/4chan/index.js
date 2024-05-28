import Engine from '../../Engine.js'

import engineSettings from './settings.json.js'

import parseBoardsResponse from './board/parseBoardsResponse.js'
import parseThreadsResponse from './thread/parseThreadsResponse.js'
import parseThreadsPageResponse from './thread/parseThreadsPageResponse.js'
import parseThreadResponse from './thread/parseThreadResponse.js'
import parseIncrementalThreadResponse from './thread/parseIncrementalThreadResponse.js'
import parseComment from './comment/parseComment.js'
import parseCreateThreadResponse from './post/parseCreateThreadResponse.js'
import parseCreateThreadResponseInfinity from '../infinity/post/parseCreateThreadResponse.js'
import parseCreateCommentResponse from './post/parseCreateCommentResponse.js'
import parseCreateCommentResponseInfinity from '../infinity/post/parseCreateCommentResponse.js'
import parseReportCommentResponse from './report/parseReportCommentResponse.js'
import parseGetCaptchaResponse from './captcha/parseGetCaptchaResponse.js'
import parseGetCaptchaResponseInfinity from '../infinity/captcha/parseGetCaptchaResponse.js'
import parseLogInResponse from './logIn/parseLogInResponse.js'
import parseLogOutResponse from './logOut/parseLogOutResponse.js'

import Board from '../../Board.js'
import Thread from '../../Thread.js'
import Comment from '../../Comment.js'

import PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.4chan.js'

export default class FourChan extends Engine {
	constructor(imageboardConfig, options) {
		super(imageboardConfig, {
			...options,
			engineSettings: options && options.engineSettings || engineSettings,
			parseCommentContentPlugins: options && options.parseCommentContentPlugins || PARSE_COMMENT_CONTENT_PLUGINS,
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
			boards: parseBoardsResponse(response, this.getOptions(options)).map(Board)
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
			threads: threads.map(thread => this.createThreadObject(thread, options))
		}
	}

	/**
	 * Parses "get thread comments" API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {object} { thread: Thread, board?: Board }
	 */
	parseThread(response, options) {
		const { thread } = parseThreadResponse(response, options)
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
		return {
			thread: this.createThreadObject(thread, options)
		}
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
		switch (this.options.engine) {
			case 'infinity':
			case 'OpenIB':
				return parseCreateThreadResponseInfinity(response)
			default:
				return parseCreateThreadResponse(response)
		}
	}

	/**
	 * Parses "create comment" API response.
	 * @param  {object} response
	 * @return {number} Returns new thread ID or new comment ID.
	 */
	parseCreateCommentResponse(response) {
		switch (this.options.engine) {
			case 'infinity':
			case 'OpenIB':
				return parseCreateCommentResponseInfinity(response)
			default:
				return parseCreateCommentResponse(response)
		}
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
		switch (this.options.engine) {
			case 'infinity':
			case 'OpenIB':
				return parseGetCaptchaResponseInfinity(response, options)
			default:
				return parseGetCaptchaResponse(response, options)
		}
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