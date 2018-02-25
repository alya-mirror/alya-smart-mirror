const config = require('../configs/config.defaults');
const AWSIoTClient = require('../utils/AWSIoTClient');
const uuid = require('uuid/v1');

const awsIoTClient = new AWSIoTClient();
awsIoTClient.connect(config.awsIoTConfigs, uuid())
  .then(() => {
    awsIoTClient.subscribe('alya-data');
  });

describe('App', function () {
  this.timeout(60000);
  beforeEach(() => {
  });

  after(() => {
  });

  it("sent get matrix sensor data command", (done) => {
    awsIoTClient.publish('alya-commands', {
      commandType: 'get-matrix-sensor-data'
    }, {}, () => {
      console.log(`message sent to IoT successfully`);
      awsIoTClient.onMessage((topic, payload) => {
        console.log(`payload : ${payload}`);
        console.log(`topic : ${topic}`);
        payload = JSON.parse(payload);
        if (topic === 'alya-data' && payload.dataType === 'matrix-sensor-data') {
          done();
        }
      });
    });
  });
});