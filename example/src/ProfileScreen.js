import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default class ProfileScreen extends Component {
  componentDidMount () {}

  render () {
    const {navigation} = this.props
    const accessToken = navigation.getParam('accessToken', 'null')
    const authcore = navigation.getParam('authcore', {})

    return (
      <View style={{ flex: 1 }}>
        <Text>Authcore Profile</Text>
        <authcore.SettingsScreen containerStyle={styles.profileScreen} accessToken={ accessToken } />
        <authcore.ProfileScreen containerStyle={styles.profileScreen} accessToken={ accessToken } />
        <Text>Authcore Profile End</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  profileScreen: {
    maxHeight: 300,
  }
})
