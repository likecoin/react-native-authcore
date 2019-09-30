import { NativeModules, Platform } from 'react-native'
import url from 'url'

import Agent from './agent'
import Client from '../networking'

const { Authcore } = NativeModules

const bundleIdentifier = Authcore.bundleIdentifier

export default class WebAuth {
  constructor(baseUrl) {
    if (!baseUrl) {
      throw new Error('baseUrl cannot be empty. Please provide the value')
    }
    this.baseUrl = baseUrl
    this.agent = new Agent()
    this.client = new Client({
      baseUrl: this.baseUrl
    })
  }

  async signin(options = {}) {
    return new Promise((resolve, reject) => {
      // TODO: Not to fix the redirect URI
      const redirectUriiOS = `${bundleIdentifier}://authcore.dev`
      const redirectUriAndroid = `${bundleIdentifier}://authcore.dev`
      const redirectUri = Platform.OS === 'ios' ? redirectUriiOS : redirectUriAndroid
      // TODO: Set to correct query string
      this.agent.show(`${this.baseUrl}/widgets/oauth?client_id=authcore.io&response_type=code&redirect_uri=${redirectUri}`, false).then(async (redirectUrl) => {
        if (!redirectUri) {
          throw new Error('redirectUri cannot be empty. Please provide the value')
        }
        const query = url.parse(redirectUrl, true).query
        const { code, state } = query
        this.client.post('/api/auth/tokens', {
          'grant_type': 'AUTHORIZATION_TOKEN',
          'token': code
        })
          .then((response) => {
            resolve(response.json.access_token)
          })
          .catch((err) => {
            reject(err)
          })
      })
    })
  }
}
