export type HttpRequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpRequestHeaders = Record<string, string>;
export type HttpRequestCookies = Record<string, string>;

export interface HttpResponseError extends Error {
	url: string;
	status: number;
	headers: HttpResponseHeaders;
	responseText?: string;
}

export interface HttpResponseHeaders {
	get: (name: string) => string | null;
	getSetCookie: () => string[];
}

export interface HttpRequestParameters {
	method: HttpRequestMethod,
	url: string,
	query?: Record<string, string>;
	body?: Record<string, any>;
	headers?: HttpRequestHeaders;
	cookies?: HttpRequestCookies;
}

export interface HttpRequestResult {
	url: string;
	responseText?: string;
	headers?: HttpResponseHeaders;
}

export type HttpRequestFunction = (parameters: HttpRequestParameters) => Promise<HttpRequestResult>;
