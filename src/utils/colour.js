import color from 'color'

export function _buildColourCode (colour) {
  if (typeof colour === 'string') {
    try {
      return (`#${color(colour).hex().slice(1)}`)
    } catch (err) {
      throw new Error('colour parameters have to be correct format')
    }
  }
  return undefined
}
