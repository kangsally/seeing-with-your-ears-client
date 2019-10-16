import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { FontAwesome } from '@expo/vector-icons';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import TutorialScreen from './screens/TutorialScreen';
import LocationScreen from './screens/LocationScreen';
import MainScreen from './screens/MainScreen';
import CameraScreen from './screens/CameraScreen';
// import PhotoScreen from './screens/PhotoScreen';

export default class App extends Component {
  state = {
    isReady: false
  };

  async _loadAssetsAsync() {
    const imageAssets = cacheImages([require('./assets/logo.png')]);
    const fontAssets = cacheFonts([FontAwesome.font]);
    await Promise.all([...imageAssets, ...fontAssets]);
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
    }

    return <AppContainer />;
  }
}

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

const AppSwitchNavigator = createSwitchNavigator(
  {
    TutorialScreen,
    MainScreen,
    LocationScreen,
    CameraScreen
    // PhotoScreen
  },
  {
    initialRouteName: 'TutorialScreen'
  }
);

const AppContainer = createAppContainer(AppSwitchNavigator);
