import * as FileSystem from 'expo-file-system';
import getEnvVars from '../environment';
import { ERROR_SCREEN } from '../constants/screens.js';
const { kakaoApiKey, aiDataApiKey } = getEnvVars();
const kakaoApi = {
  headers: {
    Authorization: kakaoApiKey
  }
};

const aiDataApi = photoString => {
  return {
    access_key: aiDataApiKey,
    argument: {
      type: 'jpg',
      file: photoString
    }
  };
};

export const subway = 'SW8';
export const hospital = 'HP8';
export const pharmacy = 'PM9';
export const convenientStore = 'CS2';
export const locationCategory = [subway, hospital, pharmacy, convenientStore];

export const getLocationInfo = async (
  longitude,
  latitude,
  category,
  navigation
) => {
  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${category}&y=${latitude}&x=${longitude}&radius=${1000}&page=${1}&sort=distance`,
      kakaoApi
    );
    if (response.status === 200) {
      const responseJson = await response.json();
      return responseJson;
    }
    throw new Error();
  } catch (error) {
    navigation.navigate(ERROR_SCREEN);
  }
};

export const getCurrentAddress = async (longitude, latitude, navigation) => {
  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`,
      kakaoApi
    );

    if (response.status === 200) {
      const responseJson = await response.json();
      return responseJson;
    }
    throw new Error();
  } catch (error) {
    navigation.navigate(ERROR_SCREEN);
  }
};

export const translateWord = async (
  obj,
  nearObj,
  farObj,
  center,
  navigation
) => {
  try {
    const response = await fetch(
      `https://kapi.kakao.com/v1/translation/translate?src_lang=en&target_lang=kr&query=${obj.class}`,
      kakaoApi
    );
    if (response.status === 200) {
      const word = await response.json();
      if (Number(obj.y) + Number(obj.height) > Number(center)) {
        nearObj.push(word.translated_text[0][0]);
      } else {
        farObj.push(word.translated_text[0][0]);
      }
    } else {
      throw new Error();
    }
  } catch (error) {
    navigation.navigate(ERROR_SCREEN);
  }
};

export const getReconizedByAIData = async (uri, navigation) => {
  try {
    const photoString = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64
    });
    const response = await fetch('http://aiopen.etri.re.kr:8000/ObjectDetect', {
      method: 'POST',
      body: JSON.stringify(aiDataApi(photoString))
    });
    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      throw new Error();
    }
  } catch (error) {
    navigation.navigate(ERROR_SCREEN);
  }
};
