import { ImageboardConfig } from './ImageboardConfig.d.js';
export { ImageboardConfig } from './ImageboardConfig.d.js';

export { ImageboardEngine, UserRole, UserRoleScope, CaptchaRule } from './ImageboardConfig.d.js';

import { HttpResponseHeaders, HttpRequestHeaders, HttpRequestCookies, HttpRequestFunction } from './HttpRequest.d.js';
export * from './HttpRequest.d.js';

import { BoardId, Board } from './Board.d.js';
export * from './Board.d.js';

import { ThreadId, Thread } from './Thread.d.js';
export * from './Thread.d.js';

import { CommentId, Comment } from './Comment.d.js';
export * from './Comment.d.js';

import { Messages } from './Messages.d.js';
export { Messages } from './Messages.d.js';

export * from 'social-components';

// When updating this list, also update it in `README.md`.
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

export interface ImageboardOptions extends ImageboardOptionsOverridable {
	commentUrl?: string;
	threadUrl?: string;
	messages?: Messages;
	useRelativeUrls?: boolean;
	expandReplies?: boolean;
	getPostLinkProperties?: (comment?: Comment) => object;
	getPostLinkText?: (postLink: object) => string | undefined;
	getSetCookieHeaders?: (parameters: { headers: HttpResponseHeaders }) => string[];
}

export interface ImageboardOptionsWithHttpRequestFunction extends ImageboardOptions {
	sendHttpRequest: HttpRequestFunction;
}

export interface GetBoardsParameters extends ImageboardOptionsOverridable {
}

export interface GetBoardsResult {
	boards: Board[];
}

export interface GetTopBoardsParameters extends GetBoardsParameters {
}

export interface GetTopBoardsResult extends GetBoardsResult {
}

export interface FindBoardsParameters extends ImageboardOptionsOverridable {
	search: string;
}

export interface FindBoardsResult extends GetBoardsResult {
}

export interface GetThreadsParameters extends ImageboardOptionsOverridable {
	boardId: BoardId;
	withLatestComments?: boolean;
	maxLatestCommentsPages?: number;
	latestCommentLengthLimit?: number;
	sortBy?: 'rating-desc';
}

export interface GetThreadsResult {
	threads: Thread[];
	board?: Board;
}

export interface FindThreadsParameters extends GetThreadsParameters {
	search: string;
}

export interface FindThreadsResult extends GetThreadsResult {
}

export interface GetThreadParameters extends ImageboardOptionsOverridable {
	boardId: BoardId;
	threadId: ThreadId;
	archived?: boolean;
	afterCommentId?: CommentId;
	afterCommentNumber?: number;
}

export interface GetThreadResult {
	thread: Thread;
	board?: Board;
}

export interface FindCommentsParameters {
	boardId: BoardId;
	threadId?: ThreadId;
	search: string;
}

export interface FindCommentsResult {
	comments: Comment[];
	thread?: Thread;
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

export type ReportCommentResult = void

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

export interface UpdateThreadParameters extends CreateThreadParameters {
	threadId: ThreadId;
}

export type UpdateThreadResult = void

export interface CreateCommentParameters extends CreateThreadParameters {
	threadId: ThreadId;
}

export interface CreateCommentResult {
	id: CommentId;
}

export interface UpdateCommentParameters extends CreateCommentParameters {
	commentId: CommentId;
}

export type UpdateCommentResult = void

export interface LogInParameters {
	token: string;

