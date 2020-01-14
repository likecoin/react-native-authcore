import url from 'url'

export default class Client {
  constructor (options) {
    const {
      baseUrl,
      token,
      socialLoginPaneStyle = 'bottom'
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
    const allowedSocialLoginPaneStyle = [
      'top',
      'bottom'
    ]
    if (allowedSocialLoginPaneStyle.includes(socialLoginPaneStyle)) {
      this.socialLoginPaneStyle = socialLoginPaneStyle
    } else {
      throw new Error('socialLoginPaneStyle only support top and bottom as input')
    }
    if (token) {
      this.bearer = `Bearer ${token}`
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

  url (path, query) {
    let endpoint = url.resolve(this.baseUrl, path)
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
