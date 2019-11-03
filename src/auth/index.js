import Client from '../networking'

export default class Auth {
  constructor (options = {}) {
    this.client = new Client(options)
  }

  userInfo (options = {}) {
    if (!options.token) {
      throw new Error('access token should be provided')
    }
    const { baseUrl } = this.client
    const client = new Client({
      baseUrl: baseUrl,
      token: options.token
    })
    return new Promise((resolve, reject) => {
      client.get('/api/auth/users/current')
        .then((response) => {
          resolve(response.json)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
