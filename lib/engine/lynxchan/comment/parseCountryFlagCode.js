// Example: "-br".
const FLAG_CODE_COUNTRY_CODE_REGEXP = /^-([a-z]{2})$/

export default function parseCountryFlagCode(flagCode) {
	const match = flagCode.match(FLAG_CODE_COUNTRY_CODE_REGEXP)
	if (match) {
		return match[1]
	}
}