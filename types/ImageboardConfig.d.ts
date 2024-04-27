import { HttpRequestMethod } from './HttpRequestMethod.d.js';

type ImageboardEngine =
	'4chan' |
	'vichan' |
	'OpenIB' |
	'lynxchan' |
	'makaba' |
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

interface ImageboardConfigApiMethod {
	// HTTP request method.
	method: HttpRequestMethod,

	// URL template with optional parameters as `{parameterName}` tokens.
	url: string,

	// Any `{parameterName}` parameters in the `url` template.
	urlParameters?: ImageboardConfigApiMethodParameter[],

	// Any parameters in the "body" of a POST HTTP request or in the "query" of a GET HTTP request.
	parameters?: ImageboardConfigApiMethodParameter[]
}

interface ImageboardConfigApi {
	// "Get boards list" API URL.
	// `api.getBoards` is required if there's no `boards` parameter.
	getBoards?: ImageboardConfigApiMethod;

	// "Get boards list page" API URL.
	// Is used when the API to get the list of boards uses pagination.
	getBoardsPage?: ImageboardConfigApiMethod;

	// "Get all boards list" API URL.
	// Can be used when `getBoards` doesn't return the full list of boards, like it does on `8ch`.
	getAllBoards?: ImageboardConfigApiMethod;

	// "Find boards by a query" API URL.
	findBoards?: ImageboardConfigApiMethod;

	// "Create new board" API.
	createBoard?: ImageboardConfigApiMethod;

	// "Delete board" API.
	deleteBoard?: ImageboardConfigApiMethod;

	// "Get threads list" API URL template.
	getThreads: ImageboardConfigApiMethod;

	// "Get threads list including their latest comments" API URL template.
	getThreadsWithLatestComments?: ImageboardConfigApiMethod;

	// "Get threads list (first page) including their latest comments" API URL template.
	getThreadsWithLatestCommentsFirstPage?: ImageboardConfigApiMethod;

	// "Get threads list (N-th page) including their latest comments" API URL template.
	getThreadsWithLatestCommentsPage?: ImageboardConfigApiMethod;

	// "Get threads stats" API URL template.
	// "Stats" might include the "ratings" of threads.
	getThreadsStats?: ImageboardConfigApiMethod;

	// "Get thread" API URL template.
	getThread: ImageboardConfigApiMethod;

	// "Get thread with comments after ..." API URL template.
	getThreadIncremental?: ImageboardConfigApiMethod;

	// "Get archived thread" API URL template.
	getArchivedThread?: ImageboardConfigApiMethod;

	// Vote API.
	vote?: ImageboardConfigApiMethod;

	// Post API.
	post?: ImageboardConfigApiMethod;

	// "Update comment" API.
	updateComment?: ImageboardConfigApiMethod;

	// Log In API.
	logIn?: ImageboardConfigApiMethod;

	// Log Out API.
	logOut?: ImageboardConfigApiMethod;

	// CAPTCHA API.
	getCaptcha?: ImageboardConfigApiMethod;
	solveCaptcha?: ImageboardConfigApiMethod;

	// Report API.
	report?: ImageboardConfigApiMethod;

	// Block bypass API.
	getBlockBypass?: ImageboardConfigApiMethod;
	createBlockBypass?: ImageboardConfigApiMethod;
	validateBlockBypass?: ImageboardConfigApiMethod;

	// "Has this file been already uploaded in some past?" API.
	hasFileBeenUploaded?: ImageboardConfigApiMethod;
}

export interface ImageboardConfig {
	id: string;
	domain: string;
	domainByBoard?: Record<string, string>;
	engine: ImageboardEngine;
	boards?: ImageboardConfigBoard[];
	features?: ImageboardConfigFeature[];
	api: ImageboardConfigApi;

	// A template for a board URL.
	boardUrl: string;
	// A template for a thread URL.
	threadUrl: string;
	// A template for a comment URL.
	commentUrl: string;

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

	// A URL to display a CAPTCHA in an `<iframe/>`.
	captchaFrameUrl?: string;

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

	// Possible report reasons.
	reportReasons?: { id: string, description: string }[];
	// Report reason for "Legal Violation".
	reportReasonLegalViolation: { id: string, description: string };
}
