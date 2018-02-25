const config = require('../configs/config.defaults');
const AWSIoTClient = require('../utils/AWSIoTClient');
const uuid = require('uuid/v1');

const awsIoTClient = new AWSIoTClient();
awsIoTClient.connect(config.awsIoTConfigs, uuid())
  .then(() => {
    awsIoTClient.subscribe('alya-data');
  });

describe('App', function () {
  this.timeout(120000);
  beforeEach(() => {
  });

  after(() => {
  });

  it("sent get tags request and received tags", (done) => {
    awsIoTClient.publish('alya-commands', {
      commandType: 'matrix-recognition-list-tags'
    }, {}, () => {
      console.log(`message sent to IoT successfully`);
      awsIoTClient.onMessage((topic, payload) => {
        console.log(`topic: ${topic}`);
        console.log(`payload: ${payload}`);
        payload = JSON.parse(payload);
        if (topic === 'alya-data' && payload.dataType === 'matrix-recognition-list-tags') {
          done();
        }
      });
    });
  });
  it("sent reset tag request and received confirmation", (done) => {
    awsIoTClient.publish('alya-commands', {
      commandType: 'matrix-recognition-reset-tag',
      tag: 'alya-test-user'
    }, {}, () => {
      console.log(`message sent to IoT successfully`);
      awsIoTClient.onMessage((topic, payload) => {
        console.log(`topic: ${topic}`);
        console.log(`payload: ${payload}`);
        payload = JSON.parse(payload);
        if (topic === 'alya-data' && payload.dataType === 'matrix-recognition-reset-tag') {
          done();
        }
      });
    });
  });
  it("sent reset all request and received confirmation", (done) => {
    awsIoTClient.publish('alya-commands', {
      commandType: 'matrix-recognition-reset-all'
    }, {}, () => {
      console.log(`message sent to IoT successfully`);
      awsIoTClient.onMessage((topic, payload) => {
        console.log(`topic: ${topic}`);
        console.log(`payload: ${payload}`);
        payload = JSON.parse(payload);
        if (topic === 'alya-data' && payload.dataType === 'matrix-recognition-reset-all') {
          done();
        }
      });
    });
  });
  it("sent train request and received train results", (done) => {
    awsIoTClient.publish('alya-commands', {
      commandType: 'matrix-recognition-train',
      tag: 'alya-test-user'
    }, {}, () => {
      console.log(`message sent to IoT successfully`);
      awsIoTClient.onMessage((topic, payload) => {
        console.log(`topic: ${topic}`);
        console.log(`payload: ${payload}`);
        payload = JSON.parse(payload);
        if (topic === 'alya-data' && payload.dataType === 'matrix-recognition-train') {
          done();
        }
      });
    });
  });
  it("sent recognize request and received confirmation", (done) => {
    awsIoTClient.publish('alya-commands', {
      commandType: 'matrix-recognition-recognize',
      tag: 'alya-test-user'
    }, {}, () => {
      console.log(`message sent to IoT successfully`);
      awsIoTClient.onMessage((topic, payload) => {
        console.log(`topic: ${topic}`);
        console.log(`payload: ${payload}`);
        payload = JSON.parse(payload);
        if (topic === 'alya-data' && payload.dataType === 'matrix-recognition-recognize') {
          done();
        }
      });
    });
  });
});