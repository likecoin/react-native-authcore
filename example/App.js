/**
 * Sample React Native App
 *
 * adapted from App.js generated by the following command:
 *
 * react-native init example
 *
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import Authcore from 'react-native-authcore';

export default class App extends Component {
  state = {
    status: 'starting',
    message: '--',
    accessToken: '--'
  };
  componentDidMount() {
    const authcore = new Authcore({
      baseUrl: 'http://localhost:8000'
      // baseUrl: 'http://10.0.2.2:8000'
    });
    this.setState({ authcore: authcore });
  }

  _onLogin = () => {
    this.state.authcore.webAuth.signin().then(accessToken => {
      // Access token should be stored in keychain for security
      this.setState({
        accessToken: accessToken
      })
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>☆Authcore example☆</Text>
        <Button onPress = { this._onLogin } title={ 'Sign In' } />
        <Text>{this.state.accessToken}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
