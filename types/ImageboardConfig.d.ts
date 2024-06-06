import { HttpRequestMethod } from './HttpRequest.d.js';

export interface ImageboardConfig {
	// Imageboard ID.
	id: string;

	// The default domain for the imageboard.
	domain: string;

	// On `4chan.org`, different sets of boards use different domains.
	// That was done to separate "SFW" and "NSFW" content for potential advertisement purposes.
	domainByBoard?: Record<string, string>;

	// The engine.
	engine: ImageboardEngine;

	// A list of supported features.
	features?: ImageboardConfigFeature[];

	// API endpoints specification.
	api?: ImageboardApi;
	// Allows overriding the `api` settings of the `engine`
	// with custom ones using "deep merge".
	apiOverride?: Record<string, any>;

	// An explicit list of boards if there's no "get boards" API.
	boards?: ImageboardConfigBoard[];

	// A template for a board URL.
	boardUrl?: string;
	// A template for a thread URL.
	threadUrl?: string;
	// A template for a comment URL.
	commentUrl?: string;

	// Attachment URL template.
	attachmentUrl?: string;
	// Attachment thumbnail URL pattern.
	attachmentThumbnailUrl?: string;
	// Non-picture and non-video attachment URL pattern.
	fileAttachmentUrl?: string;
	// (required by `8ch` engine (8kun.top)`)
	attachmentUrlFpath?: string;
	// (required by `8ch` engine (8kun.top)`)
	attachmentThumbnailUrlFpath?: string;
	// (required by `lynxchan` engine)
	thumbnailSize?: number;

	// A template to get a "badge" icon of a comment's author.
	authorBadgeUrl?: string;

	// A URL to send a POST request to in order to log out.
	authResetUrl?: string;

	// A URL to redirect the user to in case they're banned.
	bannedUrl?: string;

	// CAPTCHA rules.
	// For example, CAPTCHA might always be required for anonymous users.
	captchaRules?: CaptchaRule[];

	// A URL to display a CAPTCHA in an `<iframe/>`.
	captchaFrameUrl?: string;

	// `true` means that `captchaFrameUrl` has a `Content-Security-Policy` HTTP header
	// that prevents it from being embedded on 3rd-party websites.
	captchaFrameUrlHasContentSecurityPolicy?: boolean;

	// Default comment/thread author name. Example: "Anonymous".
	defaultAuthorName?: string | Record<string, string>;

	// The name of a cookie that stores the access token value after a login.
	accessTokenCookieName?: string;

	// The name of a cookie that stores the authentication status, in case the user is authenticated.
	authenticatedCookieName?: string;
	// The value of a cookie that stores the authentication status, in case the user is authenticated.
	authenticatedCookieValue?: string;

	// The minimum count of comments in a thread starting from which the thread supports
	// "get incremental update of the list of comments" API.
	incrementalThreadUpdateStartsAtCommentsCount?: number;

	// A list of "capcodes" available on the imageboard.
	capcodes?: Record<string, UserRoleDescription | UserRole>;

	// A list of custom "capcodes" that're available on the imageboard
	// in addition to the default ones that're supported by the engine.
	capcodesCustom?: Record<string, UserRoleDescription | UserRole>;

	// Possible report reasons.
	reportReasons?: {
		id: number | string,
		description: string,
		boards?: string[]
	}[];

	// Report reason ID for "Legal Violation".
	reportReasonIdForLegalViolation?: string;

	// Rules page URL.
	rulesUrl?: string;

	// A template for board rules page URL.
	boardRulesUrl?: string;
}

interface ImageboardApi {
	// "Get boards list" API URL.
	// `api.getBoards` is required if there's no `boards` parameter.
	getBoards?: ImageboardApi<GetBoardsFeatures>;

	// "Get boards list page" API URL.
	// Is used when the API to get the list of boards uses pagination.
	getBoardsPage?: ImageboardApi<GetBoardsPageFeatures>;

	// "Get top boards list" API URL.
	// Can be used when `getBoards` returns a list of boards that is too big, like it does on `8ch.net`.
	getTopBoards?: ImageboardApi<GetTopBoardsFeatures>;

	// "Find boards by a search query" API URL.
	findBoards?: ImageboardApi<FindBoardsFeatures>;

	// "Create new board" API.
	createBoard?: ImageboardApi<CreateBoardsFeatures>;

	// "Delete board" API.
	deleteBoard?: ImageboardApi<DeleteBoardsFeatures>;

	// "Get threads list" API URL template.
	getThreads: ImageboardApi<GetThreadsFeatures>;

	// "Get threads list including their latest comments" API URL template.
	getThreadsWithLatestComments?: ImageboardApi<GetThreadsWithLatestCommentsFeatures>;

	// "Get threads list (first page) including their latest comments" API URL template.
	getThreadsWithLatestCommentsFirstPage?: ImageboardApi<GetThreadsWithLatestCommentsFirstPageFeatures>;

	// "Get threads list (N-th page) including their latest comments" API URL template.
	getThreadsWithLatestCommentsPage?: ImageboardApi<GetThreadsWithLatestCommentsPageFeatures>;

	// "Find threads by a search query" API URL.
	findThreads?: ImageboardApi<FindThreadsFeatures>;

	// "Get threads stats" API URL template.
	// "Stats" might include the "ratings" of threads.
	getThreadsStats?: ImageboardApi<GetThreadsStatsFeatures>;

	// "Get thread" API URL template.
	getThread: ImageboardApi<GetThreadFeatures>;

	// "Get thread with comments after ..." API URL template.
	getThreadIncremental?: ImageboardApi<GetThreadIncrementalFeatures>;

