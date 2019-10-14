import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MainButtons from '../components/MainButtons';
import * as Speech from 'expo-speech';

export default class TutorialScreen extends Component {

  componentDidMount = () => {
    const greetText =
      '메인화면입니다. 나의 위치를 들으시려면 왼쪽버튼, 나의 시야를 들으시려면 오른쪽버튼을 눌러주세요.';
    this.speak(greetText);
  };

  navigateBtn = navigate => {
    const { navigation } = this.props;
    if(navigate === 'right'){
        navigation.navigate('CameraScreen');
    }else if(navigate === 'left'){
        navigation.navigate('LocationScreen');
    }
  }

  speak = thingToSay => {
    Speech.speak(thingToSay);
  };

  render() {

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.text}>메인화면</Text>
          </View>
          <MainButtons onPressBtn={this.navigateBtn} />
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
