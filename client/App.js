import React, { Component } from 'react';
import {
  SafeAreaView,
  Platform,
  AsyncStorage,
  View,
  StyleSheet
} from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Permissions from 'expo-permissions';
import TutorialScreen from './screens/TutorialScreen';
import LocationScreen from './screens/LocationScreen';
import MainScreen from './screens/MainScreen';
import CameraScreen from './screens/CameraScreen';
import PermissionError from './components/PermissionError';
import { startTospeak, stopToSpeak } from './utils';
import { permissionAskScript } from './assets/audioScripts';
let AppContainer;

export default class App extends Component {
  state = {
    isReady: false,
    hasCameraPermission: null,
    hasLocationPermission: null
  };

  loadAssetsAsync = async () => {
    // startTospeak(permissionAskScript);
    await Asset.fromModule(require('./assets/logo-1.png')).downloadAsync();
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const locationPermission = await Permissions.askAsync(Permissions.LOCATION);
    // if (
    //   cameraPermission.status === 'granted' &&
    //   locationPermission.status === 'granted'
    // ) {
    //   stopToSpeak();
    // }
    this.setState({
      hasCameraPermission: cameraPermission.status,
      hasLocationPermission: locationPermission.status
    });
  };

  render() {
    const { isReady, hasCameraPermission, hasLocationPermission } = this.state;
    if (
      hasCameraPermission === 'denied' ||
      hasLocationPermission === 'denied'
    ) {
      return <PermissionError />;
    }
    if (!isReady) {
      return (
        <AppLoading
          startAsync={this.loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    } else {
      if (Platform.OS !== 'android') {
        return (
          <SafeAreaView style={styles.ios}>
            <AppContainer />
          </SafeAreaView>
        );
      }
      return (
        <>
          <View style={styles.android} />
          <AppContainer />
        </>
      );
    }
  }
}

AsyncStorage.getItem('tutorialComplete').then(tutorialCheck => {
  const AppSwitchNavigator = createSwitchNavigator(
    {
      TutorialScreen,
      MainScreen,
      LocationScreen,
      CameraScreen
    },
    {
      initialRouteName: `${
        tutorialCheck === null || tutorialCheck === 'notCompleted'
          ? 'TutorialScreen'
          : 'MainScreen'
      }`
    }
  );
  AppContainer = createAppContainer(AppSwitchNavigator);
});

const styles = StyleSheet.create({
  ios: {
    flex: 1,
    backgroundColor: '#fff'
  },
  android: {
    height: 24
  }
});
