import Engine from '../../Engine.js'

import parseBoardsResponse from './board/parseBoardsResponse.js'
import parseBoardsPageResponse from './board/parseBoardsPageResponse.js'
import parseThreadsResponse from './thread/parseThreadsResponse.js'
import parseThreadsPageResponse from './thread/parseThreadsPageResponse.js'
import parseThreadResponse from './thread/parseThreadResponse.js'
import parseComment from './comment/parseComment.js'

import Board from '../../Board.js'
import Thread from '../../Thread.js'
import Comment from '../../Comment.js'

import PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.js'
import KOHLCHAN_PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.kohlchan.js'

export default class LynxChan extends Engine {
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
		return parseBoardsResponse(response, options).map(Board)
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
	 * @return {Thread[]}
	 */
	parseThreads(response, options) {
		const { threads } = parseThreadsResponse(response)
		return threads.map(thread => this.createThreadObject(thread, options))
	}

	/**
	 * Parses "get threads list" page API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {Thread[]}
	 */
	parseThreadsPage(response, options) {
		const { board, threads } = parseThreadsPageResponse(response)
		return threads.map((thread) => this.createThreadObject(thread, options, { board }))
	}

	/**
	 * Parses "get thread comments" API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {Thread}
	 */
	parseThread(response, options) {
		const { board, thread } = parseThreadResponse(response)
		return this.createThreadObject(thread, options, { board })
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
}

function getParseCommentContentPlugins(chan) {
	switch (chan) {
		case 'kohlchan':
			return KOHLCHAN_PARSE_COMMENT_CONTENT_PLUGINS
		default:
			return PARSE_COMMENT_CONTENT_PLUGINS
	}
}