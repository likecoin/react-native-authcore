import React, { Component } from 'react'
import { WebView } from 'react-native-webview'
import color from 'color'

import Client from '../networking'

export default class AuthcoreScreen extends Component {
  constructor (props) {
    super(props)
    const {
      baseUrl,
      accessToken,
      company = undefined,
      logo = undefined,
      internal = false,
      page = 'profile'
    } = this.props

    let {
      primaryColour = undefined,
      dangerColour = undefined,
      successColour = undefined
    } = this.props

    if (accessToken === undefined) {
      console.warn('accessToken is undefined, please provide access token for normal access.')
    }
    this.client = new Client({
      baseUrl: baseUrl
    })

    const containerId = Math.random().toString(36).substring(2)
    primaryColour = this._buildColourCode(primaryColour)
    successColour = this._buildColourCode(successColour)
    dangerColour = this._buildColourCode(dangerColour)
    if (typeof internal !== 'boolean') {
      throw new Error('internal param must be boolean')
    }

    this.widgetPath = this.client.url(`widgets/${page}`, {
      cid: containerId,
      company: company,
      logo: logo,
      primaryColour: primaryColour,
      successColour: successColour,
      dangerColour: dangerColour,
      internal: internal
    })
  }

  _buildColourCode (colour) {
    if (typeof colour === 'string') {
      try {
        return encodeURIComponent(`#${color(colour).hex().slice(1)}`)
      } catch (err) {
        throw new Error('colour parameters have to be correct format')
      }
    }
    return undefined
  }

  render () {
    const { accessToken, containerStyle } = this.props

    const injectAccessToken = `
      this.postMessage({type: 'AuthCore_accessToken', data: '${accessToken}'}, '${this.client.baseUrl}')
    `
    return (
      <WebView
        containerStyle={ containerStyle }
        source={{ uri: this.widgetPath }}
        injectedJavaScript={accessToken !== undefined && injectAccessToken}
      />
    )
  }
}
