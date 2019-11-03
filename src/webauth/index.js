import { NativeModules } from 'react-native'
import url from 'url'

import Agent from './agent'

const { Authcore } = NativeModules

const bundleIdentifier = Authcore.bundleIdentifier

export default class WebAuth {
  constructor (auth) {
    if (!auth) {
      throw new Error('Auth instance is not found. Please provide it.')
    }
    this.auth = auth
    this.agent = new Agent()
    this.client = auth.client
  }

  signin (options = {}) {
    return new Promise((resolve, reject) => {
      // TODO: Not to fix the redirect URI
      const redirectUri = `${bundleIdentifier}://`
      // TODO: Set to correct query string
      const authorizeUrl = this.client.url('/widgets/oauth', {
        client_id: 'authcore.io',
        response_type: 'code',
        redirect_uri: redirectUri
      })
      this.agent.show(authorizeUrl, false).then((redirectUrl) => {
        if (!redirectUri) {
          throw new Error('redirectUri cannot be empty. Please provide the value')
        }
        const query = url.parse(redirectUrl, true).query
        const { code } = query
        this.client.post('/api/auth/tokens', {
          grant_type: 'AUTHORIZATION_TOKEN',
          token: code
        })
          .then(async (response) => {
            const currentUser = await this.auth.userInfo({
              token: response.json.access_token
            })
            const resp = {
              accessToken: response.json.access_token,
              refreshToken: response.json.refresh_token,
              idToken: response.json.id_token,
              currentUser: currentUser
            }
            resolve(resp)
          })
          .catch((err) => {
            reject(err)
          })
      })
    })
  }
}
