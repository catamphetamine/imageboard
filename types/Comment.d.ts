import {
	ContentBlock,
	Attachment
} from 'social-components';

export type CommentId = number;

export interface Comment {
	id: CommentId;
	title?: string;
	createdAt: Date;
	updatedAt?: Date;

	authorIsThreadAuthor?: boolean;
	authorId?: string;
	authorIdColor?: string;
	authorNameIsId?: boolean;
	authorName?: string;
	authorEmail?: string;
	authorTripCode?: string;
	authorCountry?: string;
	authorBadgeUrl?: string;
	authorBadgeName?: string;
	authorRole?: string;
	authorRoleScope?: string;
	authorBan?: boolean;
	authorBanReason?: string;
	authorVerified?: boolean;

	sage?: boolean;
	upvotes?: number;
	downvotes?: number;
	content?: RawCommentContent | ParsedCommentContent;
	contentPreview?: ParsedCommentContent;
	inReplyToIds?: CommentId[];
	inReplyToIdsRemoved?: CommentId[];
	inReplyTo?: Comment[];
	replyIds?: CommentId[];
	replies?: Comment[];
	attachments?: Attachment[];

	parseContent?: (options?: { getCommentById?: GetCommentById }) => void;
	createContentPreview?: (options?: { maxLength?: number }) => void;
	hasContentBeenParsed?: () => boolean;
	onContentChange?: (options?: { getCommentById: GetCommentById }) => CommentId[];
}

export type RawCommentContent = string;

// This library always returns an array of content blocks when parsing a comment's content,
// even when it's just a single "block" of simple text like `[["Text"]]`.
// That's just how `social-components-parser` works.
//
// export type ParsedCommentContent = Content;
export type ParsedCommentContent = ContentBlock[];

export type GetCommentById = (id: CommentId) => Comment | undefined;