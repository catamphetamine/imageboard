import createLink from '../../../utility/createLink.js'
import dropQuoteMarker from '../../../dropQuoteMarker.js'
import parsePostLink from '../../../parsePostLink.js'

import {
	bold,
	italic,
	underline,
	code,
	quote,
	link
} from './parseCommentContentPlugins.js'

// They have these in `/g/` for some reason.
const boldLegacy = {
	tag: 'b',
	createElement(content) {
		return {
			type: 'text',
			style: 'bold',
			content
		}
	}
}

// They have these in `/g/` for some reason.
const italicLegacy = {
	tag: 'i',
	createElement(content) {
		return {
			type: 'text',
			style: 'italic',
			content
		}
	}
}

// 4chan.org spoiler.
const spoiler = {
	tag: 's',
	createElement(content) {
		return {
			type: 'spoiler',
			content
		}
	}
}

const deletedLink = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'deadlink'
		}
	],
	// The `correctContent` property doesn't seem to be used.
	// // Won't "unescape" content (for some reason).
	// correctContent: false,
	createElement(content) {
		content = content.slice('>>'.length)
		return {
			type: 'post-link',
			boardId: null, // Will be overwritten anyway later in comment post-processing.
			threadId: null, // Will be overwritten anyway later in comment post-processing.
			postId: parseInt(content),
			content,
			url: null // Will be overwritten anyway later in comment post-processing.
		}
	}
}

// "ASCII art" or "ShiftJIS art".
const asciiShiftJisArt = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'sjis'
		}
	],
	createElement(content) {
		return {
			type: 'text',
			style: 'ascii-shift-jis-art',
			content
		}
	}
}

// They also have things like:
// * `<span style="color:#789922;">...</span>`
// * `<span class="fortune" style="color:#789922;">...</span>`
// * `<span style="color: red; font-size: xx-large;">...</span>`
// * `<font size="4">...</font>`
// * `<font color="red">...</font>`
// * `<img src="//static.4chan.org/image/temp/dinosaur.gif"/>`
// * `<span style="font-size:20px;font-weight:600;line-height:120%">...</span>`
// * `<ul/>`/`<li/>`
// * `<h1/>`
// * `<blink/>`
// * `<div align="center"/>`
// * There're even `<table/>`s in "Photography"
export default [
	bold,
	boldLegacy,
	italic,
	italicLegacy,
	underline,
	spoiler,
	quote,
	// `deletedLink` must precede `link`.
	deletedLink,
	link,
	code,
	asciiShiftJisArt
]