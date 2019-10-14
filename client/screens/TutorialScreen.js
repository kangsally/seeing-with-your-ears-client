import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MainButtons from '../components/MainButtons';
import HomeButton from '../components/HomeButton';
import * as Speech from 'expo-speech';

export default class TutorialScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRightCheck: false,
      isLeftCheck: false,
      isCenterCheck: false
    };
    this.checkBtn = this.checkBtn.bind(this);
  }

  componentDidMount = () => {
    const greetText =
      '귀로 튜토리얼입니다. 스크린 하단 3분의 1지점에 왼쪽과 오른쪽 두개 버튼이 있습니다. 왼쪽버튼을 눌러주세요';
    this.speak(greetText);
  };

  checkBtn = button => {
    if (button === 'right') {
      if (!this.state.isLeftCheck && !this.state.isRightCheck) {
        this.speak('잘못누르셨습니다. 왼쪽버튼을 눌러주세요.');
      } else {
        this.setState({ isRightCheck: true });
        this.speak(
          '잘하셨습니다. 이번에는 스크린 하단 3분의 1 지점에 중앙버튼이 하나 있습니다. 버튼을 눌러주세요'
        );
      }
    } else if (button === 'left') {
      if (this.state.isLeftCheck && !this.state.isRightCheck) {
        this.speak('잘못누르셨습니다. 오른쪽버튼을 눌러주세요.');
      } else {
        this.setState({ isLeftCheck: true });
        this.speak('잘하셨습니다. 이번에는 오른쪽 버튼을 눌러주세요');
      }
    } else if (button === 'center') {
      this.setState({ isCenterCheck: true });
      this.speak(
        '잘하셨습니다. 다시 튜토리얼을 진행하시려면 왼쪽 버튼을 귀로를 시작하시려면 오른쪽 버튼을 눌러주세요'
      );
    }
  };

  navigateBtn = navigate => {
    const { navigation } = this.props;
    if (navigate === 'right') {
      navigation.navigate('MainScreen');
    } else if (navigate === 'left') {
      this.setState({
        isRightCheck: false,
        isLeftCheck: false,
        isCenterCheck: false
      });
      const greetText =
      '귀로 튜토리얼입니다. 스크린 하단 3분의 1지점에 왼쪽과 오른쪽 두개 버튼이 있습니다. 왼쪽버튼을 눌러주세요';
      this.speak(greetText);
    }
  };

  componentWillUnmount = () => {
    this.setState({
      isRightCheck: false,
      isLeftCheck: false,
      isCenterCheck: false
    });
  };

  speak = thingToSay => {
    Speech.speak(thingToSay);
  };

  render() {
    const { isRightCheck, isLeftCheck, isCenterCheck } = this.state;
    console.log(isRightCheck, isLeftCheck, isCenterCheck);

    if (isRightCheck && isLeftCheck && isCenterCheck) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.text}>튜토리얼 완료</Text>
          </View>
          <MainButtons onPressBtn={this.navigateBtn} />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.text}>튜토리얼 진행중</Text>
          </View>
          {isRightCheck && isLeftCheck ? (
            <HomeButton onPressBtn={this.checkBtn} />
          ) : (
            <MainButtons onPressBtn={this.checkBtn} />
          )}
        </View>
      );
    }
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
