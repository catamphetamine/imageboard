import { HttpRequestMethod } from './HttpRequestMethod.d.js';

type ImageboardEngine = '4chan' | 'vichan' | 'OpenIB' | 'lynxchan' | 'makaba';

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
    transform?: 'zero-or-one';

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
	getBoards?: string;

  // "Get boards list page" API URL.
  // Is used when the API to get the list of boards uses pagination.
  getBoardsPage?: string;

  // "Get all boards list" API URL.
  // Can be used when `getBoards` doesn't return the full list of boards, like it does on `8ch`.
  getAllBoards?: string;

	// "Find boards by a query" API URL.
	findBoards?: string;

	// "Get threads list" API URL template.
	getThreads: string;

	// "Get threads list including their latest comments" API URL template.
	getThreadsWithLatestComments?: string;

	// "Get threads list (first page) including their latest comments" API URL template.
	getThreadsWithLatestCommentsFirstPage?: string;

	// "Get threads list (N-th page) including their latest comments" API URL template.
	getThreadsWithLatestCommentsPage?: string;

	// "Get threads stats" API URL template.
  // "Stats" might include the "ratings" of threads.
	getThreadsStats?: string;

  // "Get thread" API URL template.
  getThread: string;

  // "Get thread with comments after ..." API URL template.
  getThreadIncremental?: string;

	// "Get archived thread" API URL template.
	getArchivedThread?: string;

  // Vote API.
  vote?: ImageboardConfigApiMethod;
}

export interface ImageboardConfig {
	id: string;
	domain: string;
	engine: ImageboardEngine;
	boards?: ImageboardConfigBoard[];
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
  defaultAuthorName?: string | Record<string, string>;
  // (required by `lynxchan` engine)
  thumbnailSize?: number;
}
