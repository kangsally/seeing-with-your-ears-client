import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HomeButton from '../components/HomeButton';
import * as Speech from 'expo-speech';

export default class LocationScreen extends Component {

  componentDidMount = () => {
    const greetText =
      '나의 위치 안내 화면 입니다.';
    this.speak(greetText);
  };

  navigateBtn = navigate => {
    const { navigation } = this.props;
    if(navigate === 'center'){
        navigation.navigate('MainScreen');
    }
  }

  speak = thingToSay => {
    Speech.speak(thingToSay);
  };

  render() {

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.text}>위치 화면</Text>
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
