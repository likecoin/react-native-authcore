import { NativeModules, Linking } from 'react-native'

const { Authcore } = NativeModules;

export default class Agent {
  show(url, closeOnLoad = false) {
    if (!Authcore) {
      return Promise.reject(
        new Error(
          'Missing NativeModule. Please make sure you run `react-native link react-native-authcore`'
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
      Authcore.showUrl(url, closeOnLoad, (error, redirectURL) => {
        Linking.removeEventListener('url', urlHandler)
        if (error) {
          reject(error)
        } else if(redirectURL) {
          resolve(redirectURL)
        } else if(closeOnLoad) {
          resolve()
        }
      })
    })
  }
}
