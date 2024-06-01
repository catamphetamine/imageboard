import {
	quote,
	link
} from './parseCommentContentPlugins.js'

import {
	code,
	codeBlock
} from './parseCommentContentPlugins.lainchan.js'

export const bold = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'bold'
		}
	],
	createElement(content) {
		return {
			type: 'text',
			style: 'bold',
			content
		}
	}
}

export const italic = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'italic'
		}
	],
	createElement(content) {
		return {
			type: 'text',
			style: 'italic',
			content
		}
	}
}

export const underline = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'underline'
		}
	],
	createElement(content) {
		return {
			type: 'text',
			style: 'underline',
			content
		}
	}
}

const strikethrough = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'strikethrough'
		}
	],
	createElement(content) {
		return {
			type: 'text',
			style: 'strikethrough',
			content
		}
	}
}

const heading = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'header'
		}
	],
	createElement(content) {
		return {
			type: 'text',
			style: 'heading',
			content
		}
	}
}

const spoiler = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'spoiler'
		}
	],
	createElement(content) {
		return {
			type: 'spoiler',
			content
		}
	}
}

export default [
	bold,
	italic,
	underline,
	strikethrough,
	heading,
	spoiler,
	quote,
	link,
	code,
	codeBlock
]