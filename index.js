import { NativeModules } from 'react-native'

import WebAuth from './webauth'

import { ProfileScreen, SettingsScreen } from './screensComponents/index'

const { Authcore: A0Authcore } = NativeModules

export default class Authcore {
  constructor (options = {}) {
    const { baseUrl } = options
    this.authcore = A0Authcore
    this.webAuth = new WebAuth(baseUrl)
    ProfileScreen.defaultProps = {
      baseUrl: baseUrl,
      accessToken: undefined
    }
    SettingsScreen.defaultProps = {
      baseUrl: baseUrl,
      accessToken: undefined
    }
    this.ProfileScreen = ProfileScreen
    this.SettingsScreen = SettingsScreen
  }
}
