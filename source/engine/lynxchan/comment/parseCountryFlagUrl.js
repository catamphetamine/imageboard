export default function parseCountryFlagUrl(url) {
	const flagId = parseKohlchanFlagId(url)
	if (FLAG_ID_COUNTRY_CODE_REGEXP.test(flagId)) {
		return flagId.toUpperCase()
	}
}

// "/.static/flags/onion.png" ->  "onion".
// "/.static/flags/vsa/ca.png" -> "vsa/ca". (California)
const FLAG_ID_REGEXP = /^\/\.static\/flags\/(.+)\.png$/
function parseKohlchanFlagId(url) {
	const match = url.match(FLAG_ID_REGEXP)
	if (match) {
		return match[1]
	}
}

// "br".
const FLAG_ID_COUNTRY_CODE_REGEXP = /^([a-z]{2})$/