'use strict';

const awsIot = require("aws-iot-device-sdk");

class IOTClient {

  connect(configs, clientId) {
    return new Promise((resolve, reject) => {
      this.device = awsIot.device({
        keyPath: `${__dirname}/certs/${configs.keyFileName}`,
        certPath: `${__dirname}/certs/${configs.certFileName}`,
        caPath: `${__dirname}/certs/${configs.caFileName}`,
        clientId: clientId || configs.clientId,
        region: configs.region,
        host: configs.host
      });

      this.device.on("connect", () => {
        console.log("Connected to AWS IoT");
        resolve();
      });
      this.device.on('error', (error) => {
        console.log('error', error);
      });
      this.device.on('reconnect', () => {
        console.log('reconnect');
      });
      this.device.on('offline', () => {
        console.log('offline');
      });
    });
  }

  subscribe(topic, options) {
    this.device.subscribe(topic, options, () => {
      console.log("Subscribed: " + topic);
    });
  }

  unsubscribe(topic, options) {
    this.device.unsubscribe(topic, options, () => {
      console.log("UnSubscribed: " + topic);
    });
  }

  onMessage(listenerFunction) {
    this.device.on('message', (topic, payload) => {
      listenerFunction(topic, payload);
    });
  }

  publish(topic, message, options, callback) {
    this.device.publish(topic, JSON.stringify(message), options, (err) => {
      if (!err) {
        console.log("published successfully: " + topic);
      }
      callback(err);
    });
  }

  disconnect() {
    this.device.end();
  }

}

module.exports = IOTClient;