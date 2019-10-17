import * as Speech from 'expo-speech';

export const startTospeak = thingTosay => {
  Speech.speak(thingTosay);
};

export const stopToSpeak = () => {
  Speech.stop();
};

export const makePlaceInfoScript = (places, longitude, latitude) => {
  const blank = ' ';
  let script = '반경 1km내 가장 가까운 장소정보입니다.' + blank;
  let placeList = [];
  places.forEach(place => {
    const { documents } = place;
    const info = documents[0];
    if (documents.length !== 0) {
      info.category_group_name
        ? (script += info.category_group_name + '은' + blank)
        : (script += blank);
      info.place_name ? (script += info.place_name + blank) : (script += blank);
      info.y > latitude ? (script += '북') : (script += '남');
      info.x > longitude ? (script += '동') : (script += '서');
      script += '쪽' + blank;
      info.distance
        ? (script += info.distance + '미터 거리에 있습니다.' + blank)
        : (script += '에 있습니다.' + blank);
      placeList.push(info);
    }
  });
  return { script: script, placeList: placeList };
};
