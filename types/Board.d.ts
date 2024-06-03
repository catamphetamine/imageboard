export type BoardId = string;

export interface Board {
	id: BoardId;
	title: string;
	category?: string;
	description?: string;
	notSafeForWork?: boolean;
	commentsPerHour?: number;
	commentContentMinLength?: number;
	mainCommentContentMaxLength?: number;
	mainCommentContentMinLength?: number;
	threadTitleRequired?: boolean;
	mainCommentContentRequired?: boolean;
	mainCommentAttachmentRequired?: boolean;
	threadAttachmentsMaxCount?: number;
	videoAttachmentMaxSize?: number;
	videoAttachmentMaxDuration?: number;
	createThreadMinInterval?: number;
	createCommentMinInterval?: number;
	createCommentWithAttachmentMinInterval?: number;
	bumpLimit?: number;
	commentContentMaxLength?: number;
	attachmentsMaxTotalSize?: number;
	attachmentMaxSize?: number;
	attachmentsMaxCount?: number;
	features?: {
		sage?: boolean;
		authorName?: boolean;
		authorEmail?: boolean;
		threadTitle?: boolean;
		commentTitle?: boolean;
		attachments?: boolean;
		threadTags?: boolean;
		votes?: boolean;
	};
	badges?: BoardBadge[];
}

export interface BoardBadge {
	id: string;
	title: string;
}