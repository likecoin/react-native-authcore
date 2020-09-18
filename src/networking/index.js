import url from 'url'
import color from 'color'

function _buildColourCode (colour) {
  if (typeof colour === 'string') {
    try {
      return `#${color(colour).hex().slice(1)}`
    } catch (err) {
      throw new Error('colour parameters have to be correct format')
    }
  }
  return undefined
}

export default class Client {
  constructor (options) {
    const {
      baseUrl,
      initialScreen = 'signin',
      clientId,
      token,
      company,
      logo,
      socialLoginPaneStyle = 'bottom',
      socialLoginPaneOption = 'grid',
      buttonSize = 'large',
      language = 'en'
    } = options
    const {
      primaryColour,
      dangerColour,
      successColour
    } = options
    if (!baseUrl) {
      throw new Error('Missing Authcore domain')
    }
    const parsed = url.parse(baseUrl)
    this.baseUrl =
      parsed.protocol === 'https:' || parsed.protocol === 'http:'
        ? baseUrl
        : `https://${baseUrl}`
    this.domain = parsed.hostname || baseUrl
    this.clientId = clientId
    this.company = company
    this.logo = logo
    const allowedInitialScreen = [
      'signin',
      'register'
    ]
    const allowedSocialLoginPaneOption = [
      'list',
      'grid'
    ]
    const allowedSocialLoginPaneStyle = [
      'top',
      'bottom'
    ]
    const allowedButtonSize = [
      'normal',
      'large'
    ]
    const allowedLanguage = [
      'en',
      'zh-hk'
    ]
    if (allowedInitialScreen.includes(initialScreen)) {
      this.initialScreen = initialScreen
    } else {
      throw new Error('initialScreen only support signin or register as input')
    }
    if (allowedSocialLoginPaneOption.includes(socialLoginPaneOption)) {
      this.socialLoginPaneOption = socialLoginPaneOption
    } else {
      throw new Error('socialLoginPaneOption only support list or grid as input')
    }
    if (allowedSocialLoginPaneStyle.includes(socialLoginPaneStyle)) {
      this.socialLoginPaneStyle = socialLoginPaneStyle
    } else {
      throw new Error('socialLoginPaneStyle only support top or bottom as input')
    }
    if (allowedButtonSize.includes(buttonSize)) {
      this.buttonSize = buttonSize
    } else {
      throw new Error('buttonSize only support normal or large as input')
    }
    if (allowedLanguage.includes(language)) {
      this.language = language
    } else {
      console.warn('language is not yet supported. Fallback to English.')
    }
    if (token) {
      this.bearer = `Bearer ${token}`
    }
    this.primaryColour = _buildColourCode(primaryColour)
    this.successColour = _buildColourCode(successColour)
    this.dangerColour = _buildColourCode(dangerColour)
    this.defaultScreenOptions = {
      company: this.company,
      logo: this.logo,
      primaryColour: this.primaryColour,
      successColour: this.successColour,
      dangerColour: this.dangerColour,
      language: this.language
    }
  }

  get (path, query) {
    return this.request('GET', this.url(path, query))
  }

  post (path, body) {
    return this.request('POST', this.url(path), body)
  }

  delete (path, body) {
    return this.request('DELETE', this.url(path), body)
  }

  url (path, q, { screen = false } = {}) {
    let endpoint = url.resolve(this.baseUrl, path)
    let query = q
    if (screen) query = { ...this.defaultScreenOptions, ...(q || {}) }
    if ((query && query.length !== 0)) {
      const parsed = url.parse(endpoint)
      // Remove undefined key-value pair
      const keysArr = Object.keys(query)
      for (let i = 0; i < keysArr.length; i++) {
        if (query[keysArr[i]] === undefined) {
          delete query[keysArr[i]]
        }
      }
      parsed.query = query || {}
      endpoint = url.format(parsed)
    }
    return endpoint
  }

  request (method, url, body) {
    const options = {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
    if (this.bearer) {
      options.headers.Authorization = this.bearer
    }
    if (body) {
      options.body = JSON.stringify(body)
    }
    return fetch(url, options).then(response => { //eslint-disable-line
      const payload = {
        status: response.status,
        ok: response.ok,
        headers: response.headers
      }
      return response
        .json()
        .then(json => {
          return { ...payload, json }
        })
        .catch(() => {
          return response
            .text()
            .then(text => {
              return { ...payload, text }
            })
            .catch(() => {
              return { ...payload, text: response.statusText }
            })
        })
    })
  }
}
