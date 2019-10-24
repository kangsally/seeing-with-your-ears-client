import { forEach } from 'lodash';

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

const getDirection = direction => directions[direction];

const changeNumberToscript = (num, data) => {
  if (num <= 10) {
    return data[num];
  } else {
    return data[11];
  }
};

export const tutorialScreenStartScript =
  '안녕하세요 귀로입니다. 귀로는 청각으로 나의 위치 정보와 시야 정보를 들을 수 있는 어플리케이션입니다. 튜토리얼을 진행하겠습니다. 스크린 하단 3분의 1지점에 버튼이 있으며, 왼쪽과 오른쪽 두개 버튼 또는 중앙버튼이 하나 있습니다. 왼쪽버튼을 눌러주세요';
export const tutorialEndScripit =
  '튜토리얼을 완료하셨습니다. 다음에 앱을 실행하실때도 튜토리얼을 들으시려면 왼쪽 버튼을 눌러주세요. 다음에 앱을 실행하실때 튜토리얼을 원하지 않으시면 오른쪽 버튼을 눌러주세요.';
export const mainScreenStartScript =
  '나의 위치를 들으시려면 왼쪽버튼, 나의 시야를 들으시려면 오른쪽버튼을 눌러주세요.';
export const locationScreenStartScript =
  '나의 위치를 안내해드리겠습니다. 나의 현재 위치는 ';
export const cameraScreenStartScript =
  '나의 시야 촬영화면 입니다. 카메라를 눈높이에 맞춘 후 중앙버튼을 눌러주세요';
export const errorScreenStartScript =
  '죄송합니다. 정보를 받아올 수 없습니다. 메인페이지로 가시려면 중앙버튼을 눌러주세요.';
export const introScript = '귀로를 시작합니다.';
export const noObjectScript =
  '인식된 객체가 없습니다. 다시 촬영하시려면 왼쪽버튼, 시작화면으로 가시려면 오른쪽 버튼을 눌러주세요.';
export const loadingScript = '잠시만 기다려주세요.';
export const permissionAskScript = '카메라 및 위치 접근허용을 해주십시오.';
export const permissionErrorScript =
  '카메라 및 위치 허용을 안하시면 더 이상 진행하실 수 없습니다.';

export const makeErrorMessage = direction =>
  `잘못 누르셨습니다. ${getDirection(
    direction === 'left' ? 'right' : 'left'
  )}버튼을 눌러주세요.`;

export const makeSuccessMessage = direction =>
  `잘하셨습니다. ${getDirection(
    direction === 'right' ? 'center' : 'right'
  )}버튼을 눌러주세요.`;

export const makeTutorialCheckMessage = direction =>
  `${
    direction === 'right'
      ? '다음에는 튜토리얼을 진행하지 않겠습니다.'
      : '다음에도 튜토리얼을 진행하겠습니다.'
  } 귀로를 시작하시려면 중앙버튼을 눌러주세요`;

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

  script +=
    '다시 촬영하시려면 왼쪽버튼, 시작화면으로 가시려면 오른쪽 버튼을 눌러주세요.';

  return script;
};

export const makePlaceInfoScript = (places, longitude, latitude) => {
  let script = '반경 1km내 가장 가까운 장소정보를 안내해드리겠습니다. ';
  let placeList = [];
  places.forEach(place => {
    const { documents } = place;
    const info = documents[0];
    if (documents.length !== 0) {
      info.category_group_name
        ? (script += info.category_group_name + '은 ')
        : (script += ' ');
      info.place_name ? (script += info.place_name + ' ') : (script += ' ');
      info.y > latitude ? (script += '북') : (script += '남');
      info.x > longitude ? (script += '동') : (script += '서');
      script += '쪽 ';
      info.distance
        ? (script += info.distance + '미터 거리에 있습니다. ')
        : (script += '에 있습니다. ');
      placeList.push(info);
    }
  });
  script +=
    '다시 들으시려면 왼쪽버튼, 시작화면으로 가시려면 오른쪽 버튼을 눌러주세요.';
  return { script: script, placeList: placeList };
};

export const makeLocationScreenScript = (currentAddress, placeInfo) =>
  '나의 위치를 안내해드리겠습니다. 나의 현재 위치는 ' +
  currentAddress +
  '입니다. ' +
  placeInfo;
