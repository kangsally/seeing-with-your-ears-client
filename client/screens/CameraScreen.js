import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HomeButton from '../components/HomeButton';
import { startTospeak, stopToSpeak } from '../utils/utils.js';

export default class CamearScreen extends Component {
  componentDidMount = () => {
    const greetText = '나의 시야 촬영화면 입니다.';
    startTospeak(greetText);
  };

  navigateBtn = navigate => {
    const { navigation } = this.props;
    if (navigate === 'center') {
      navigation.navigate('PhotoScreen');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.text}>카메라 화면</Text>
        </View>
        <HomeButton onPressBtn={this.navigateBtn} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    color: 'white'
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold'
  }
});
