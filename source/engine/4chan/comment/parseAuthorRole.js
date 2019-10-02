export default function parseAuthorRole(post, { chan, boardId, capcode }) {
	return getRoleByCapCode(
		getCapCode(post.capcode, { chan, boardId }),
		capcode
	)
}

function getCapCode(capCode, { chan, boardId }) {
	if (chan === '8ch') {
		// Everyone on `/newsplus` seems to have the "Reporter" capcode.
		// It's not clear what it means. Maybe they're all moderators
		// and regular users can't post there.
		if (boardId === 'newsplus' && capCode === 'Reporter') {
			return 'Board Moderator'
		}
	}
	return capCode
}

// https://www.4chan.org/faq#capcode
// A `capcode` is a way of verifying someone as a `4chan` team member.
// Normal users do not have the ability to post using a `capcode`.
// "Janitors" do not receive a capcode on `4chan.org`.
function getRoleByCapCode(capCode, capcodeRoles) {
	if (capCode) {
		if (capcodeRoles && capcodeRoles[capCode]) {
			return capcodeRoles[capCode]
		}
		if (typeof window === 'undefined') {
			console.warn(`Unknown "capcode": ${capCode}`)
		} else {
			// Report the error to `sentry.io`.
			setTimeout(() => { throw new Error(`Unknown "capcode": ${capCode}`) }, 0)
		}
	}
}