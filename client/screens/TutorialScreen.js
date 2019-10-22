import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage } from 'react-native';
import MainButtons from '../components/MainButtons';
import HomeButton from '../components/HomeButton';
import InstructionBar from '../components/InstructionBar';
import CircleView from '../components/CircleView';
import { startTospeak, stopToSpeak } from '../utils/utils.js';
import {
  intro,
  pressLeft,
  pressRight,
  pressCenter,
  error,
  end,
  excellent,
  blank
} from '../assets/audioScripts/audioScripts';
import { Header, Title } from 'native-base';

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
    startTospeak(intro + blank + pressLeft);
  };

  checkBtn = button => {
    stopToSpeak();
    if (button === 'right') {
      if (!this.state.isLeftCheck && !this.state.isRightCheck) {
        startTospeak(error + blank + pressLeft);
      } else {
        this.setState({ isRightCheck: true });
        startTospeak(excellent + blank + pressCenter);
      }
    } else if (button === 'left') {
      if (this.state.isLeftCheck && !this.state.isRightCheck) {
        startTospeak(error + blank + pressRight);
      } else {
        this.setState({ isLeftCheck: true });
        startTospeak(excellent + blank + pressRight);
      }
    } else if (button === 'center') {
      this.setState({ isCenterCheck: true });
      startTospeak(excellent + blank + end);
    }
  };

  navigateBtn = navigate => {
    const { navigation } = this.props;
    stopToSpeak();
    if (navigate === 'right') {
      navigation.navigate('MainScreen');
    } else if (navigate === 'left') {
      this.setState({
        isRightCheck: false,
        isLeftCheck: false,
        isCenterCheck: false
      });
      startTospeak(intro + blank + pressLeft);
    }
  };

  tutorialCompleteCheckBtn = button => {
    stopToSpeak();
    if (button === 'right') {
      AsyncStorage.setItem('tutorialComplete', 'completed', () => {
        this.setState({
          isTutorialComplete: true
        });
      });
      startTospeak('다음는 튜토리얼을 진행하지 않겠습니다. 메인화면으로 넘어가시려면 오른쪽버튼을 눌러주세요. 다시 튜토리얼을 들으시려면 왼쪽버튼을 눌러주세요 ');
    } else if (button === 'left') {
      AsyncStorage.setItem('tutorialComplete', 'notCompleted', () => {
        this.setState({
          isTutorialComplete: true
        });
        startTospeak('다음에도 튜토리얼을 진행하겠습니다. 메인화면으로 넘어가시려면 오른쪽버튼을 눌러주세요. 다시 튜토리얼을 들으시려면 왼쪽버튼을 눌러주세요');
      });
    }
  };

  componentWillUnmount = () => {
    this.setState({
      isRightCheck: false,
      isLeftCheck: false,
      isCenterCheck: false,
      isTutorialComplete: false
    });
  };

  render() {
    const { isRightCheck, isLeftCheck, isCenterCheck, isTutorialComplete } = this.state;
    console.log(isRightCheck, isLeftCheck, isCenterCheck);

    if (isRightCheck && isLeftCheck && isCenterCheck) {
      return (
        <>
          <View style={styles.container}>
            <View style={styles.content}>
              <CircleView type="tutorialComplete" />
              <InstructionBar content="튜토리얼 완료" />
            </View>
            <MainButtons onPressBtn={isTutorialComplete? this.navigateBtn : this.tutorialCompleteCheckBtn} />
          </View>
        </>
      );
    } else {
      return (
        <>
          <View style={styles.container}>
            <View style={styles.content}>
              <CircleView type="tutorial" />
              <InstructionBar content="튜토리얼 진행중" />
            </View>
            {isRightCheck && isLeftCheck ? (
              <HomeButton onPressBtn={this.checkBtn} />
            ) : (
              <MainButtons onPressBtn={this.checkBtn} />
            )}
          </View>
        </>
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
    backgroundColor: '#CCCCCC'
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9A914',
    color: '#FFF',
    borderRadius: 200,
    flex: 8
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold'
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    marginTop: 1,
    flex: 2
  },
  title: {
    fontSize: 20,
    color: 'white'
  }
});
