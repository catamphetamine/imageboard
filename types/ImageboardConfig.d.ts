import { HttpRequestMethod } from './HttpRequestMethod.d.js';

type ImageboardEngine =
	'4chan' |
	'vichan' |
	'lainchan' |
	'infinity' |
	'OpenIB' |
	'makaba' |
	'lynxchan' |
	'jschan';

type ImageboardConfigFeature =
	'Threads.rating' |
	'ThreadsStats.rating';

interface ImageboardConfigBoard {
	id: string;
	title: string;
	category?: string;
}

type ImageboardConfigApiMethodParameterInputConditionEqualTo = string;
type ImageboardConfigApiMethodParameterInputConditionOneOf = string[];

type ImageboardConfigApiMethodParameterInputCondition =
	ImageboardConfigApiMethodParameterInputConditionEqualTo |
	ImageboardConfigApiMethodParameterInputConditionOneOf;

interface ImageboardConfigApiMethodParameterWhen {
	// Any conditions on the input parameters.
	input: Record<string, ImageboardConfigApiMethodParameterInputCondition>;
}

interface ImageboardConfigApiMethodParameter {
	// Parameter name.
	// For example, for `/items/{id}` URL, the parameter `name` will be `"id"`.
	name: string;

	// The default value for the parameter.
	defaultValue?: string;

	// Optional conditions on including this parameter.
	when?: ImageboardConfigApiMethodParameterWhen;

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

interface ImageboardConfigApiMethod<Features> {
	// HTTP request method.
	method: HttpRequestMethod;

	// URL template with optional parameters as `{parameterName}` tokens.
	url: string;

	// Any `{parameterName}` parameters in the `url` template.
	urlParameters?: ImageboardConfigApiMethodParameter[];

	// Any parameters in the "body" of a POST HTTP request or in the "query" of a GET HTTP request.
	parameters?: ImageboardConfigApiMethodParameter[];

	// Any `{parameterName}` parameters in the cookies of the HTTP request.
	cookies?: ImageboardConfigApiMethodParameter[];

	// HTTP request content type.
	// Default is `application/json`.
	requestType?: 'application/json' | 'multipart/form-data';

	// HTTP response content type.
	// Default is `application/json`.
	responseType?: 'application/json' | 'text/html';

	// Any additional info on the features of this API.
	features?: Features;
}

interface ImageboardConfigApi {
	// "Get boards list" API URL.
	// `api.getBoards` is required if there's no `boards` parameter.
	getBoards?: ImageboardConfigApiMethod<GetBoardsFeatures>;

	// "Get boards list page" API URL.
	// Is used when the API to get the list of boards uses pagination.
	getBoardsPage?: ImageboardConfigApiMethod<GetBoardsPageFeatures>;

	// "Get top boards list" API URL.
	// Can be used when `getBoards` returns a list of boards that is too big, like it does on `8ch.net`.
	getTopBoards?: ImageboardConfigApiMethod<GetTopBoardsFeatures>;

	// "Find boards by a query" API URL.
	findBoards?: ImageboardConfigApiMethod<FindBoardsFeatures>;

	// "Create new board" API.
	createBoard?: ImageboardConfigApiMethod<CreateBoardsFeatures>;

	// "Delete board" API.
	deleteBoard?: ImageboardConfigApiMethod<DeleteBoardsFeatures>;

	// "Get threads list" API URL template.
	getThreads: ImageboardConfigApiMethod<GetThreadsFeatures>;

	// "Get threads list including their latest comments" API URL template.
	getThreadsWithLatestComments?: ImageboardConfigApiMethod<GetThreadsWithLatestCommentsFeatures>;

	// "Get threads list (first page) including their latest comments" API URL template.
	getThreadsWithLatestCommentsFirstPage?: ImageboardConfigApiMethod<GetThreadsWithLatestCommentsFirstPageFeatures>;

	// "Get threads list (N-th page) including their latest comments" API URL template.
	getThreadsWithLatestCommentsPage?: ImageboardConfigApiMethod<GetThreadsWithLatestCommentsPageFeatures>;

	// "Get threads stats" API URL template.
	// "Stats" might include the "ratings" of threads.
	getThreadsStats?: ImageboardConfigApiMethod<GetThreadsStatsFeatures>;

	// "Get thread" API URL template.
	getThread: ImageboardConfigApiMethod<GetThreadFeatures>;

	// "Get thread with comments after ..." API URL template.
	getThreadIncremental?: ImageboardConfigApiMethod<GetThreadIncrementalFeatures>;

	// "Get archived thread" API URL template.
	getArchivedThread?: ImageboardConfigApiMethod<GetArchivedThreadFeatures>;

	// Vote API.
	vote?: ImageboardConfigApiMethod<VoteFeatures>;

	// Post API.
	post?: ImageboardConfigApiMethod<PostFeatures>;

	// "Update comment" API.
	updateComment?: ImageboardConfigApiMethod<UpdateCommentFeatures>;

	// Log In API.
	logIn?: ImageboardConfigApiMethod<LogInFeatures>;

	// Log Out API.
	logOut?: ImageboardConfigApiMethod<LogOutFeatures>;

	// CAPTCHA API.
	getCaptcha?: ImageboardConfigApiMethod<GetCaptchaFeatures>;
	solveCaptcha?: ImageboardConfigApiMethod<SolveCaptchaFeatures>;

	// Report API.
	report?: ImageboardConfigApiMethod<ReportFeatures>;

	// Block bypass API.
	getBlockBypass?: ImageboardConfigApiMethod<GetBlockBypassFeatures>;
	createBlockBypass?: ImageboardConfigApiMethod<CreateBlockBypassFeatures>;
	validateBlockBypass?: ImageboardConfigApiMethod<ValidateBlockBypassFeatures>;

	// "Has this file been already uploaded in some past?" API.
	hasFileBeenUploaded?: ImageboardConfigApiMethod<HasFileBeenUploadedFeatures>;
}

interface GetBoardsFeatures {}

interface GetBoardsPageFeatures {}

interface GetTopBoardsFeatures {}

interface FindBoardsFeatures {}

interface CreateBoardsFeatures {}

interface DeleteBoardsFeatures {}

interface GetThreadsFeatures {}

interface GetThreadsWithLatestCommentsFeatures {}

interface GetThreadsWithLatestCommentsFirstPageFeatures {}

interface GetThreadsWithLatestCommentsPageFeatures {}

interface GetThreadsStatsFeatures {
	rating?: boolean;
	views?: boolean;
}

interface GetThreadFeatures {}

interface GetThreadIncrementalFeatures {}

interface GetArchivedThreadFeatures {}

interface VoteFeatures {}

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

	// An explicit list of boards if there's no "get boards" API.
	boards?: ImageboardConfigBoard[];

	// API endpoints specification.
	api?: ImageboardConfigApi;
	apiOverride?: Record<string, any>;

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