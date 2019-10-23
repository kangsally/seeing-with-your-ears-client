import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import MainButtons from '../components/MainButtons';
import InstructionBar from '../components/InstructionBar';
import CircleView from '../components/CircleView';
import { startTospeak, stopToSpeak } from '../utils/utils.js';
import {MAIN_TITLE} from '../constants/titles.js';
import {CAMERA_SCREEN, LOCATION_SCREEN} from '../constants/screens.js';
import { mainScreenStartScript } from '../assets/audioScripts/audioScripts.js';

export default class MainScreen extends Component {
  componentDidMount = () => {
    startTospeak(mainScreenStartScript);
  };

  navigateBtn = navigate => {
    const { navigation } = this.props;
    stopToSpeak();
    if (navigate === 'right') {
      navigation.navigate(CAMERA_SCREEN);
    } else if (navigate === 'left') {
      navigation.navigate(LOCATION_SCREEN);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <CircleView type='main' />
          <InstructionBar content={MAIN_TITLE} />
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
