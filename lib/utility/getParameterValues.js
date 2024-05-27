import isObject from './isObject.js'

// Given a list of "parameter definition" specifications and a `params` object,
// it transforms each `params` property value in a way that is described by its specification.
// Returns a JSON object with parameter keys and their transformed values.
export default function getParameterValues(parameterDefinitions, params) {
	// These will be the parameters' values.
	const parameterValues = {}

	// For each parameter.
	for (const parameterDefinition of parameterDefinitions) {
		// If the parameter specification includes a `supported: false` flag
		// then skip that parameter.
		if (parameterDefinition.supported === false) {
			continue
		}

		// If the parameter specification includes a `when` condition
		// then only include that parameter in the output when that condition is met.
		if (parameterDefinition.when) {
			if (!areWhenConditionsMet(parameterDefinition.when, params)) {
				continue
			}
		}

		// Get the parameter value.
		const parameterValue = getParameterValue(parameterDefinition, params)
		if (parameterValue !== undefined && parameterValue !== null) {
			parameterValues[parameterDefinition.name] = parameterValue
		}
	}

	// Return the values of the parameters.
	return parameterValues
}

// Given a "parameter specification" and a `params` object,
// it transforms the value for the parameter specified by the specification
// according to that specification and returns the resulting parameter value.
function getParameterValue(parameter, params) {
	// Validate the specification.
	validateParameterDefinition(parameter)

	// Get the value from the `params` object that acts as a "source" for the parameter value.
	// * If the `input` property is defined in the parameter specification, it uses that.
	// * Otherwise, it uses `params[parameter.name]` to get the value.
	let value = params[parameter.input && parameter.input.name || parameter.name]

	// The `input` property defines the path to use inside the `params` object
	// in order to get the parameter's value.
	if (parameter.input) {
		if (parameter.input.index !== undefined) {
			if (Array.isArray(value)) {
				value = value[parameter.input.index]
			}
		}
	}

	// When the parameter's value is not found in the `params` object,
	// return the "default" value as per the specification.
	if (value === undefined || value === null) {
		return getDefaultValue(parameter, params)
	}

	// If the value from the `params` object should be somehow "mapped"
	// instead of being passed through as is, then perform such "mapping".
	if (parameter.input) {
		if (parameter.input.map) {
			value = mapValue(value, parameter)
		}
	}

	// If the value from the `params` object should be somehow "transformed"
	// instead of being passed through as is, then perform such "transform".
	if (parameter.transform) {
		value = transformValue(value, parameter.transform)
	}

	// Return the resulting parameter value.
	return value
}

// Maps `value` according to the "parameter specification".
function mapValue(value, parameter) {
	// `value` shouldn't be `undefined` or `null`
	// in order to be used in `parseValueOfType(key, getTypeByValue(value))`.
	if (value === undefined || value === null) {
		return value
	}
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

// Parses `value` according to the `type` defined in the "parameter specification".
function parseValueOfType(value, type) {
	// `undefined` or `null` are passed through as is.
	if (value === undefined || value === null) {
		return value
	}

	// If the `type` includes a "[]" postfix then it's meant to be an array.
	if (type.includes('[]')) {
		if (!Array.isArray(value)) {
			throw new Error(`[imageboard] Expected an array as a value. Got: ${value}`)
		}
		return value.map(value => parseValueOfType(value, type.replace(/\[\]$/, '')))
	}

	// Parse "primitive" type value.
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
		case 'string':
			return value
		default:
			throw new Error(`[imageboard] Unsupported value type: "${type}"`)
	}
}

// Formats `value` according to the `type` defined in the "parameter specification".
function formatValueOfType(value, type) {
	// `undefined` or `null` are passed through as is.
	if (value === undefined || value === null) {
		return String(value)
	}

	// If the `type` includes a "[]" postfix then it's meant to be an array.
	if (type.includes('[]')) {
		if (!Array.isArray(value)) {
			throw new Error(`[imageboard] Expected an array as a value. Got: ${value}`)
		}
		return value.map(value => formatValueOfType(value, type.replace(/\[\]$/, '')))
	}

	// Format "primitive" type value.
	switch (type) {
		case 'object':
			return JSON.stringify(value)
		default:
			return String(value)
	}
}

// Attempts to deduce the `type` from a `value`.
function getTypeByValue(value) {
	// Array `type` should end with a "[]" postfix.
	if (Array.isArray(value)) {
		return getTypeByValue(value[0]) + '[]'
	}

	// Attempts to determine a `type` of a "primitive" value.
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

// Applies a pre-defined "transform" to the `value`.
function transformValue(value, transformName) {
	switch (transformName) {
		case 'zero-or-one':
			return value ? 1 : 0
		case 'one-or-absent':
			return value ? 1 : undefined
		case 'to-array':
			return [value]
		defaut:
			throw new Error(`[imageboard] Unknown \`transform\` for URL parameter "${parameter.name}": "${transformName}"`)
	}
}

// Tests if the conditions specified in the `when` object are met by the `params`.
function areWhenConditionsMet(when, params) {
	if (!isObject(when.input)) {
		throw new Error(`[imageboard] \`when\` must contain an \`input\` object`)
	}
	for (const key of Object.keys(when.input)) {
		// Conditions object.
		if (isObject(when.input[key])) {
			const conditions = when.input[key]
			for (const conditionType of Object.keys(conditions)) {
				switch (conditionType) {
					case '$exists':
						const parameterExists = !(params[key] === undefined || params[key] === null)
						if (conditions.$exists) {
							if (!parameterExists) {
								return false
							}
						} else {
							if (parameterExists) {
								return false
							}
						}
						return
					default:
						throw Error(`Unknown when condition type: ${conditionType}`)
				}
			}
			return true
		}
		// `oneOf`.
		else if (Array.isArray(when.input[key])) {
			if (params[key] === undefined) {
				// JSON doesn't support `undefined` keyword.
				// return when.input[key].some(_ => _ === undefined)
				return false
			}
			if (params[key] === null) {
				return when.input[key].some(_ => _ === null)
			}
			return when.input[key].some(
				oneOfValue => params[key] === parseValueOfType(oneOfValue, getTypeByValue(params[key]).replace('[]', ''))
			)
		}
		// `equalTo`.
		else {
			if (params[key] === undefined) {
				// JSON doesn't support `undefined` keyword.
				// return when.input[key] === undefined
				return false
			}
			if (params[key] === null) {
				return when.input[key] === null
			}
			return params[key] === parseValueOfType(when.input[key], getTypeByValue(params[key]))
		}
	}
}

// Returns a default value for the parameter as per its "specification".
function getDefaultValue(parameter, params) {
	if (parameter.defaultValues) {
		for (const defaultValue of parameter.defaultValues) {
			const { when, value } = defaultValue
			if (!isObject(when)) {
				throw new Error('`defaultValues` items must have a `when` object')
			}
			if (value === undefined || value === null) {
				throw new Error('`defaultValues` items must have a `value` property which is not `undefined` or `null`. If the value should be omitted in some case, simply don\'t include that case in the list of `defaultValues`.')
			}
			if (areWhenConditionsMet(when, params)) {
				return value
			}
		}
	}
	return parameter.defaultValue
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

// Validates parameter "specification".
// A more advanced validation would use `flexible-json-schema` package.
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