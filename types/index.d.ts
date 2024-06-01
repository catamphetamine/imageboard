import { ImageboardConfig } from './ImageboardConfig.d.js';
export { ImageboardConfig } from './ImageboardConfig.d.js';

export { UserRole, UserRoleScope, CaptchaRule } from './ImageboardConfig.d.js';

import { HttpRequestMethod } from './HttpRequestMethod.d.js';
export { HttpRequestMethod } from './HttpRequestMethod.d.js';

import {
	ContentBlock,
	Attachment,
	Messages as SocialComponentsMessages
} from 'social-components';

export * from 'social-components';

export type ImageboardId =
	'2ch' |
	'27chan' |
	'4chan' |
	'8ch' |
	'94chan' |
	'alogs.space' |
	'arisuchan' |
	'bandada' |
	'diochan' |
	'endchan' |
	'heolcafe' |
	'jakparty.soy' |
	'junkuchan' |
	'kohlchan' |
	'lainchan' |
	'leftypol' |
	'niuchan' |
	'ptchan' |
	'smugloli' |
	'tahtach' |
	'tvchan' |
	'vecchiochan' |
	'wizardchan' |
	'zzzchan';

export interface HttpResponseHeaders {
	get: (name: string) => string | null;
	getSetCookie: () => string[];
}

export type HttpRequestResultBasic = string;

export interface HttpRequestResult {
	url: string;
	responseText?: string;
	headers?: HttpResponseHeaders;
}

export interface HttpRequestError extends Error {
	url: string;
	status: number;
	headers: HttpResponseHeaders;
	responseText?: string;
}

export interface Messages extends SocialComponentsMessages {
	comment?: {
		default?: string;
		deleted?: string;
		external?: string;
	};
	thread?: {
		default?: string;
	};
}

interface ImageboardOptionsOverridable {
	parseContent?: boolean;
	addParseContent?: boolean;
	commentLengthLimit?: number;
	generatedQuoteMaxLength?: number;
	generatedQuoteMinFitFactor?: number;
	generatedQuoteMaxFitFactor?: number;
	generatedQuoteGetCharactersCountPenaltyForLineBreak?: ({ textBefore: string }) => number;
	minimizeGeneratedPostLinkBlockQuotes?: boolean;
}

export interface HttpRequestOptions {
	body?: Record<string, any>;
	headers: Record<string, string>;
	cookies?: Record<string, string>;
}

export type HttpRequestFunction = (method: HttpRequestMethod, url: string, options: HttpRequestOptions) => Promise<HttpRequestResultBasic | HttpRequestResult>;

export interface ImageboardOptions extends ImageboardOptionsOverridable {
	request: HttpRequestFunction;
	commentUrl?: string;
	threadUrl?: string;
	messages?: Messages;
	useRelativeUrls?: boolean;
	expandReplies?: boolean;
	getPostLinkProperties?: (comment?: Comment) => object;
	getPostLinkText?: (postLink: object) => string | undefined;
	getSetCookieHeaders?: (parameters: { headers: HttpResponseHeaders }) => string[];
}

export type BoardId = string;
export type ThreadId = number;
export type CommentId = number;

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

export interface Thread {
	id: ThreadId;
	boardId: BoardId;
	title?: string;
	autogeneratedTitle?: string;
	createdAt?: Date;
	updatedAt?: Date;
	afterCommentId?: CommentId;
	commentsCount: number;
	attachmentsCount: number;
	commentAttachmentsCount: number;
	uniquePostersCount?: number;
	comments: Comment[];
	latestComments?: Comment[];
	pinned?: boolean;
	pinnedOrder?: number;
	locked?: boolean;
	trimming?: boolean;
	archived?: boolean;
	archivedAt?: Date;
	bumpLimitReached?: boolean;
	attachmentLimitReached?: boolean;
	customSpoilerId?: number;
}

export type GetCommentById = (id: CommentId) => Comment | undefined;

export type RawCommentContent = string;

// This library always returns an array of content blocks when parsing a comment's content,
// even when it's just a single "block" of simple text like `[["Text"]]`.
// That's just how `social-components-parser` works.
//
// export type ParsedCommentContent = Content;
export type ParsedCommentContent = ContentBlock[];

// In `ParsedCommentContent`, some structure is modified:
// * `type: "post-link"` parts have `boardId: string` and `threadId: number` properties.
// * `type: "quote"` parts have `generated: boolean` properties.

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
	inReplyToIds?: Comment['id'][];
	inReplyToIdsRemoved?: Comment['id'][];
	inReplyTo?: Comment[];
	replyIds?: Comment['id'][];
	replies?: Comment[];
	attachments?: Attachment[];

	parseContent?: (options?: { getCommentById?: GetCommentById }) => void;
	createContentPreview?: (options?: { maxLength?: number }) => void;
	hasContentBeenParsed?: () => boolean;
	onContentChange?: (options?: { getCommentById: GetCommentById }) => CommentId[];
}

export interface GetBoardsResult {
	boards: Board[];
}

export interface GetTopBoardsResult {
	boards: Board[];
}

