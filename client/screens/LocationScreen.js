import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MainButtons from '../components/MainButtons';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { startTospeak, stopToSpeak } from '../utils/utils.js';
import { getLocationInfo, getCurrentAddress } from '../api/index.js';
import { makePlaceInfoScript } from '../assets/audioScripts/audioScripts.js';

export default class LocationScreen extends Component {
  state = {
    hasLocationPermission: null,
    currentLongitude: null,
    currentLatitude: null,
    currentAddress: null,
    placeInfoScript: null,
    placeList: null
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    const { coords } = await Location.getCurrentPositionAsync();
    const { longitude, latitude } = coords;
    const greetText = '나의 위치 안내 화면 입니다.';
    let currentAddress;

    getCurrentAddress(longitude, latitude).then(address => {
      currentAddress = address.documents[0].address.address_name;
      console.log(address);
      Promise.all([
        getLocationInfo(longitude, latitude, 'SW8'),
        getLocationInfo(longitude, latitude, 'HP8'),
        getLocationInfo(longitude, latitude, 'PM9'),
        getLocationInfo(longitude, latitude, 'CS2')
      ]).then(places => {
        const { script, placeList } = makePlaceInfoScript(
          places,
          longitude,
          latitude
        );
        this.setState({
          hasLocationPermission: status === 'granted',
          currentLongitude: longitude,
          currentLatitude: latitude,
          currentAddress: currentAddress,
          placeInfoScript: script,
          placeList: placeList
        });
        startTospeak(
          greetText +
            '나의 위치는 ' +
            this.state.currentAddress +
            '입니다.' +
            this.state.placeInfoScript
        );
      });
    });
  }

  navigateBtn = navigate => {
    const { navigation } = this.props;
    stopToSpeak();
    if (navigate === 'right') {
      this.setState({
        hasLocationPermission: null,
        currentLongitude: null,
        currentLatitude: null,
        currentAddress: null,
        placeInfoScript: null,
        placeList: null
      });
      navigation.navigate('MainScreen');
    } else if (navigate === 'left') {
      startTospeak(
        '나의 위치는 ' +
          this.state.currentAddress +
          '입니다.' +
          this.state.placeInfoScript
      );
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
                title="나의 위치"
                description={this.state.currentAddress}
                pinColor="blue"
                coordinate={{
                  latitude: this.state.currentLatitude,
                  longitude: this.state.currentLongitude
                }}
                onPress={ev => {
                  stopToSpeak();
                  startTospeak('나의 위치');
                }}
              />
              {this.state.placeList.map(place => (
                <Marker
                  key={place.id}
                  title={place.place_name}
                  description={
                    place.road_address_name
                      ? place.road_address_name
                      : place.address_name
                  }
                  coordinate={{
                    latitude: Number(place.y),
                    longitude: Number(place.x)
                  }}
                  onPress={ev => {
                    stopToSpeak();
                    startTospeak(place.place_name);
                  }}
                />
              ))}
            </MapView>
          </View>
          <MainButtons onPressBtn={this.navigateBtn} />
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