	// `4chan` uses "passwords" on login tokens.
	tokenPassword?: string;
}

export interface LogInResult {
	accessToken?: string;
}

export interface LogOutParameters {}

export type LogOutResult = void

export interface CreateBlockBypassParameters {
	captchaId: string;
	captchaSolution: string;
}

export interface CreateBlockBypassResult {
	token: string;
	expiresAt: Date;
}

// When changing this, also change `ImageboardConfigFeature` in `ImageboardConfig.d.ts`.
export type ImageboardFeature =
	'getBoards' |
	'getTopBoards' |
	'findBoards' |
	'getThreads.sortByRatingDesc' |
	'findThreads' |
	'findComments' |
	// If `findComments()` supports searching for comments across all threads of a given board.
	'findComments.boardId' |
	// If `findComments()` supports searching for comments in a given thread.
	'findComments.threadId' |
	'voteForComment' |
	'reportComment' |
	'createThread' |
	'updateThread' |
	'createComment' |
	'updateComment' |
	'createBlockBypass' |
	'getCaptcha' |
	'logIn' |
	'logIn.tokenPassword' |
	'logOut';

export interface Imageboard {
	// This method is not currently public.
	supportsFeature: (feature: ImageboardFeature) => boolean;
	getBoards: (parameters?: GetBoardsParameters) => Promise<GetBoardsResult>;
	getTopBoards: (parameters?: GetTopBoardsParameters) => Promise<GetTopBoardsResult>;
	findBoards: (parameters: FindBoardsParameters) => Promise<FindBoardsResult>;
	getThreads: (parameters: GetThreadsParameters) => Promise<GetThreadsResult>;
	findThreads: (parameters: FindThreadsParameters) => Promise<FindThreadsResult>;
	getThread: (parameters: GetThreadParameters) => Promise<GetThreadResult>;
	findComments: (parameters: FindCommentsParameters) => Promise<FindCommentsResult>;
	voteForComment: (parameters: VoteForCommentParameters) => Promise<VoteForCommentResult>;
	reportComment: (parameters: ReportCommentParameters) => Promise<ReportCommentResult>;
	createThread: (parameters: CreateThreadParameters) => Promise<CreateThreadResult>;
	updateThread: (parameters: UpdateThreadParameters) => Promise<UpdateThreadResult>;
	createComment: (parameters: CreateCommentParameters) => Promise<CreateCommentResult>;
	updateComment: (parameters: UpdateCommentParameters) => Promise<UpdateCommentResult>;
	logIn: (parameters: LogInParameters) => Promise<LogInResult>;
	logOut: (parameters?: LogOutParameters) => Promise<LogOutResult>;
	getCaptcha: (parameters: GetCaptchaParameters) => Promise<GetCaptchaResult>;
	createBlockBypass: (parameters: CreateBlockBypassParameters) => Promise<CreateBlockBypassResult>;
}

declare function Imageboard(imageboardIdOrConfig: ImageboardId | ImageboardConfig, options: ImageboardOptionsWithHttpRequestFunction): Imageboard;
export default Imageboard;

export function getConfig(imageboardId: ImageboardId): ImageboardConfig;

export function getCommentText(comment: Comment, options?: {
	messages?: Messages;
	skipPostQuoteBlocks?: boolean;
	skipGeneratedPostQuoteBlocks?: boolean;
}): string | undefined;

export function sortThreadsWithPinnedOnTop<T extends Pick<Thread, 'pinned' | 'pinnedOrder'>>(threads: T[]): T[];

export interface CreateHttpRequestFunctionParameters {
	fetch: Function,
	FormData: typeof FormData,
	setHeaders?: (parameters: {
		headers: HttpRequestHeaders
	}) => void;
	attachCookiesInWebBrowser?: (parameters: {
		cookies: HttpRequestCookies,
		headers: HttpRequestHeaders
	}) => void;
	getRequestUrl?: (parameters: {
		url: string
	}) => string;
	getResponseStatus?: (response: {
		status: number,
		headers: HttpResponseHeaders
	}) => number;
	getFinalUrlFromResponse?: (response: {
		url: string,
		headers: HttpResponseHeaders
	}) => string;
	redirect?: 'follow' | 'manual';
	mode?: 'cors';
	credentials?: 'include';
}

export function createHttpRequestFunction(parameters: CreateHttpRequestFunctionParameters): HttpRequestFunction;

export function supportsFeature(imageboardIdOrConfig: ImageboardId | ImageboardConfig, feature: ImageboardFeature): boolean;

export interface PostLinkMeta {
	boardId: BoardId;
	threadId: ThreadId;
	commentId: CommentId;
	isAnotherThread?: boolean;
	isDeleted?: boolean;
}