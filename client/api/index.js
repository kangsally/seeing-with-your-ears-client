const kakaoApi = {
  headers: {
    Authorization: ''
  }
};

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
