import React, { Component } from 'react';
import { SafeAreaView, Platform, AsyncStorage } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import TutorialScreen from './screens/TutorialScreen';
import LocationScreen from './screens/LocationScreen';
import MainScreen from './screens/MainScreen';
import CameraScreen from './screens/CameraScreen';
import { View } from 'native-base';
let AppContainer;


export default class App extends Component {
  state = {
    isReady: false
  };

  async _loadAssetsAsync() {
    await Asset.fromModule(require('./assets/logo.png')).downloadAsync();
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
      ...FontAwesome.font
    });
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
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <AppContainer />
          </SafeAreaView>
        );
      }
      return (
        <>
          <View style={{ height: 24 }}></View>
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
      initialRouteName: `${ tutorialCheck === null || tutorialCheck === 'notCompleted' ? 'TutorialScreen' : 'MainScreen' }`
    }
  );
  AppContainer = createAppContainer(AppSwitchNavigator);
})
