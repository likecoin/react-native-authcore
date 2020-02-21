import { NativeModules, Linking } from 'react-native'

const { Authcore } = NativeModules

export default class Agent {
  show (url, closeOnLoad = false, triggerError = true) {
    if (!Authcore) {
      return Promise.reject(
        new Error(
          'Missing NativeModule. React Native versions 0.60 and up perform auto-linking. Please see https://github.com/react-native-community/cli/blob/master/docs/autolinking.md.'
        )
      )
    }

    return new Promise((resolve, reject) => {
      const urlHandler = event => {
        Authcore.hide()
        Linking.removeEventListener('url', urlHandler)
        resolve(event.url)
      }
      Linking.addEventListener('url', urlHandler)
      if (!triggerError) {
        Authcore.showNormalUrl(url, closeOnLoad)
      } else {
        Authcore.showAuthUrl(url, closeOnLoad, (error, redirectURL) => {
          Linking.removeEventListener('url', urlHandler)
          if (error) {
            reject(error)
          } else if (redirectURL) {
            resolve(redirectURL)
          } else if (closeOnLoad) {
            resolve()
          }
        })
      }
    })
  }

  newTransaction () {
    if (!Authcore) {
      return Promise.reject(
        new Error(
          'Missing NativeModule. React Native versions 0.60 and up perform auto-linking. Please see https://github.com/react-native-community/cli/blob/master/docs/autolinking.md.'
        )
      )
    }

    return new Promise((resolve, reject) => {
      Authcore.oauthParameters(parameters => {
        resolve(parameters)
      })
    })
  }
}
