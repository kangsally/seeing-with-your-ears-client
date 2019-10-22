import * as FileSystem from 'expo-file-system';
import getEnvVars from '../environment';
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
  }
}

export async function getLocationInfo(longitude, latitude, category) {
  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${category}&y=${latitude}&x=${longitude}&radius=${1000}&page=${1}&sort=distance`,
      kakaoApi
    );
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentAddress(longitude, latitude) {
  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`,
      kakaoApi
    );
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
}

export async function translateWord(obj, nearObj, farObj, center) {
  try {
    const response = await fetch(
      `https://kapi.kakao.com/v1/translation/translate?src_lang=en&target_lang=kr&query=${obj.class}`,
      kakaoApi
    );
    const word = await response.json();
    if (Number(obj.y) + Number(obj.height) > Number(center)) {
      nearObj.push(word.translated_text[0][0]);
    } else {
      farObj.push(word.translated_text[0][0]);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getReconizedByAIData (uri){
  const photoString = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64
  });
  const response = await fetch(
    'http://aiopen.etri.re.kr:8000/ObjectDetect',
    {
      method: 'POST',
      body: JSON.stringify(aiDataApi(photoString))
    }
  );
  
  const data = await response.json();
    return data;
}
