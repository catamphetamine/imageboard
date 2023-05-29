import isObject from './isObject.js'

export default function getParameterValues(parameterDefinitions, params) {
	const parameterValues = {}
	for (const parameterDefinition of parameterDefinitions) {
		if (!areWhenConditionsMet(parameterDefinition, params)) {
			continue
		}
		parameterValues[parameterDefinition.name] = getParameterValue(parameterDefinition, params)
	}
	return parameterValues
}

function getParameterValue(parameter, params) {
	validateParameterDefinition(parameter)
	let value = params[parameter.input && parameter.input.name || parameter.name]
	if (parameter.input) {
		if (parameter.input.index !== undefined) {
			if (Array.isArray(value)) {
				value = value[parameter.input.index]
			}
		}
	}
	if (value === undefined || value === null) {
		return parameter.defaultValue
	}
	if (parameter.input) {
		if (parameter.input.map) {
			value = mapValue(value, parameter)
		}
	}
	if (parameter.transform) {
		value = transformValue(value, parameter.transform)
	}
	return value
}

function mapValue(value, parameter) {
	for (const key of Object.keys(parameter.input.map)) {
		if (value === parseValueOfType(key, getTypeByValue(value))) {
			return parameter.input.map[key]
		}
	}
	if (parameter.input.map.hasOwnProperty('*')) {
		return parameter.input.map['*']
	}
	throw new Error(`[imageboard] the \`map\` for URL parameter "${parameter.name}" doesn\'t contain "${value}" or "*"`)
}

function parseValueOfType(value, type) {
	if (value === undefined || value === null) {
		return value
	}
	// Array type.
	if (type.includes('[]')) {
		if (!Array.isArray(value)) {
			throw new Error(`[imageboard] Expected an array as a value. Got: ${value}`)
		}
		return value.map(value => parseValueOfType(value, type.replace(/\[\]$/, '')))
	}
	// Primitive type.
	switch (type) {
		case 'boolean':
			switch (value) {
				case 'true':
					return true
				case 'false':
					return false
				default:
					throw new Error(`[imageboard] Unsupported stringified value for a boolean: "${value}"`)
			}
		case 'number':
			return Number(value)
		case 'object':
			return JSON.parse(value)
		default:
			throw new Error(`[imageboard] Unsupported value type: "${type}"`)
	}
}

function formatValueOfType(value, type) {
	if (value === undefined || value === null) {
		return String(value)
	}
	// Array type.
	if (type.includes('[]')) {
		if (!Array.isArray(value)) {
			throw new Error(`[imageboard] Expected an array as a value. Got: ${value}`)
		}
		return value.map(value => formatValueOfType(value, type.replace(/\[\]$/, '')))
	}
	// Primitive type.
	switch (type) {
		case 'object':
			return JSON.stringify(value)
		default:
			return String(value)
	}
}

function getTypeByValue(value) {
	if (Array.isArray(value)) {
		return getTypeByValue(value[0]) + '[]'
	}
	switch (typeof value) {
		case 'string':
			return 'string'
		case 'number':
			return 'number'
		case 'boolean':
			return 'boolean'
		default:
			if (isObject(value)) {
				return 'object'
			}
			if (value === undefined) {
				return 'undefined'
			}
			if (value === null) {
				return 'null'
			}
			// `value` could be of some other type, like a `Date` class instance.
			throw new Error(`[imageboard] Unknown type for value "${value}"`)
	}
}

function transformValue(value, transformName) {
	switch (transformName) {
		case 'zero-or-one':
			return value ? 1 : 0
		defaut:
			throw new Error(`[imageboard] Unknown \`transform\` for URL parameter "${parameter.name}": "${transformName}"`)
	}
}

function areWhenConditionsMet(parameterDefinition, params) {
	const parameterConditions = parameterDefinition.when
	if (parameterConditions) {
		for (const key of Object.keys(parameterConditions)) {
			// `oneOf`.
			if (Array.isArray(parameterConditions[key])) {
				return parameterConditions[key].some(
					oneOfValue => params[key] === parseValueOfType(oneOfValue, getTypeByValue(params[key]).replace('[]', ''))
				)
			}
			// `equalTo`.
			else {
				return params[key] === parseValueOfType(parameterConditions[key], getTypeByValue(params[key]))
			}
		}
	}
	return true
}

// function matches(actualValue, expectedValue) {
// 	return areEqualArraysOrPrimitives(actualValue, expectedValue)
// }

// // https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript/16430730
// function areEqualArraysOrPrimitives(a, b) {
//   // Are equal arrays.
//   if (Array.isArray(a) && Array.isArray(b)) {
//     return areEqualArrays(a, b)
//   }
//   // Are equal primitives.
//   return a === b
// }

// function areEqualArrays(a, b) {
// 	if (a.length !== b.length) {
//     return false
//   }
//   for (let i = 0; i < a.length; i++) {
//     if (!areEqualArraysOrPrimitives(a[i], b[i])) {
//       return false
//     }
//   }
//   return true
// }

// Proper validation would use `flexible-json-schema` package.
function validateParameterDefinition(parameter) {
	if (parameter.input) {
		if (!parameter.input.name) {
			throw new Error(`[imageboard] \`input.name\` is required for URL parameter "${parameter.name}"`)
		}
		if (parameter.index !== undefined) {
			if (typeof parameter.index !== 'number') {
				throw new Error(`[imageboard] \`input.index\` must be a non-negative integer for URL parameter "${parameter.name}"`)
			}
		}
	}
}