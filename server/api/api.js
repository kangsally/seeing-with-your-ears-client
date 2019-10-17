const axios = require('axios');

const api = axios.create({
  headers: {
    'Authorization': ''
  }
});

exports.translateWord = (obj) => {
  return api.get(
    `https://kapi.kakao.com/v1/translation/translate?src_lang=en&target_lang=kr&query=${obj.class}`
  ).then(word => {
    obj.class = word.data.translated_text[0][0];
  })
};
