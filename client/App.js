import React, { Component } from 'react';
import { SafeAreaView, Platform, AsyncStorage, View, StyleSheet } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import TutorialScreen from './screens/TutorialScreen';
import LocationScreen from './screens/LocationScreen';
import MainScreen from './screens/MainScreen';
import CameraScreen from './screens/CameraScreen';
let AppContainer;

export default class App extends Component {
  state = {
    isReady: false
  };

  async _loadAssetsAsync() {
    await Asset.fromModule(require('./assets/logo.png')).downloadAsync();
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
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
          <View style={styles.android}/>
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
