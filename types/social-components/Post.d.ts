// `Post`.
// https://github.com/catamphetamine/social-components/blob/master/docs/Post.md

import {
	Id
} from './Id.d.js';

import {
	Picture
} from './ContentType.d.js';

import {
	Content
} from './Content.d.js';

import {
	Attachment
} from './Attachment.d.js';

export interface Post {
	id?: Id;
	title?: string;
	titleCensored?: string;
	author?: {
		id?: Id;
		name?: string;
		picture?: Picture;
	},
	content?: Content;
	createdAt?: Date;
	attachments?: Attachment[];
	replies?: Post[];
}