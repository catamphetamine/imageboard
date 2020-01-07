import Engine from '../../Engine'

import parseBoardsResponse from './board/parseBoardsResponse'
import parseThreadsResponse from './thread/parseThreadsResponse'
import parseThreadResponse from './thread/parseThreadResponse'
import parseComment from './comment/parseComment'

import Board from '../../Board'
import Thread from '../../Thread'
import Comment from '../../Comment'

import PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.4chan'
import EIGHT_CHAN_PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.8ch'
import LAIN_CHAN_PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.lainchan'
import ARISU_CHAN_PARSE_COMMENT_CONTENT_PLUGINS from './comment/parseCommentContentPlugins.arisuchan'

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
		const {
			threads,
			comments
		} = parseThreadsResponse(response)
		return threads.map((thread, i) => Thread(
			thread,
			[this.parseComment(comments[i], options)],
			this.getOptions(options)
		))
	}

	/**
	 * Parses "get thread comments" API response.
	 * @param  {any} response
	 * @param  {object} [options]
	 * @return {Thread}
	 */
	parseThread(response, options) {
		const {
			thread,
			comments
		} = parseThreadResponse(response)
		// Fix incorrect attachments count for certain engines.
		// https://github.com/OpenIB/OpenIB/issues/295
		// `8ch.net` returns incorrect `images` count:
		// for example, a thread having `6` replies and `3` images
		// (one image being part of the "opening post")
		// `replies` is `6` (correct) but `images` and `omitted_images` are both `1`.
		// Therefore, attachments are counted "by hand" in case of `8ch.net` (OpenIB).
		// `vichan` also has the same bug:
		// https://github.com/vichan-devel/vichan/issues/327
		//
		// Also, `vichan` and `OpenIB` don't have `replies` property
		// in "get thread comments" API response.
		//
		if (this.options.engine === 'OpenIB' || this.options.engine === 'vichan') {
			if (thread.commentsCount === undefined) {
				// Not including the "opening comment".
				thread.commentsCount = comments.length - 1
			}
			thread.attachmentsCount = comments.reduce((sum, comment) => sum += comment.attachments ? comment.attachments.length : 0, 0)
		}
		return Thread(
			thread,
			comments.map(comment => this.parseComment(comment, options)),
			this.getOptions(options)
		)
	}

	/**
	 * Creates a `Comment` from comment data.
	 * @param  {object} comment
	 * @param  {object} options
	 * @return {Comment}
	 */
	parseComment(comment, options) {
		options = this.getOptions(options)
		return Comment(parseComment(comment, options), options)
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