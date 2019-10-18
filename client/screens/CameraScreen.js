import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import HomeButton from '../components/HomeButton';
import { startTospeak, stopToSpeak } from '../utils/utils.js';
import { translateWord } from '../api/index.js';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { GLView } from 'expo-gl';
import Expo2DContext from 'expo-2d-context';

export default class CamearScreen extends Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    isCaptured: false,
    photo: null,
    objDataKr: [],
    objDataEn: [],
  };

  componentDidMount = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({ hasCameraPermission: status === 'granted' });
    const greetText = '나의 시야 촬영화면 입니다.';
    startTospeak(greetText);
  };

  takePicture = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({
        quality: 0.5
      });

      this.setState({
        photo: photo
      });
      const photoString = await FileSystem.readAsStringAsync(photo.uri, {
        encoding: FileSystem.EncodingType.Base64
      });
      const requestJson = {
        access_key: '',
        argument: {
          type: 'jpg',
          file: photoString
        }
      };

      const response = await fetch(
        'http://aiopen.etri.re.kr:8000/ObjectDetect',
        {
          method: 'POST',
          body: JSON.stringify(requestJson)
        }
      );
      const data = await response.json();
      this.setState({
        objDataEn: data.return_object.data,
        isCaptured: true
      })
      // let objData = data.return_object.data.slice();
      // Promise.all(
      //   objData.map(async obj => {
      //     await translateWord(obj);
      //   })
      // ).then(() => {
      //   this.setState({
      //     objDataKr: objData,
      //     isCaptured: true,
      //   });
      // });
    }
  };

  _onGLContextCreate = async (gl, text, color) => {
    var ctx = new Expo2DContext(gl);
    await ctx.initializeText();
    const ratioX = Math.abs(ctx.width/this.state.photo.width);
    const ratioY = Math.abs(ctx.height/this.state.photo.height);

    // ctx.fillStyle = color;
    // ctx.fillRect(0, 0, ctx.width, ctx.height);
    
    this.state.objDataEn.forEach(obj => {
      ctx.fillStyle = 'white';
      ctx.font = 'italic 40pt sans-serif';
      ctx.fillText(obj.class, obj.x*ratioX, obj.y*ratioY);
    })
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
              style={{ flex: 1}}
              onContextCreate={gl => {
                this._onGLContextCreate(gl, 'View 1', 'transparent');
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
