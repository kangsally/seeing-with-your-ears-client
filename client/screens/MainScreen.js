import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MainButtons from '../components/MainButtons';
import InstructionBar from '../components/InstructionBar';
import { startTospeak, stopToSpeak } from '../utils';
import { MAIN_TITLE } from '../constants/titles';
import { CAMERA_SCREEN, LOCATION_SCREEN } from '../constants/screens';
import { mainScreenStartScript } from '../assets/audioScripts';

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
          <View style={styles.imageBox}>
            <Image
              style={styles.image}
              source={require('../assets/logo-1.png')}
            />
          </View>
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
    backgroundColor: '#fff'
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '60%'
  },
  imageBox: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
