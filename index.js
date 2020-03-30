import { NativeModules } from 'react-native'

import Auth from './src/auth'
import WebAuth from './src/webauth'

import { ProfileScreen, SettingsScreen } from './src/screensComponents/index'

const { Authcore: A0Authcore } = NativeModules

export default class Authcore {
  constructor (options = {}) {
    const {
      clientId,
      baseUrl,
      initialScreen,
      company,
      logo,
      socialLoginPaneOption,
      socialLoginPaneStyle,
      buttonSize,
      language
    } = options
    this.authcore = A0Authcore
    this.auth = new Auth({
      clientId: clientId,
      baseUrl: baseUrl,
      initialScreen: initialScreen,
      company: company,
      logo: logo,
      socialLoginPaneOption: socialLoginPaneOption,
      socialLoginPaneStyle: socialLoginPaneStyle,
      buttonSize: buttonSize,
      language: language
    })
    this.webAuth = new WebAuth(this.auth)
    ProfileScreen.defaultProps = {
      baseUrl: baseUrl,
      accessToken: undefined
    }
    this.ProfileScreen = ProfileScreen
    this.settings = new SettingsScreen(this.auth)
  }
}
