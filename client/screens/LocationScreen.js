import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HomeButton from '../components/HomeButton';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { startTospeak, stopToSpeak } from '../utils/utils.js';

export default class LocationScreen extends Component {
  state = {
    hasLocationPermission: null,
    currentLongitude: null,
    currentLatitude: null
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    const { coords } = await Location.getCurrentPositionAsync();

const response = await fetch(`https://dapi.kakao.com/v2/local/search/category.json?category_group_code=PM9&y=${coords.latitude}&x=${coords.longitude}&radius=${500}&page=${1}&sort=distance`, {
  method: 'GET',
  headers: {
    Authorization: 'dd'
  }
});
const responseJson = await response.json();
console.log(responseJson);


    const greetText = '나의 위치 안내 화면 입니다.';
    Location.reverseGeocodeAsync({longitude:coords.longitude, latitude: coords.latitude }).then(location => console.log(location));
    this.setState({
      hasLocationPermission: status === 'granted',
      currentLongitude: coords.longitude,
      currentLatitude: coords.latitude
    });
    startTospeak(greetText);
  }


  navigateBtn = navigate => {
    const { navigation } = this.props;
    if (navigate === 'center') {
      navigation.navigate('MainScreen');
    }
  };

  render() {
    const {
      hasLocationPermission,
      currentLongitude,
      currentLatitude
    } = this.state;
    if (!hasLocationPermission || !currentLongitude || !currentLatitude) {
      return <View></View>;
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ width: '100%', height: '100%' }}
              initialRegion={{
                latitude: currentLatitude,
                longitude: currentLongitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              }}
            >
              <Marker
                coordinate={{
                  latitude: currentLatitude,
                  longitude: currentLongitude
                }}
              />
            </MapView>
          </View>
          <HomeButton onPressBtn={this.navigateBtn} />
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
