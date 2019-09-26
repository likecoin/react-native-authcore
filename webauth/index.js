import url from 'url'

import Agent from './agent'

export default class WebAuth {
  constructor() {
    this.agent = new Agent()
  }

  signin(options = {}) {
    return new Promise((resolve, reject) => {
      this.agent.show('https://authcore.dev:8001/widgets/oauth?client_id=authcore.io&response_type=code&redirect_uri=org.reactjs.native.example.example://authcore.dev', false).then(redirectUrl => {
        // TODO: Handle no redirectUrl

        const query = url.parse(redirectUrl, true).query
        const { code, state } = query
        console.log(state)
        resolve(code)
      })
    })
    // return this.agent.show('https://authcore.dev:8001/widgets/oauth?client_id=authcore.io&response_type=code&redirect_uri=org.reactjs.native.example.example://authcore.dev', false).then(redirectUrl => {
    //   // TODO: Handle no redirectUrl

    //   const query = url.parse(redirectUrl, true).query
    //   const { code, state: resultState, error } = query
    //   console.log(code)
    //   console.log(resultState)
    //   console.log(error)
    // })
  }
}
