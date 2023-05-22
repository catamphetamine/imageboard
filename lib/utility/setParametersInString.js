export default function setParametersInString(string, parameters) {
	for (const key of Object.keys(parameters)) {
		string = string.replace('{' + key + '}', String(parameters[key]))
	}
	return string
}
