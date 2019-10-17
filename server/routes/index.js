const express = require('express');
const router = express.Router();
const fs = require('fs');
const request = require('request');
const openApiURL = 'http://aiopen.etri.re.kr:8000/ObjectDetect';
const accessKey = '';
const { translateWord } = require('../api/api.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  const imageData = fs.readFileSync(req.file.path);
  const requestJson = {
    access_key: accessKey,
    argument: {
      type: 'jpg',
      file: imageData.toString('base64')
    }
  };

  const options = {
    url: openApiURL,
    body: JSON.stringify(requestJson),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
  };

  request.post(options, function(error, response, body) {
    let objData = JSON.parse(body).return_object.data.slice();
    Promise.all(
      objData.map(async obj => {
        await translateWord(obj);
      })
    ).then(() => {
      res.send({
        result: 'ok'
      });
    });
  });
});

module.exports = router;
