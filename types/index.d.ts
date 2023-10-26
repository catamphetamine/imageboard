import { ImageboardConfig } from './ImageboardConfig.d.js';
export { ImageboardConfig } from './ImageboardConfig.d.js';

import { HttpRequestMethod } from './HttpRequestMethod.d.js';
export { HttpRequestMethod } from './HttpRequestMethod.d.js';

import {
	ContentBlock,
	Attachment
} from './social-components/index.d.js';

export * from './social-components/index.d.js';

export type ImageboardId = '4chan' | '2ch' | '8ch' | 'kohlchan' | 'arisuchan' | 'endchan' | 'lainchan';

export interface HttpRequestOptions {
	body?: string;
	headers?: Record<string, string>;
}

export type HttpRequestResult = string;

export interface HttpRequestResultWithRedirectToUrl {
	response: string;
	url: string;
}

interface Messages {
	comment?: {
		default?: string;
		deleted?: string;
		external?: string;
	};
	thread?: {
		default?: string;
	};
	// https://gitlab.com/catamphetamine/social-components/-/tree/master#messages
	textContent?: {
		block?: {
			audio?: string;
			video?: string;
			picture?: string;
			attachment?: string;
			inline?: {
				attachment?: string;
				link?: string;
				linkTo?: string;
			}
		};
	};
}

interface ImageboardOptionsOverridable {
	parseContent?: boolean;
	addParseContent?: boolean;
	commentLengthLimit?: number;
}

interface ImageboardOptions extends ImageboardOptionsOverridable {
	request: (method: HttpRequestMethod, url: string, parameters: HttpRequestParameters) => Promise<HttpRequestResult | HttpRequestResultWithRedirectToUrl>;
	commentUrl?: string;
	threadUrl?: string;
	messages?: Messages;
	useRelativeUrls?: boolean;
	expandReplies?: boolean;
	getPostLinkProperties?: (comment?: Comment) => object;
	getPostLinkText?: (postLink: object) => string?;
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
	bumpLimit?: number;
	commentsPerHour?: number;
	maxCommentLength?: number;
	maxAttachments?: number;
	maxAttachmentsInThread?: number;
	maxAttachmentSize?: number;
	maxAttachmentsSize?: number;
	maxVideoAttachmentSize?: number;
	maxVideoAttachmentDuration?: number;
	createThreadCooldown?: number;
	postCommentCooldown?: number;
	attachFileCooldown?: number;
	features?: {
		sage?: boolean;
		name?: boolean;
	};
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
	commentsCount: number;
	attachmentsCount: number;
	commentAttachmentsCount: number;
	uniquePostersCount?: number;
	comments: Comment[];
	pinned?: boolean;
	pinnedOrder?: number;
	locked?: boolean;
	trimming?: boolean;
	archived?: boolean;
	archivedAt?: Date;
	bumpLimitReached?: boolean;
	attachmentLimitReached?: boolean;
	customSpoilerId?: number;
	board?: {
		title?: string;
		bumpLimit?: number;
		maxCommentLength?: number;
		maxAttachmentsSize?: number;
		maxAttachmentSize?: number;
		maxAttachments?: number;
		features?: {
			subject?: boolean;
			attachments?: boolean;
			tags?: boolean;
			votes?: boolean;
		};
		badges?: BoardBadge[];
	}
}

export type GetCommentById = (id: CommentId) => Comment | undefined;

export type RawCommentContent = string;

// This library always returns an array of content blocks when parsing a comment's content,
// even when it's just a single "block" of simple text like `[["Text"]]`.
// That's just how `social-components-parser` works.
//
// export type ParsedCommentContent = Content;
export type ParsedCommentContent = ContentBlock[];

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
	inReplyTo?: number[] | Comment[];
	inReplyToRemoved?: number[];
	replies?: number[] | Comment[];
	attachments?: Attachment[];

	parseContent?: (options?: { getCommentById: GetCommentById }) => void;
	hasContentBeenParsed?: () => boolean;
	onContentChange?: (options?: { getCommentById: GetCommentById }) => void;
}

interface GetThreadsOptions extends ImageboardOptionsOverridable {
	withLatestComments?: boolean;
	maxLatestCommentsPages?: number;
	latestCommentLengthLimit?: number;
	sortByRating?: boolean;
}

interface GetThreadOptions extends ImageboardOptionsOverridable {
	archived?: boolean;
	afterCommentId?: CommentId;
	afterCommentsCount?: number;
}

type PostFormAttachmentFile = File | Blob;

interface VoteForCommentOptions {
	boardId: BoardId;
	threadId: ThreadId;
	commentId: CommentId;
	up: boolean;
}

interface ReportCommentOptions {
	boardId: BoardId;
	threadId: ThreadId;
	commentId: CommentId;
	content?: string;
	reasonId?: number;
	legalViolationReasonId?: number;
	captchaId?: string;
	captchaSolution?: string;
}

interface GetCaptchaOptions {
	boardId: BoardId;
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

interface GetCaptchaResult {
	captcha: Captcha;
	canRequestNewCaptchaAt?: Date;
}

interface CreateThreadOptions {
	boardId: BoardId;
	authorIsThreadAuthor?: boolean;
	accessToken?: string;
	authorEmail?: string;
	authorName?: string;
	attachments?: PostFormAttachmentFile[];
	title?: string;
	content?: string;

	// `makaba`-specific properties:
	authorBadgeId?: number;
	tags?: string[];
	captchaType?: string;
	captchaId?: string;
	captchaSolution?: string;
}

interface CreateCommentOptions extends CreateThreadOptions {
	threadId: ThreadId;
}

interface LogInOptions {
	token: string;
	// `4chan` uses "passwords" on login tokens.
	tokenPassword?: string;
}

interface LogInResult {
	accessToken?: string;
}

export type Feature = 'getThreads.sortByRating';

export interface Imageboard {
	// This method is not currently public.
	supportsFeature: (feature: Feature) => boolean;
	getBoards: () => Promise<Board[]>;
	getAllBoards: () => Promise<Board[]>;
	hasMoreBoards: () => boolean;
	findBoards: (query: string) => Promise<Board[]>;
	canSearchForBoards: () => boolean;
	getThreads: (parameters: { boardId: BoardId }, options?: GetThreadsOptions) => Promise<Thread[]>;
	getThread: (parameters: { boardId: BoardId, threadId: ThreadId }, options?: GetThreadOptions) => Promise<Thread>;
	voteForComment: (parameters: VoteForCommentOptions) => Promise<boolean>;
	reportComment: (parameters: ReportCommentOptions) => Promise<void>;
	createThread: (parameters: CreateThreadOptions) => Promise<{ id: ThreadId }>;
	createComment: (parameters: CreateCommentOptions) => Promise<{ id: CommentId }>;
	getCaptcha: (parameters: GetCaptchaOptions) => Promise<GetCaptchaResult>;
	logIn: (parameters: LogInOptions) => Promise<LogInResult>;
	logOut: () => Promise<void>;
}

export function getConfig(imageboardId: ImageboardId): ImageboardConfig;

export function getCommentText(comment: Comment, options?: {
	messages?: Messages;
	skipPostQuoteBlocks?: boolean;
	skipGeneratedPostQuoteBlocks?: boolean;
}): string | undefined;

export function sortThreadsWithPinnedOnTop(threads: Thread[], sortThreads: (threads: Thread[]) => Thread[]): Thread[];

function Imageboard(imageboardIdOrConfig: ImageboardId | ImageboardConfig, options: ImageboardOptions): Imageboard;

export default Imageboard;