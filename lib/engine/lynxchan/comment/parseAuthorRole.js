export default function parseAuthorRole(post, { capcode }) {
	return getRoleByCapCode(post.signedRole, capcode)
}

function getRoleByCapCode(capCode, capcodeRoles) {
	if (capCode) {
		if (capcodeRoles && capcodeRoles[capCode]) {
			return capcodeRoles[capCode]
		}
		if (CAPCODE_ROLES[capCode]) {
			return CAPCODE_ROLES[capCode]
		}
		if (typeof window === 'undefined') {
			console.warn(`Unknown "capcode": ${capCode}`)
		} else {
			// Report the error to `sentry.io`.
			setTimeout(() => { throw new Error(`Unknown "capcode": ${capCode}`) }, 0)
		}
	}
}

// It's not clear what is the exact list of all possible `lynxchan` user roles.
// The following is a list of roles guessed from:
// `miscBoardOwner`, `miscBoardVolunteer`, `miscRoles`.
// https://gitgud.io/LynxChan/LynxChan/blob/master/src/be/data/defaultLanguagePack.json
const CAPCODE_ROLES = {
  "Root": {
  	"role": "administrator"
  },
  "Admin": {
  	"role": "administrator"
  },
  "Board owner": {
  	"role": "administrator",
  	"scope": "board"
  },
  "Board volunteer": {
  	"role": "moderator",
  	"scope": "board"
  },
  "Global volunteer": {
  	"role": "moderator"
  },
  "Global janitor": {
  	"role": "moderator"
  }
}