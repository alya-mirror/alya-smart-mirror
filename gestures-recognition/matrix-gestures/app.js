const uuid = require('uuid/v1');

const AWSIoTClient = require('./utils/AWSIoTClient');
const appConfig = require('./configs/config.defaults');
const awsIoTClient = new AWSIoTClient();

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

function start() {
  return Promise.resolve()
    .then(() => showColor('cyan'))
    .then(() => awsIoTClient.connect(appConfig.awsIoTConfigs, uuid()))
    .then(() => {
      console.log('starting gesture engine');
      try {
        matrix.service('palm').start().then((data) => {
          showColor('green');
          sendIAWSIoTMessage('alya-data', {dataType: 'matrix-palm-detected', data: JSON.stringify(data)});
        });
        matrix.service('fist').start().then((data) => {
          showColor('green');
          sendIAWSIoTMessage('alya-data', {dataType: 'matrix-fist-detected', data: JSON.stringify(data)});
        });
      } catch (error) {
        console.log('start - something went wrong, error: ' + error);
        showColor('red');
      }
    })
    .catch((error) => {
      console.log('start - something went wrong, error: ' + error);
      showColor('red');
    })
}

start();
