import BaseError from './baseError'

export default class ParameterError extends BaseError {
  constructor (expected, actual, missing) {
    super(
      'Missing required parameters',
      `Missing required parameters: ${JSON.stringify(missing, null, 2)}`
    )
    this.expected = expected
    this.actual = actual
    this.missing = missing
  }
}

export function apply (rules, values) {
  const { whitelist = true, parameters, aliases = {} } = rules
  const mapped = {}
  const requiredKeys = Object.keys(parameters)
    .filter(key => parameters[key].required)
    .map(key => parameters[key].toName || key)
  for (const key of Object.keys(values)) {
    const value = values[key]
    const parameterKey = aliases[key] || key
    const parameter = parameters[parameterKey]
    if (parameter && value) {
      mapped[parameter.toName || parameterKey] = value
    } else if (value && !whitelist) {
      mapped[key] = value
    }
  }
  const missing = requiredKeys.filter(key => !mapped[key])
  if (missing.length > 0) {
    throw new ParameterError(requiredKeys, values, missing)
  }
  return mapped
}

export function allowedLanguageFilter (lang) {
  const allowedLanguage = [
    'en',
    'zh-hk'
  ]
  if (allowedLanguage.includes(lang)) {
    return lang
  }
  // Providing `undefined` value fallback to widget default language already.
  if (lang !== undefined) {
    console.warn('language is not yet supported. Fallback to widget default language.')
  }
  return undefined
}
