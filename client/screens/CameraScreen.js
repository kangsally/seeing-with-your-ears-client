import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, Modal } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { GLView } from 'expo-gl';
import Expo2DContext from 'expo-2d-context';
import HomeButton from '../components/HomeButton';
import MainButtons from '../components/MainButtons';
import Loading from '../components/Loading';
import InstructionBar from '../components/InstructionBar';
import { translateWord, getReconizedByAIData } from '../api';
import { startTospeak, stopToSpeak } from '../utils';
import { MY_VIEW_TITLE } from '../constants/titles';
import { MAIN_SCREEN } from '../constants/screens';
import {
  makeObjDescrition,
  cameraScreenStartScript,
  noObjectScript
} from '../assets/audioScripts';
import { countBy, identity } from 'lodash';

export default class CamearScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      isCaptured: false,
      photo: null,
      objectData: [],
      script: null,
      onLoad: false
    };
  }

  componentDidMount = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status });
    startTospeak(cameraScreenStartScript);
  };

  componentWillUnmount = () => {
    stopToSpeak();
  };

  onLoad = () => {
    this.setState({
      onLoad: true
    });
  };

  takePicture = async () => {
    const { navigation } = this.props;
    let nearObj = [];
    let farObj = [];
    let script = '';
    let objectData = null;

    stopToSpeak();

    if (this.camera) {
      const photo = await this.camera.takePictureAsync({
        quality: 0.5
      });
      const data = await getReconizedByAIData(photo.uri, navigation);

      objectData = data.return_object.data;

      if (objectData) {
        await Promise.all(
          objectData.map(async obj => {
            await translateWord(
              obj,
              nearObj,
              farObj,
              (photo.height / 3) * 2,
              navigation
            );
          })
        );
        script = makeObjDescrition(
          countBy(nearObj, identity),
          countBy(farObj, identity)
        );
      } else {
        script = noObjectScript;
      }

      this.setState({
        isCaptured: true,
        objectData: objectData,
        photo: photo,
        script: script,
        onLoad: false
      });
      startTospeak(this.state.script);
    }
  };

  onGLContextCreate = async gl => {
    if (this.state.objectData) {
      let ctx = new Expo2DContext(gl);
      await ctx.initializeText();

      const ratioX = Math.abs(ctx.width / this.state.photo.width);
      const ratioY = Math.abs(ctx.height / this.state.photo.height);

      ctx.fillStyle = 'white';
      ctx.font = '60pt sans-serif';

      this.state.objectData.forEach(obj => {
        ctx.fillText(obj.class, obj.x * ratioX, obj.y * ratioY);
      });

      ctx.flush();
    }
  };

  navigateBtn = navigate => {
    const { navigation } = this.props;
    stopToSpeak();
    if (navigate === 'right') {
      navigation.navigate(MAIN_SCREEN);
    } else if (navigate === 'left') {
      this.setState({
        isCaptured: false,
        photo: null,
        objectData: [],
        script: null
      });
      startTospeak(cameraScreenStartScript);
    }
  };

  render() {
    const { hasCameraPermission, onLoad } = this.state;
    if (hasCameraPermission === null) {
      return <Loading />;
    } else if (this.state.isCaptured) {
      return (
        <View style={styles.container}>
          <ImageBackground
            style={styles.photo}
            source={{
              uri: this.state.photo.uri
            }}
            ref={ref => {
              this.photo = ref;
            }}
          >
            <GLView
              style={styles.canvas}
              onContextCreate={gl => {
                this.onGLContextCreate(gl);
              }}
            />
          </ImageBackground>
          <MainButtons onPressBtn={this.navigateBtn} />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          visible={onLoad}
          presentationStyle="fullScreen"
        >
          <Loading />
        </Modal>
        <View style={styles.content}>
          <View style={styles.cameraBox}>
            <Camera
              style={styles.camera}
              type={this.state.type}
              ref={ref => {
                this.camera = ref;
              }}
            />
          </View>
          <InstructionBar content={MY_VIEW_TITLE} />
        </View>
        <HomeButton
          onPressBtn={() => {
            this.onLoad();
            this.takePicture();
          }}
          icon={'camera-iris'}
        />
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
    backgroundColor: '#1A1A1A'
  },
  camera: {
    flex: 2
  },
  photo: {
    flex: 2,
    resizeMode: 'contain'
  },
  canvas: {
    flex: 1
  },
  cameraBox: {
    flex: 8
  }
});
