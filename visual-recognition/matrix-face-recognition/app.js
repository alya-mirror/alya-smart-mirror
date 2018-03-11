const uuid = require('uuid/v1');

const AWSIoTClient = require('./utils/AWSIoTClient');
const appConfig = require('./configs/config.defaults');
const awsIoTClient = new AWSIoTClient();
let lightingInterval;
const colors = [
  'red',
  'cyan',
  'orange',
  'green'
];

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

function stopRecognitionService() {
  console.log('stop recognition');
  matrix.service('recognition').stop();
  // a workaround to avoid the problem in the matrix os where process.on('message') create duplicates listeners
  // https://github.com/matrix-io/matrix-os/issues/108
  process.removeAllListeners('message');
}

function blink() {
  return Promise.resolve()
    .then(() => matrix.led(colors[Math.floor(Math.random() * colors.length)]).render())
    .then(() => alongtime(2000))
    .then(() => matrix.led('black').render())
}

function showColor(color) {
  return Promise.resolve()
    .then(() => matrix.led(color).render())
    .then(() => alongtime(2000))
    .then(() => matrix.led('black').render())
}

function startLighting() {
  let a = 180;
  let a2 = 0;
  lightingInterval = setInterval(() => {
    matrix.led([{
      arc: Math.round(180 * Math.sin(a)),
      color: 'darkgreen',
      start: a2
    }, {
      arc: -Math.round(180 * Math.sin(a)),
      color: 'darkgreen',
      start: a2 + 180
    }]).render();
    a = (a < 0) ? 180 : a - 0.1;
    //a2 = (a2 > 360) ? 0 : a2 + 5;
  }, 25);
}

function stopLights() {
  clearInterval(lightingInterval);
}

function clear() {
  stopRecognitionService();
  stopLights();
  console.log('clear - completed');
}

function sendIAWSIoTMessage(topic, message) {
  console.log('sendIAWSIoTMessage - send message to aws IoT');
  awsIoTClient.publish(topic, message, {}, function () {
    console.log(`message sent to IoT successfully`);
    if (message.status === 'failed') {
      showColor('red').then(() => clear());
    } else {
      showColor('green').then(() => clear())
    }
  });
}

function listTags() {
  console.log('listTags - started');
  return showColor('orange')
    .then(() => {
      try {
        matrix.service('recognition').getTags()
          .then((data) => {
            sendIAWSIoTMessage('alya-data', {dataType: 'matrix-recognition-list-tags', status: 'success', data: data});
          })
      } catch (error) {
        console.log('listTags - something went wrong, error: ' + error);
        sendIAWSIoTMessage('alya-data', {dataType: 'matrix-recognition-list-tags', status: 'failed'});
      }
    })
}

function resetTag(payload) {
  console.log('resetTag - started, tag:', payload.tag);
  return showColor('orange')
    .then(() => {
      try {
        matrix.service('recognition').untrain(payload.tag);
        sendIAWSIoTMessage('alya-data', {dataType: 'matrix-recognition-reset-tag', status: 'success'});
      } catch (error) {
        console.log('reset tag - something went wrong, error: ' + error);
        sendIAWSIoTMessage('alya-data', {dataType: 'matrix-recognition-reset-tag', status: 'failed'});
      }
    })
}

function train(payload) {
  console.log('train - started, tag:', payload.tag);
  let trained = false;
  return showColor('orange')
    .then(() => {
      try {
        matrix.service('recognition')
          .train(payload.tag)
          .then((data) => {
            console.log('train - train data: ' + JSON.stringify(data));
            if (!trained && data.hasOwnProperty('count')) {
              console.log('training partially done');
              // means it's partially done
              matrix.led({
                arc: Math.round(360 * (data.count / data.target)),
                color: 'blue',
                start: 0
              }).render();
            } else if (!trained) {
              trained = true;
              sendIAWSIoTMessage('alya-data', {dataType: 'matrix-recognition-train', status: 'success', data: data});
            }
          });
        // kill if not trained with a 3 minutes
        setTimeout(() => {
          console.log('killing recognition since it took so much time.')
          clear()
        }, 180000)
      } catch (error) {
        console.log('train - something went wrong, error: ' + error);
        sendIAWSIoTMessage('alya-data', {dataType: 'matrix-recognition-train', status: 'failed'});
      }
    });
}

function recognize(payload) {
  console.log('recognize - started');
  startLighting();
  return showColor('orange')
    .then(() => {
      try {
        matrix.service('recognition')
          .start(payload.tag)
          .then((data) => {
            console.log('recognize - data', data);
            let minDistanceFace = _.values(data.matches);
            minDistanceFace = _.sortBy(minDistanceFace, ['score'])[0];
            if (minDistanceFace.score < 0.85) {
              sendIAWSIoTMessage('alya-data', {
                dataType: 'matrix-recognition-recognize',
                status: 'success',
                data: minDistanceFace.tags[0]
              });
            } else {
              console.log('recognize - not recognized');
              sendIAWSIoTMessage('alya-data', {dataType: 'matrix-recognition-recognize', status: 'failed'});
              stopLights();
            }
          })
      } catch (error) {
        stopLights();
        console.log('recognize - something went wrong, error: ' + error);
        sendIAWSIoTMessage('alya-data', {dataType: 'matrix-recognition-recognize', status: 'failed'});
      }
    })
}

function resetAll() {
  console.log('resetAll - started');
  return showColor('orange')
    .then(() => {
      try {
        matrix.service('recognition').getTags()
          .then((tags) => {
            console.log('resetAll - tags:', JSON.stringify(tags));
            const promises = Object.keys(tags).map((key) => {
              console.log('remove', key);
              return matrix.service('recognition').untrain(tags[key]);
            });
            return Promise.all(promises);
          })
          .then(() => {
            sendIAWSIoTMessage('alya-data', {dataType: 'matrix-recognition-reset-all', status: 'success'});
          })
      } catch (error) {
        console.log('resetAll - something went wrong, error: ' + error);
        sendIAWSIoTMessage('alya-data', {dataType: 'matrix-recognition-reset-all', status: 'failed'});
      }
    })
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
        if (topic === 'alya-commands') {
          switch (payload.commandType) {
            case 'matrix-recognition-list-tags':
              listTags();
              break;
            case 'matrix-recognition-recognize':
              recognize(payload);
              break;
            case 'matrix-recognition-train':
              train(payload);
              break;
            case 'matrix-recognition-reset-tag':
              resetTag(payload);
              break;
            case 'matrix-recognition-reset-all':
              resetAll();
              break;
          }
        }
      });
    })
    .catch((error) => {
      console.log('start - something went wrong, error: ' + error);
    })
}

start();
