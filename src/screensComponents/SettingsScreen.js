import Agent from '../webauth/agent'
import color from 'color'

export default class SettingsScreen {
  constructor (auth) {
    if (!auth) {
      throw new Error('Auth instance is not found. Please provide it.')
    }
    this.auth = auth
    this.agent = new Agent()
    this.client = auth.client
  }

  async show (options = {}) {
    const {
      accessToken = undefined,
      company = undefined,
      logo = undefined,
      internal = false
    } = options

    let {
      primaryColour = undefined,
      dangerColour = undefined,
      successColour = undefined
    } = options
    const containerId = Math.random().toString(36).substring(2)

    primaryColour = this._buildColourCode(primaryColour)
    successColour = this._buildColourCode(successColour)
    dangerColour = this._buildColourCode(dangerColour)
    if (typeof internal !== 'boolean') {
      throw new Error('internal param must be boolean')
    }
    if (accessToken === undefined || accessToken === '' || accessToken === null) {
      throw new Error('provide access token for settings screen')
    }

    // TODO: Provide parameter to set layout
    const settingsPathWithoutToken = this.client.url('widgets/settings', {
      cid: containerId,
      company: company,
      logo: logo,
      primaryColour: primaryColour,
      successColour: successColour,
      dangerColour: dangerColour,
      internal: internal
    }, { screen: true })

    const settingsPath = settingsPathWithoutToken + `#${accessToken}`
    this.agent.show(settingsPath, false, false)
  }

  _buildColourCode (colour) {
    if (typeof colour === 'string') {
      try {
        return `#${color(colour).hex().slice(1)}`
      } catch (err) {
        throw new Error('colour parameters have to be correct format')
      }
    }
    return undefined
  }
}
