import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import MainButtons from '../components/MainButtons';
import InstructionBar from '../components/InstructionBar';
import CircleView from '../components/CircleView';
import { startTospeak, stopToSpeak } from '../utils/utils.js';

export default class MainScreen extends Component {
  componentDidMount = () => {
    const greetText =
      '나의 위치를 들으시려면 왼쪽버튼, 나의 시야를 들으시려면 오른쪽버튼을 눌러주세요.';
    startTospeak(greetText);
  };

  navigateBtn = navigate => {
    const { navigation } = this.props;
    stopToSpeak();
    if (navigate === 'right') {
      navigation.navigate('CameraScreen');
    } else if (navigate === 'left') {
      navigation.navigate('LocationScreen');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
        <CircleView type="main" />
              <InstructionBar content="안녕하세요 귀로입니다:)" />
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
    backgroundColor: '#CCCCCC'
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold'
  }
});
