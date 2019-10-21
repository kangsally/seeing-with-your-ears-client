import { forEach } from 'lodash';

export const intro =
  '귀로 튜토리얼입니다. 스크린 하단 3분의 1지점에 버튼이 있으며, 해당 버튼은 중앙버튼 한개인 경우와 왼쪽과 오른쪽버튼 두개인 경우가 있습니다.';
export const pressLeft = '왼쪽버튼을 눌러주세요.';
export const pressRight = '오른쪽버튼을 눌러주세요.';
export const pressCenter = '중앙버튼을 눌러주세요.';
export const excellent = '잘하셨습니다.';
export const error = '잘못누르셨습니다.';
export const end =
  '귀로를 시작하시려면 오른쪽 버튼을 눌러주세요. 다시 튜토리얼을 진행하시려면 왼쪽 버튼을 눌러주세요.';
export const blank = ' ';

const directions = {
  left: '왼쪽',
  right: '오른쪽',
  center: '중앙'
};

const numbers = {
  1: '하나',
  2: '둘',
  3: '셋',
  4: '넷',
  5: '다섯',
  6: '여섯',
  7: '일곱',
  8: '여덟',
  9: '아홉',
  10: '열',
  11: '열개 이상'
};

export const wordToKR = direction => directions[direction];
export const errorMessageToKR = direction =>
  `잘못 누르셨습니다. ${wordToKR(
    direction === 'left' ? 'right' : 'left'
  )}버튼을 눌러주세요.`;
export const successMessageToKR = direction =>
  `잘하셨습니다. ${wordToKR(direction)}버튼을 눌러주세요.`;

const changeNumberToscript = (num, data) => {
  if (num <= 10) {
    return data[num];
  } else {
    return data[11];
  }
};

export const makeObjDescrition = (nearObj, farObj) => {
  let script = '';
  if (Object.keys(nearObj).length !== 0) {
    script += '귀하의 가까운 시야에는 ';
    forEach(nearObj, (value, key) => {
      script += `${key} `;
      script += changeNumberToscript(Number(value), numbers) + ', ';
    });
    script += '있습니다. ';
  }

  if (Object.keys(farObj).length !== 0) {
    script += '귀하의 먼 시야에는 ';
    forEach(farObj, (value, key) => {
      script += `${key} `;
      script += changeNumberToscript(Number(value), numbers) + ', ';
    });
    script += '있습니다. ';
  }

  if (script === '') {
    script += '인식된 객체가 없습니다.';
  }

  return script;
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