// This is how we connect to the creator. IP and port.
// The IP is the IP I'm using and you need to edit it.
// By default, MALOS has its 0MQ ports open to the world.

// Every device is identified by a base port. Then the mapping works
// as follows:
// BasePort     => Configuration port. Used to config the device.
// BasePort + 1 => Keepalive port. Send pings to this port.
// BasePort + 2 => Error port. Receive errros from device.
// BasePort + 3 => Data port. Receive data from device.

const creator_ip = process.env.CREATOR_IP || '127.0.0.1';
const creator_wakeword_base_port = 60001;
const creator_everloop_base_port = 20013 + 8; // port for Everloop driver.
// Packaged Protocol buffers
const matrix_io = require('matrix-protos').matrix_io;
const zmq = require('zmq');


const config = require('./config.defaults');
const LM_PATH = __dirname + `/assets/${config.lmFileName}`;
const DIC_PATH = __dirname + `/assets/${config.dicFileName}`;

const path = require('path');
const certsFolderPath = path.resolve('../../certs');
const AWSIoTClient = require('../../utils/AWSIoTClient');
const appConfig = require('../../configs/config.defaults');
const awsIoTClient = new AWSIoTClient();
awsIoTClient.connect(appConfig.awsIoTConfigs, certsFolderPath).then(() => {
  console.log("connection to amazon IoT established.")
});

const configSocket = zmq.socket('push');
configSocket.connect('tcp://' + creator_ip + ':' + creator_wakeword_base_port /* config */);

// ********** Start error management.
const errorSocket = zmq.socket('sub');
errorSocket.connect('tcp://' + creator_ip + ':' + (creator_wakeword_base_port + 2));
errorSocket.subscribe('');
errorSocket.on('message', function (error_message) {
  process.stdout.write('Received Wakeword error: ' + error_message.toString('utf8') + "\n");
});

// ********** End error management.

/**************************************
 * start/stop service functions
 **************************************/

function startWakeUpRecognition() {
  console.log('<== config wakeword recognition..');
  const wakeword_config = matrix_io.malos.v1.io.WakeWordParams.create({
    wakeWord: 'ALYA',
    lmPath: LM_PATH,
    dicPath: DIC_PATH,
    channel: matrix_io.malos.v1.io.WakeWordParams.MicChannel.channel8,
    enableVerbose: false
  });

  sendConfigProto(wakeword_config);
}

function stopWakeUpRecognition() {
  console.log('<== stop wakeword recognition..');
  const wakeword_config = matrix_io.malos.v1.io.WakeWordParams.create({stopRecognition: true});
  sendConfigProto(wakeword_config);
}

/**************************************
 * Register wakeword callbacks
 **************************************/

const updateSocket = zmq.socket('sub');
updateSocket.connect('tcp://' + creator_ip + ':' + (creator_wakeword_base_port + 3));
updateSocket.subscribe('');

updateSocket.on('message', function (wakeword_buffer) {
  const wakeWordData = matrix_io.malos.v1.io.WakeWordParams.decode(wakeword_buffer);
  console.log('==> WakeWord Reached:', wakeWordData.wakeWord);

  // show that command received using everloop
  setEverloop(0, 25, 255, 0, 0.05);
  setTimeout(function () {
    setEverloop(0, 0, 0, 0, 0);
  }, 1000);

  // send to amazon IoT
  awsIoTClient.publish("voice-command", {
    "command": wakeWordData.wakeWord
  }, {}, function () {
    console.log(`message sent to IoT successfully, message: ${wakeWordData.wakeWord}`)
  });
});

/**************************************
 * Everloop Ring LEDs handler
 **************************************/

const ledsConfigSocket = zmq.socket('push');
ledsConfigSocket.connect('tcp://' + creator_ip + ':' + creator_everloop_base_port /* config */);

function setEverloop(r, g, b, w, i) {
  const image = matrix_io.malos.v1.io.EverloopImage.create();
  for (let j = 0; j < 35; ++j) {
    const ledValue = matrix_io.malos.v1.io.LedValue.create({
      red: Math.round(r * i),
      green: Math.round(g * i),
      blue: Math.round(b * i),
      white: Math.round(w * i)
    });
    image.led.push(ledValue)
  }
  const config = matrix_io.malos.v1.driver.DriverConfig.create({
    image: image
  });

  // Send the configuration
  ledsConfigSocket.send(matrix_io.malos.v1.driver.DriverConfig.encode(config).finish());
}

/**************************************
 * sendConfigProto: build Proto message
 **************************************/

function sendConfigProto(cfg) {
  const config = matrix_io.malos.v1.driver.DriverConfig.create({wakeword: cfg});
  const serialized = JSON.stringify(matrix_io.malos.v1.driver.DriverConfig.toObject(config));
  console.log("==> sending conf ", serialized);
  configSocket.send(matrix_io.malos.v1.driver.DriverConfig.encode(config).finish())
}

/**********************************************
 ****************** MAIN **********************
 **********************************************/

startWakeUpRecognition();


