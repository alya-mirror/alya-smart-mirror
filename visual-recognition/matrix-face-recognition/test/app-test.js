const config = require('../configs/config.defaults');
const AWSIoTClient = require('../utils/AWSIoTClient');
const uuid = require('uuid/v1');

const awsIoTClient  = new AWSIoTClient();
awsIoTClient.connect(config.awsIoTConfigs, uuid())
  .then(() => {
    awsIoTClient.subscribe('recognition-tags');
    awsIoTClient.subscribe('recognition-trained');
    awsIoTClient.subscribe('recognition-resetTag');
    awsIoTClient.subscribe('recognition-resetAll');
    awsIoTClient.subscribe('recognition-trained');
    awsIoTClient.subscribe('recognition-recognized');
  });

describe('App', function () {
  this.timeout(20000);
  beforeEach(() => {
  });

  after(() => {
  });

  it("sent get tags request and received tags", (done) => {
    awsIoTClient.publish("listTags", {
      "message": 'Please list tags'
    }, {}, () => {
      console.log(`message sent to IoT successfully`);
      awsIoTClient.onMessage((topic, payload) => {
        if (topic === 'recognition-tags') {
          console.log(`tags : ${payload}`);
          done();
        }
      });
    });
  });
  it("sent reset tag request and received confirmation", (done) => {
    awsIoTClient.publish("resetTag", {
      message: 'Please start reset for tag',
      tag: 'alya-test-face'
    }, {}, () => {
      console.log(`message sent to IoT successfully`);
      awsIoTClient.onMessage((topic, payload) => {
        if (topic === 'recognition-resetTag') {
          console.log(`resetTag data : ${payload}`);
          done();
        }
      });
    });
  });
  it("sent reset all request and received confirmation", (done) => {
    awsIoTClient.publish("resetAll", {
      message: 'Please start reset all tags'
    }, {}, () => {
      console.log(`message sent to IoT successfully`);
      awsIoTClient.onMessage((topic, payload) => {
        if (topic === 'recognition-resetAll') {
          console.log(`resetTag payload : ${payload}`);
          done();
        }
      });
    });
  });
  it("sent train request and received train results", (done) => {
    awsIoTClient.publish("train", {
      message: 'Please start training for tag',
      tag: 'alya-test-face'
    }, {}, () => {
      console.log(`message sent to IoT successfully`);
      awsIoTClient.onMessage((topic, payload) => {
        if (topic === 'recognition-trained') {
          console.log(`trained data : ${payload}`);
          done();
        }
      });
    });
  });
  it("sent recognize request and received confirmation", (done) => {
    awsIoTClient.publish("recognize", {
      message: 'Please start recognize',
      tag: 'alya-test-face'
    }, {}, () => {
      console.log(`message sent to IoT successfully`);
      awsIoTClient.onMessage((topic, payload) => {
        if (topic === 'recognition-recognized') {
          console.log(`recognized data: ${payload}`);
          done();
        }
      });
    });
  });
});