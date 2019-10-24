import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Loading from '../components/Loading';
import MainButtons from '../components/MainButtons';
import InstructionBar from '../components/InstructionBar';
import {
  getLocationInfo,
  getCurrentAddress,
  locationCategory
} from '../api/index.js';
import { startTospeak, stopToSpeak } from '../utils';
import { MY_LOCATION_TITLE } from '../constants/titles';
import { MAIN_SCREEN } from '../constants/screens';
import {
  makePlaceInfoScript,
  makeLocationScreenScript
} from '../assets/audioScripts';

export default class LocationScreen extends Component {
  state = {
    hasLocationPermission: null,
    currentLongitude: null,
    currentLatitude: null,
    currentAddress: null,
    placeInfoScript: null,
    placeList: null
  };

  componentDidMount = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    this.setState({
      hasLocationPermission: status
    });
    const { coords } = await Location.getCurrentPositionAsync();
    const { longitude, latitude } = coords;
    const { navigation } = this.props;
    const currentAddressData = await getCurrentAddress(
      longitude,
      latitude,
      navigation
    );
    const currentAddress = currentAddressData.documents[0].address.address_name;

    const places = await Promise.all(
      locationCategory.map(async category =>
        getLocationInfo(longitude, latitude, category, navigation)
      )
    );

    const { script, placeList } = makePlaceInfoScript(
      places,
      longitude,
      latitude
    );

    this.setState({
      currentLongitude: longitude,
      currentLatitude: latitude,
      currentAddress: currentAddress,
      placeInfoScript: script,
      placeList: placeList
    });

    startTospeak(
      makeLocationScreenScript(
        this.state.currentAddress,
        this.state.placeInfoScript
      )
    );
  };

  componentWillUnmount = async () => {
    stopToSpeak();
  };

  navigateBtn = navigate => {
    const { navigation } = this.props;
    stopToSpeak();

    if (navigate === 'right') {
      navigation.navigate(MAIN_SCREEN);
    } else if (navigate === 'left') {
      startTospeak(
        makeLocationScreenScript(
          this.state.currentAddress,
          this.state.placeInfoScript
        )
      );
    }
  };

  render() {
    const {
      hasLocationPermission,
      currentLongitude,
      currentLatitude
    } = this.state;
    if (
      hasLocationPermission === null ||
      !currentLongitude ||
      !currentLatitude
    ) {
      return <Loading />;
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.mapBox}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.mapView}
                initialRegion={{
                  latitude: currentLatitude,
                  longitude: currentLongitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01
                }}
              >
                <Marker
                  title={this.state.currentAddress}
                  pinColor="blue"
                  coordinate={{
                    latitude: this.state.currentLatitude,
                    longitude: this.state.currentLongitude
                  }}
                  onPress={ev => {
                    stopToSpeak();
                    startTospeak(this.state.currentAddress);
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
            <InstructionBar content={MY_LOCATION_TITLE} />
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
    backgroundColor: '#CCCCCC'
  },
  mapBox: {
    flex: 8
  },
  mapView: {
    width: '100%',
    height: '100%'
  }
});
