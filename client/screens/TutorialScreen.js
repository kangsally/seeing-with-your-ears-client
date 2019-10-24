import React, { Component } from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import MainButtons from '../components/MainButtons';
import HomeButton from '../components/HomeButton';
import InstructionBar from '../components/InstructionBar';
import CircleView from '../components/CircleView';
import { startTospeak, stopToSpeak } from '../utils';
import { TUTORIAL_TITLE } from '../constants/titles';
import { MAIN_SCREEN } from '../constants/screens';
import {
  tutorialScreenStartScript,
  tutorialEndScripit,
  makeErrorMessage,
  makeSuccessMessage,
  makeTutorialCheckMessage,
  introScript
} from '../assets/audioScripts';

export default class TutorialScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRightCheck: false,
      isLeftCheck: false,
      isCenterCheck: false
    };
  }

  componentDidMount = async () => {
    startTospeak(tutorialScreenStartScript);
  };

  componentWillUnmount = async () => {
    stopToSpeak();
  };

  checkBtn = button => {
    stopToSpeak();
    if (button === 'right') {
      if (!this.state.isLeftCheck && !this.state.isRightCheck) {
        startTospeak(makeErrorMessage(button));
      } else {
        this.setState({ isRightCheck: true });
        startTospeak(makeSuccessMessage(button));
      }
    } else if (button === 'left') {
      if (this.state.isLeftCheck && !this.state.isRightCheck) {
        startTospeak(makeErrorMessage(button));
      } else {
        this.setState({ isLeftCheck: true });
        startTospeak(makeSuccessMessage(button));
      }
    } else if (button === 'center') {
      this.setState({ isCenterCheck: true });
      startTospeak(tutorialEndScripit);
    }
  };

  navigateBtn = () => {
    const { navigation } = this.props;
    stopToSpeak();
    startTospeak(introScript);
    navigation.navigate(MAIN_SCREEN);
  };

  tutorialCompleteCheckBtn = button => {
    stopToSpeak();
    if (button === 'right') {
      AsyncStorage.setItem('tutorialComplete', 'completed', () => {
        this.setState({
          isTutorialComplete: true
        });
      });
      startTospeak(makeTutorialCheckMessage(button));
    } else if (button === 'left') {
      AsyncStorage.setItem('tutorialComplete', 'notCompleted', () => {
        this.setState({
          isTutorialComplete: true
        });
        startTospeak(makeTutorialCheckMessage(button));
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
    const {
      isRightCheck,
      isLeftCheck,
      isCenterCheck,
      isTutorialComplete
    } = this.state;

    if (isRightCheck && isLeftCheck && isCenterCheck) {
      return (
        <>
          <View style={styles.container}>
            <View style={styles.content}>
              <CircleView type="tutorialComplete" />
              <InstructionBar content={TUTORIAL_TITLE} />
            </View>
            {isTutorialComplete ? (
              <HomeButton onPressBtn={this.navigateBtn} icon={'home-circle'} />
            ) : (
              <MainButtons onPressBtn={this.tutorialCompleteCheckBtn} />
            )}
          </View>
        </>
      );
    } else {
      return (
        <>
          <View style={styles.container}>
            <View style={styles.content}>
              <CircleView type="tutorial" />
              <InstructionBar content={TUTORIAL_TITLE} />
            </View>
            {isRightCheck && isLeftCheck ? (
              <HomeButton onPressBtn={this.checkBtn} icon={'camera-iris'} />
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
