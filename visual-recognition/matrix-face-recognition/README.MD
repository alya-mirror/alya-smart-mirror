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

## How it works

The mirror sends MQTT commands through amazon IoT platform to the matrix board as explained below:

* A command with topic `alya-commands` and payload like:

```json
{
"commandType": "matrix-recognition-recognize",
"tag": "tag to be recognized"
}
```

Command types :

* `matrix-recognition-recognize` and `tag` to be recognized.
* `matrix-recognition-reset-all` to rest all tags.
* `matrix-recognition-reset-tag` and `tag` to be reset. 
* `matrix-recognition-train` and `tag` to be trained.
* `matrix-recognition-list-tags` to list all tags

* Sensor data will be sent to topic `alya-data` and payload like:

```json
"dataType": "matrix-recognition-recognize",
"status": "success",
"data": "{}"
```

Data types:

* `matrix-recognition-recognize` and `data` which is result of recognition.
* `matrix-recognition-reset-all` and `data` which is result of reset.
* `matrix-recognition-reset-tag` and `data` which is result of reset. 
* `matrix-recognition-train` and `data` which is result of training.
* `matrix-recognition-list-tags` and `data` which is result of all tags.