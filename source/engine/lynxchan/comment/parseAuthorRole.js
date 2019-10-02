export default function parseAuthorRole(post, { capcode }) {
	return getRoleByCapCode(post.signedRole, capcode)
}

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