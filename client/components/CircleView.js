import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function CircleView(props) {
  return <View style={styles[props.type]}></View>;
}

const styles = StyleSheet.create({
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9A914',
    borderRadius: 200,
    flex: 8
  },
  tutorial: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9A914',
    borderRadius: 200,
    flex: 8
  },
  tutorialComplete: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00462E',
    borderRadius: 200,
    flex: 8
  },
  error: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9C3414',
    borderRadius: 200,
    flex: 8
  }
});
