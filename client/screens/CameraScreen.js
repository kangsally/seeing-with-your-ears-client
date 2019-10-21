import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { GLView } from 'expo-gl';
import Expo2DContext from 'expo-2d-context';
import HomeButton from '../components/HomeButton';
import { startTospeak, stopToSpeak } from '../utils/utils.js';
import { translateWord, getReconizedByAIData } from '../api/index.js';
import { makeObjDescrition } from '../assets/audioScripts/audioScripts';
import { countBy, identity } from 'lodash';

export default class CamearScreen extends Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    isCaptured: false,
    photo: null,
    objectData: [],
    script: null
  };

  componentDidMount = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const greetText = '나의 시야 촬영화면 입니다.';
    this.setState({ hasCameraPermission: status === 'granted' });
    startTospeak(greetText);
  };

  takePicture = async () => {
    if (this.camera) {
      const photo = await this.camera.takePictureAsync({
        quality: 0.5
      });
      getReconizedByAIData(photo.uri).then(data => {
        let nearObj = [];
        let farObj = [];
        let objectData = data.return_object.data;

        Promise.all(
          objectData.map(async obj => {
            await translateWord(
              obj,
              nearObj,
              farObj,
              photo.height / 2
            );
          })
        ).then(() => {
          const script = makeObjDescrition(
            countBy(nearObj, identity),
            countBy(farObj, identity)
          );
          this.setState({
            isCaptured: true,
            objectData: objectData,
            photo: photo,
            script: script
          });
          startTospeak(this.state.script);
        });
      });
    }
  };

  onGLContextCreate = async gl => {
    const ctx = new Expo2DContext(gl);
    await ctx.initializeText();
    const ratioX = Math.abs(ctx.width / this.state.photo.width);
    const ratioY = Math.abs(ctx.height / this.state.photo.height);
    ctx.fillStyle = 'white';
    ctx.font = 'italic 40pt sans-serif';

    this.state.objectData.forEach(obj => {
      ctx.fillText(obj.class, obj.x * ratioX, obj.y * ratioY);
    });
    ctx.flush();
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (this.state.isCaptured) {
      return (
        <View style={styles.container}>
          <ImageBackground
            style={{
              flex: 2,
              resizeMode: 'contain'
            }}
            source={{
              uri: this.state.photo.uri
            }}
            ref={ref => {
              this.photo = ref;
            }}
          >
            <GLView
              style={{ flex: 1 }}
              onContextCreate={gl => {
                this.onGLContextCreate(gl);
              }}
            />
          </ImageBackground>

          <HomeButton onPressBtn={this.takePicture} />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          type={this.state.type}
          ref={ref => {
            this.camera = ref;
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row'
            }}
          ></View>
        </Camera>
        <HomeButton onPressBtn={this.takePicture} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold'
  },
  camera: {
    flex: 2
  }
});
