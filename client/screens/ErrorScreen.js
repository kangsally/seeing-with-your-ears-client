import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import CircleView from '../components/CircleView';
import HomeButton from '../components/HomeButton';
import InstructionBar from '../components/InstructionBar';
import { startTospeak, stopToSpeak } from '../utils';
import { MAIN_SCREEN } from '../constants/screens';
import { ERROR_TITLE } from '../constants/titles';
import { errorScreenStartScript } from '../assets/audioScripts';

export default class ErrorScreen extends Component {
  componentDidMount = () => {
    startTospeak(errorScreenStartScript);
  };

  componentWillUnmount = async () => {
    stopToSpeak();
  };

  navigateBtn = () => {
    const { navigation } = this.props;
    stopToSpeak();
    navigation.navigate(MAIN_SCREEN);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <CircleView type="error" />
          <InstructionBar content={ERROR_TITLE} />
        </View>
        <HomeButton
          onPressBtn={() => {
            this.navigateBtn();
          }}
          icon={'home-circle'}
        />
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
  errorBox: {
    flex: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
