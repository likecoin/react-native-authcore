import { NativeModules } from 'react-native'

import WebAuth from './webauth'

const { Authcore: A0Authcore } = NativeModules

export default class Authcore {
  constructor (options = {}) {
    const { baseUrl } = options
    this.authcore = A0Authcore
    this.webAuth = new WebAuth(baseUrl)
  }
}
