'use strict';

const awsIot = require("aws-iot-device-sdk");

class IOTClient {

  connect(configs, certsFolderPath) {
    return new Promise((resolve, reject) => {
      this.device = awsIot.device({
        keyPath: `${certsFolderPath}/${configs.keyFileName}`,
        certPath: `${certsFolderPath}/${configs.certFileName}`,
        caPath: `${certsFolderPath}/${configs.caFileName}`,
        clientId: configs.clientId,
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

  subscribe(topic, options, listenerFunction, caller) {
    this.device.subscribe(topic, options, () => {
      console.log("Subscribed: " + topic);
      this.device.on('message', (topic, payload) => {
        listenerFunction(topic, payload, caller);
      });
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