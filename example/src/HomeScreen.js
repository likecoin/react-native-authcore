import React, { Component } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';

import Authcore from 'react-native-authcore';

export default class App extends Component {
  state = {
    status: 'starting',
    message: '--',
    accessToken: '--'
  };
  constructor (props) {
    super(props);
    const authcore = new Authcore({
      // baseUrl: 'http://localhost:8000'
      // baseUrl: 'http://10.0.2.2:8000'
      baseUrl: 'https://authcore.dev:8001'
      // baseUrl: 'https://authcore-staging.blocksq.com'
    });
    this.state = {authcore: authcore}
  }

  componentDidMount() {
  }

  _onLogin = () => {
    this.state.authcore.webAuth.signin().then(data => {
      // Access token should be stored in keychain for security
      this.setState({
        accessToken: data.accessToken
      })
    })
      .catch(err => console.log(err))
  }

  async _onLoginAsync () {
    try {
      const { accessToken } = await this.state.authcore.webAuth.signin()
      // Access token should be stored in keychain for security
      this.setState({
        accessToken: data.accessToken
      })
    } catch(err) {
      console.log(err)
    }
  }

  render() {
    const {navigate} = this.props.navigation
    const {authcore} = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>☆Authcore example☆</Text>
        <Button onPress = { this._onLogin } title={ 'Sign In' } />
        <Button onPress = { this._onLoginAsync.bind(this) } title={ 'Sign In Async' } />
        <Text>{this.state.accessToken}</Text>
        <Button onPress={() => navigate('ProfileScreen', {
            accessToken: this.state.accessToken,
            authcore: this.state.authcore
          })} title={ 'Show Profile' } />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
