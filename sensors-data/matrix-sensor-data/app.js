const uuid = require('uuid/v1');

const AWSIoTClient = require('./utils/AWSIoTClient');
const appConfig = require('./configs/config.defaults');
const awsIoTClient = new AWSIoTClient();
const options = {
  refresh: appConfig.matrixConfig.refresh, //milliseconds between data points
};

function alongtime(n) {
  return new Promise(function (resolve, reject) {
    function loopTillDone() {
      if (n) {
        --n;
        setTimeout(loopTillDone);
      } else {
        resolve();
      }
    }

    loopTillDone();
  });
}

function showColor(color) {
  return Promise.resolve()
    .then(() => matrix.led(color).render())
    .then(() => alongtime(2000))
    .then(() => matrix.led('black').render())
}

function sendIAWSIoTMessage(topic, message) {
  console.log('sendIAWSIoTMessage - send message to aws IoT');
  awsIoTClient.publish(topic, message, {}, function () {
    console.log(`message sent to IoT successfully`);
  });
}

function start() {
  return Promise.resolve()
    .then(() => showColor('cyan'))
    .then(() => awsIoTClient.connect(appConfig.awsIoTConfigs, uuid()))
    .then(() => {
      matrix.sensor('accelerometer', options).then((data) => {
        console.log('accelerometer: ' + JSON.stringify(data));
        sendIAWSIoTMessage('alya-data', {
          dataType: 'matrix-accelerometer',
          status: 'success',
          data: data
        })
      });
      matrix.sensor('magnetometer', options).then((data) => {
        console.log('magnetometer: ' + JSON.stringify(data));
        sendIAWSIoTMessage('alya-data', {
          dataType: 'matrix-magnetometer',
          status: 'success',
          data: data
        })
      });
      matrix.sensor('temperature', options).then((data) => {
        console.log('temperature: ' + JSON.stringify(data));
        sendIAWSIoTMessage('alya-data', {
          dataType: 'matrix-temperature',
          status: 'success',
          data: data
        })
      });
      matrix.sensor('pressure', options).then((data) => {
        console.log('pressure: ' + JSON.stringify(data));
        sendIAWSIoTMessage('alya-data', {
          dataType: 'matrix-pressure',
          status: 'success',
          data: data
        })
      });
      matrix.sensor('gyroscope', options).then((data) => {
        console.log('gyroscope: ' + JSON.stringify(data));
        sendIAWSIoTMessage('alya-data', {
          dataType: 'matrix-gyroscope',
          status: 'success',
          data: data
        })
      });
      matrix.sensor('uv', options).then((data) => {
        console.log('uv: ' + JSON.stringify(data));
        sendIAWSIoTMessage('alya-data', {
          dataType: 'matrix-uv',
          status: 'success',
          data: data
        })
      });
      matrix.sensor('altitude', options).then((data) => {
        console.log('altitude: ' + JSON.stringify(data));
        sendIAWSIoTMessage('alya-data', {
          dataType: 'matrix-altitude',
          status: 'success',
          data: data
        })
      });
      matrix.sensor('humidity', options).then((data) => {
        console.log('humidity: ' + JSON.stringify(data));
        sendIAWSIoTMessage('alya-data', {
          dataType: 'matrix-humidity',
          status: 'success',
          data: data
        })
      });
      matrix.service('face').start().then((data) => {
        console.log('face detected: ' + JSON.stringify(data));
        sendIAWSIoTMessage('alya-data', {
          dataType: 'matrix-face-detected',
          status: 'success',
          data: data
        })
      });
      matrix.service('demographics').start().then((data) => {
        console.log('face demographics: ' + JSON.stringify(data));
        sendIAWSIoTMessage('alya-data', {
          dataType: 'matrix-face-demographics',
          status: 'success',
          data: data
        })
      });
    })
    .catch((error) => {
      console.log('start - something went wrong, error: ' + error);
    })
}

start();