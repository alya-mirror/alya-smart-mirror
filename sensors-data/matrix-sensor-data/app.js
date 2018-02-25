const uuid = require('uuid/v1');

const AWSIoTClient = require('./utils/AWSIoTClient');
const appConfig = require('./configs/config.defaults');
const awsIoTClient = new AWSIoTClient();
const options = {
  refresh: 1000, //milliseconds between data points
  timeout: 50000 //how long before stopping this sensor
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
    if (message.status === 'failed') {
      showColor('red');
    } else {
      showColor('green');
    }
  });
}

function getMatrixSensorData() {
  console.log('getMatrixSensorData - started');
  const allSensorData = [];
  return showColor('orange')
    .then(() => matrix.sensor('accelerometer', options))
    .then((data) => {
      console.log('accelerometer: ' + data);
      allSensorData.push(data);
    })
    .then(() => matrix.sensor('magnetometer', options))
    .then((data) => {
      console.log('magnetometer: ' + data);
      allSensorData.push(data);
    })
    .then(() => matrix.sensor('temperature', options))
    .then((data) => {
      console.log('temperature: ' + data);
      allSensorData.push(data);
    })
    .then(() => matrix.sensor('pressure', options))
    .then((data) => {
      console.log('pressure: ' + data);
      allSensorData.push(data);
    })
    .then(() => matrix.sensor('gyroscope', options))
    .then((data) => {
      console.log('gyroscope: ' + data);
      allSensorData.push(data);
    })
    .then(() => matrix.sensor('uv', options))
    .then((data) => {
      console.log('uv: ' + data);
      allSensorData.push(data);
    })
    .then(() => matrix.sensor('altitude', options))
    .then((data) => {
      console.log('altitude: ' + data);
      allSensorData.push(data);
    })
    .then(() => matrix.sensor('humidity', options))
    .then((data) => {
      console.log('humidity: ' + data);
      allSensorData.push(data);
    })
    .then(() => sendIAWSIoTMessage('alya-data', {
      dataType: 'matrix-sensor-data',
      status: 'success',
      data: allSensorData
    }))
    .catch((error) => {
      console.log('getMatrixSensorData - something went wrong, error: ' + error);
      sendIAWSIoTMessage('alya-data', {dataType: 'matrix-sensor-data', status: 'failed'});
    });
}

function start() {
  return Promise.resolve()
    .then(() => showColor('cyan'))
    .then(() => awsIoTClient.connect(appConfig.awsIoTConfigs, uuid()))
    .then(() => {
      awsIoTClient.subscribe('alya-commands');
      awsIoTClient.onMessage((topic, payload) => {
        payload = JSON.parse(payload.toString());
        console.log('start - message received', topic, payload);
        switch (topic) {
          case 'alya-commands':
            if (payload.commandType === 'get-matrix-sensor-data') {
              getMatrixSensorData();
            }
            break;
        }
      });
    })
    .catch((error) => {
      console.log('start - something went wrong, error: ' + error);
    })
}

start();