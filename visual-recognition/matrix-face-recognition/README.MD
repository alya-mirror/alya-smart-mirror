This is your app folder. Please only change app.js and config.yaml.

Do not modify index.js.

You may add packages via `npm`, they will be installed when the application is deployed to a device. 

## Developer Documentation

http://github.io/matrix-io/matrix-documentation/


## Run

This app needs to be deployed in a raspberry connected to a matrix creator one.

Please follow the steps here to create or deploy applications on Matrix OS:

https://matrix-io.github.io/matrix-documentation/matrix-os/examples/app-create/

Prerequisites :

https://matrix-io.github.io/matrix-documentation/matrix-os/getting-started/installation/

Then deploy the app :

```
git clone https://github.com/alronz/alya-smart-mirror.git
cd visual-recognition
matrix deploy matrix-face-recognition
```

## Configuring amazon IoT 

Amazon IoT is used to send the events between the mirror and the Matrix creator board.
You need to put your amazon IoT device certificates inside folder `utils/certs`.


## How it works

The mirror sends MQTT commands through amazon IoT platform to the matrix board as explained below:

* A command with topic `train` and payload `{tag: 'tag to be trained'}`:

The matrix will reply with MQTT event with topic `recognition-trained` and payload `{status: 'success', results: data}` or  `{status: 'failed'}`.

* A command with topic `recognize` and payload `{tag: 'tag to be recognized'}`

The matrix will reply with MQTT event with topic `recognition-recognized` and payload `{status: 'success', results: data}` or  `{status: 'failed'}`.

* A command with topic `resetTag` and payload `{tag: 'tag to be reset'}`

The matrix will reply with MQTT event with topic `recognition-resetTag` and payload `{status: 'success', tags: data}` or  `{status: 'failed'}`.

* A command with topic `resetAll` to rest all recognized tags.

The matrix will reply with MQTT event with topic `recognition-resetAll` and payload `{status: 'success'}` or  `{status: 'failed'}`.

* A command with topic `listTags` to list all recognized tags.

The matrix will reply with MQTT event with topic `recognition-tags` and payload `{status: 'success', tags: data}` or  `{status: 'failed'}`.