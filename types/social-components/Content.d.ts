// `Content`.
// https://github.com/catamphetamine/social-components/blob/master/docs/Content.md

import {
  Id
} from './Id.d.js';

import {
  Attachment
} from './Attachment.d.js';

// `InlineElement`.

export type InlineElementText = string;

export interface InlineElementStyledText {
  type: 'text';
  style: 'bold' | 'italic' | 'underlined' | 'strikethrough' | 'subscript' | 'superscript';
  content: InlineContent;
}

export type InlineElementNewLine = '\n';

export interface InlineElementEmoji {
  type: 'emoji';
  name: string;
  url: string;
}

export interface InlineElementQuote {
  type: 'quote';
  content: InlineContent;
  kind?: string;
  block?: boolean;
}

export interface InlineElementSpoiler {
  type: 'spoiler';
  content: InlineContent;
  censored?: boolean;
}

export interface InlineElementLink {
  type: 'link';
  url: string;
  service?: string;
  attachment?: Attachment;
  content: InlineContent;
  contentGenerated?: boolean;
}

export interface InlineElementPostLink {
  type: 'post-link';
  url: string;
  postId: Id;
  content: InlineContent;
}

export interface InlineElementCode {
  type: 'code';
  language?: string;
  content: InlineContent;
}

export interface InlineElementReadMore {
	type: 'read-more';
}

export type InlineElement =
	InlineElementText |
	InlineElementStyledText |
	InlineElementNewLine |
	InlineElementEmoji |
	InlineElementQuote |
	InlineElementSpoiler |
	InlineElementLink |
	InlineElementPostLink |
	InlineElementCode |
	InlineElementReadMore;

// `InlineContent`.
export type InlineContent = string | InlineElement[];

// `BlockElement`.

export interface BlockElementHeading {
  type: 'heading';
  content: InlineContent;
}

export interface BlockElementList {
  type: 'list';
  items: InlineContent[];
}

export interface BlockElementCode {
  type: 'code';
  language?: string;
  content: InlineContent;
}

export interface BlockElementQuote {
  type: 'quote';
  url?: string;
  source?: string;
  content: InlineContent;
}

export interface BlockElementAttachmentReference {
  type: 'attachment';
  attachmentId: number;
  expand?: boolean;
  link?: string;
}

export interface BlockElementAttachment {
  type: 'attachment';
  attachment: Attachment;
  expand?: boolean;
  link?: string;
}

export interface BlockElementReadMore {
	type: 'read-more';
}

export type BlockElement =
	BlockElementHeading |
	BlockElementList |
	BlockElementCode |
	BlockElementQuote |
	BlockElementAttachmentReference |
	BlockElementAttachment |
	BlockElementReadMore;

// `ContentBlock`.
export type ContentBlock = BlockElement | InlineContent;

// `Content`.
export type Content = string | ContentBlock[];