export interface FindBoardsParameters extends ImageboardOptionsOverridable {
	search: string;
}

export interface FindBoardsResult {
	boards: Board[];
}

export interface GetThreadsParameters extends ImageboardOptionsOverridable {
	boardId: BoardId;
	withLatestComments?: boolean;
	maxLatestCommentsPages?: number;
	latestCommentLengthLimit?: number;
	sortByRating?: boolean;
}

export interface GetThreadsResult {
	threads: Thread[];
	board?: Board;
}

export interface GetThreadParameters extends ImageboardOptionsOverridable {
	boardId: BoardId;
	threadId: ThreadId;
	archived?: boolean;
	afterCommentId?: CommentId;
	afterCommentsCount?: number;
}

export interface GetThreadResult {
	thread: Thread;
	board?: Board;
}

export type PostFormAttachment = File | Blob;

export interface VoteForCommentParameters {
	boardId: BoardId;
	threadId: ThreadId;
	commentId: CommentId;
	up: boolean;
}

export type VoteForCommentResult = boolean

export interface ReportCommentParameters {
	boardId: BoardId;
	threadId: ThreadId;
	commentId: CommentId;
	content?: string;
	reasonId?: number | string;
	legalViolationReasonId?: number;
	captchaId?: string;
	captchaSolution?: string;
}

export interface GetCaptchaParameters {
	boardId?: BoardId;
	threadId?: ThreadId;
}

export type Captcha = CaptchaWithImage | CaptchaWithImageSlider;

export interface CaptchaImage {
	type: 'image/png' | 'image/jpeg';
	url: string;
	width: number;
	height: number;
}

export interface CaptchaWithImage {
	id: string;
	type: 'text';
	challengeType: 'image';
	characterSet?: 'numeric' | 'russian';
	expiresAt: Date;
	image: CaptchaImage;
}

export interface CaptchaWithImageSlider {
	id: string;
	type: 'text';
	challengeType: 'image-slider';
	expiresAt: Date;
	image: CaptchaImage;
	backgroundImage: CaptchaImage;
}

export interface GetCaptchaResult {
	captcha: Captcha;
	canRequestNewCaptchaAt?: Date;
}

export interface CreateThreadParameters {
	boardId: BoardId;
	authorIsThreadAuthor?: boolean;
	accessToken?: string;
	authorEmail?: string;
	authorName?: string;
	attachments?: PostFormAttachment[];
	title?: string;
	content?: string;

	// `makaba`-specific properties:
	authorBadgeId?: number;
	tags?: string[];
	captchaType?: string;
	captchaId?: string;
	captchaSolution?: string;
}

export interface CreateThreadResult {
	id: ThreadId;
}

export interface CreateCommentParameters extends CreateThreadParameters {
	threadId: ThreadId;
}

export interface CreateCommentResult {
	id: CommentId;
}

export interface LogInParameters {
	token: string;

	// `4chan` uses "passwords" on login tokens.
	tokenPassword?: string;
}

export interface LogInResult {
	accessToken?: string;
}

export interface CreateBlockBypassParameters {
	captchaId: string;
	captchaSolution: string;
}

export interface CreateBlockBypassResult {
	token: string;
	expiresAt: Date;
}

export type ImageboardFeature = 'getThreads.sortByRating' | 'getTopBoards' | 'findBoards';

export interface Imageboard {
	// This method is not currently public.
	supportsFeature: (feature: ImageboardFeature) => boolean;
	getBoards: () => Promise<GetBoardsResult>;
	getTopBoards: () => Promise<GetTopBoardsResult>;
	findBoards: (parameters: FindBoardsParameters) => Promise<FindBoardsResult>;
	getThreads: (parameters: GetThreadsParameters) => Promise<GetThreadsResult>;
	getThread: (parameters: GetThreadParameters) => Promise<GetThreadResult>;
	voteForComment: (parameters: VoteForCommentParameters) => Promise<VoteForCommentResult>;
	reportComment: (parameters: ReportCommentParameters) => Promise<void>;
	createThread: (parameters: CreateThreadParameters) => Promise<CreateThreadResult>;
	createComment: (parameters: CreateCommentParameters) => Promise<CreateCommentResult>;
	logIn: (parameters: LogInParameters) => Promise<LogInResult>;
	logOut: () => Promise<void>;
	getCaptcha: (parameters: GetCaptchaParameters) => Promise<GetCaptchaResult>;
	createBlockBypass: (parameters: CreateBlockBypassParameters) => Promise<CreateBlockBypassResult>;
}

export function getConfig(imageboardId: ImageboardId): ImageboardConfig;

export function getCommentText(comment: Comment, options?: {
	messages?: Messages;
	skipPostQuoteBlocks?: boolean;
	skipGeneratedPostQuoteBlocks?: boolean;
}): string | undefined;

export function sortThreadsWithPinnedOnTop<T extends Pick<Thread, 'pinned' | 'pinnedOrder'>>(threads: T[]): T[];

declare function Imageboard(imageboardIdOrConfig: ImageboardId | ImageboardConfig, options: ImageboardOptions): Imageboard;

export default Imageboard;