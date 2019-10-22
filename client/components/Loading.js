import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { startTospeak, stopToSpeak } from '../utils/utils.js';

export default class Loading extends Component {
  componentDidMount() {
    startTospeak('잠시만 기다려주세요')
  }

  componentWillUnmount() {
    stopToSpeak();
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
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
  },
  center: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAEDEC'
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold'
  }
});