	// "Get archived thread" API URL template.
	getArchivedThread?: ImageboardApi<GetArchivedThreadFeatures>;

	// Rate API.
	rate?: ImageboardApi<RateFeatures>;

	// Post API.
	// Creates a comment or a thread.
	post?: ImageboardApi<PostFeatures>;

	// "Update comment" API.
	updateComment?: ImageboardApi<UpdateCommentFeatures>;

	// "Find threads by a search query" API URL.
	findThreads?: ImageboardApi<FindThreadsFeatures>;

	// Log In API.
	logIn?: ImageboardApi<LogInFeatures>;

	// Log Out API.
	logOut?: ImageboardApi<LogOutFeatures>;

	// CAPTCHA API.
	getCaptcha?: ImageboardApi<GetCaptchaFeatures>;
	solveCaptcha?: ImageboardApi<SolveCaptchaFeatures>;

	// Report API.
	report?: ImageboardApi<ReportFeatures>;

	// Block bypass API.
	getBlockBypass?: ImageboardApi<GetBlockBypassFeatures>;
	createBlockBypass?: ImageboardApi<CreateBlockBypassFeatures>;
	validateBlockBypass?: ImageboardApi<ValidateBlockBypassFeatures>;

	// "Has this file been already uploaded in some past?" API.
	hasFileBeenUploaded?: ImageboardApi<HasFileBeenUploadedFeatures>;
}

interface ImageboardApi<Features> {
	// HTTP request method.
	method: HttpRequestMethod;

	// URL template with optional parameters as `{parameterName}` tokens.
	url: string;

	// Any `{parameterName}` parameters in the `url` template.
	urlParameters?: ImageboardApiParameter[];

	// Any parameters in the "body" of a POST HTTP request or in the "query" of a GET HTTP request.
	parameters?: ImageboardApiParameter[];

	// Any `{parameterName}` parameters in the cookies of the HTTP request.
	cookies?: ImageboardApiParameter[];

	// HTTP request content type.
	// Default is `application/json`.
	requestType?: 'application/json' | 'multipart/form-data';

	// HTTP response content type.
	// Default is `application/json`.
	responseType?: 'application/json' | 'text/html';

	// Any additional info on the features of this API.
	features?: Features;
}

interface ImageboardApiParameter {
	// Parameter name.
	// For example, for `/items/{id}` URL, the parameter `name` will be `"id"`.
	name: string;

	// The default value for the parameter.
	defaultValue?: string;

	// Optional conditions on including this parameter.
	when?: ImageboardApiParameterWhen;

	// Javascript function input property description.
	// `{parameterName}` token will be substituted with this property's value.
	input?: {
		// Input property name.
		name: string;

		// Input property array element index.
		// If specified, the value for the parameter will be `inputProperty[index]`.
		index?: number;

		// // Input property type.
		// type: 'string' | 'number' | 'boolean';

		// Input property trasnformation.
		transform?: 'zero-or-one' | 'one-or-absent' | 'to-array';

		// The mapping of the function parameter value into the URL parameter value.
		// Examples:
		// {
		//   "true": "like",
		//   "false": "dislike"
		// }
		// {
		//   "one": "1",
		//   "two": "2",
		//   "*": "-1"
		// }
		map?: Record<string, string>
	}
}

type ImageboardApiParameterInputCondition =
	ImageboardApiParameterInputConditionEqualTo |
	ImageboardApiParameterInputConditionOneOf;

type ImageboardApiParameterInputConditionEqualTo = string;
type ImageboardApiParameterInputConditionOneOf = string[];

interface ImageboardApiParameterWhen {
	// Any conditions on the input parameters.
	input: Record<string, ImageboardApiParameterInputCondition>;
}

interface GetBoardsFeatures {}

interface GetBoardsPageFeatures {}

interface GetTopBoardsFeatures {}

interface FindBoardsFeatures {}

interface CreateBoardsFeatures {}

interface DeleteBoardsFeatures {}

interface GetThreadsFeatures {
	withLatestComments?: boolean;
}

interface GetThreadsWithLatestCommentsFeatures {}

interface GetThreadsWithLatestCommentsFirstPageFeatures {}

interface GetThreadsWithLatestCommentsPageFeatures {}

interface FindThreadsFeatures {}

interface GetThreadsStatsFeatures {
	rating?: boolean;
	views?: boolean;
}

interface GetThreadFeatures {}

interface GetThreadIncrementalFeatures {}

interface GetArchivedThreadFeatures {}

interface RateFeatures {}

interface PostFeatures {}

interface UpdateCommentFeatures {}

interface LogInFeatures {}

interface LogOutFeatures {}

interface GetCaptchaFeatures {}
interface SolveCaptchaFeatures {}

interface ReportFeatures {}

interface GetBlockBypassFeatures {}
interface CreateBlockBypassFeatures {}
interface ValidateBlockBypassFeatures {}

interface HasFileBeenUploadedFeatures {}

export type ImageboardEngine =
	'4chan' |
	'vichan' |
	'lainchan' |
	'infinity' |
	'OpenIB' |
	'makaba' |
	'lynxchan' |
	'jschan';

// When changing this, also change `ImageboardFeature` in `index.d.ts`.
type ImageboardConfigFeature =
	'getThreads.sortByRatingDesc';

export type UserRole = 'moderator' | 'administrator';
export type UserRoleScope = 'board';

export type CaptchaRule =
	'anonymous:create-comment:required' |
	'anonymous:create-thread:required' |
	'anonymous:report-comment:required';

export interface UserRoleDescription {
	role: UserRole;
	scope?: UserRoleScope;
}

interface ImageboardConfigBoard {
	id: string;
	title: string;
	category?: string;
}
