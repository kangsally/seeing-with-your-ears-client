import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { startTospeak, stopToSpeak } from '../utils';
import { permissionErrorScript } from '../assets/audioScripts';

export default class PermissionError extends Component {
  componentDidMount() {
    startTospeak(permissionErrorScript);
  }

  componentWillUnmount() {
    stopToSpeak();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>PermissionError</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row'
  }
});
