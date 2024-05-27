import throwErrorForErrorResponse from '../throwErrorForErrorResponse.js'

/**
 * Parses "get boards list page" API response.
 * @param  {any} response
 * @param  {object} [options]
 * @return {object} An object of shape `{ boards: Board[], pageCount }`.
 */
export default function parseBoardsPage(response, { status }) {
	// `ptchan.org` uses a CloudFlare-alike anti-DDoS protection system
	// that returns `403 Forbidden` for the "demo" CORS proxy.
	// The reponse body in that case looks like:
	// `{"ch":"6cb6d340605564b7bfea1bb5b6a1c6f3#3ee04e9e6889d079e9df60453fe398b2ac052b1543c7ca78e4cbc963f32ff546#1700872498#3764c352d97f0a2688c7fe34e5b360ae721ba8372bad4776e4ccf50042a21fb8","ca":false,"pow":"argon2#3#1#512"}`.
	// Supposedly, that's some kind of a "CAPTCHA challenge".
	// It's not clear how to display such a challenge to the user.
	// https://gitgud.io/fatchan/haproxy-protection/-/issues/24
	throwErrorForErrorResponse(response, { status })

	const boards = response.boards.filter(_ => !_.webring).map((board) => ({
		// * `webring: true` boards seem to only have an `_id` which seems to be a `uri`.
		// * `webring: false` boards seem to have both an `_id` and a `uri`,
		//    where `_id` is a hexademical string like "6647569882f686c3be2e3cd1".
		id: board.uri || board._id,
		commentsPerHour: board.pph,
		commentsPerDay: board.ppd,
		uniquePostersPerDay: board.ips,
		notSafeForWork: board.settings.sfw === false,
		title: board.settings.name,
		description: board.settings.description,
		threadTags: board.tags,
		features: {
			threadTags: Boolean(board.tags) && board.tags.length > 0
		}
	}))

	return {
		pageCount: response.maxPage,
		boards
	}
}