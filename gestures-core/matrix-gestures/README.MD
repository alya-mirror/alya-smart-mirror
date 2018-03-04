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
cd gestures-core
matrix deploy matrix-gestures
```

## Configuring amazon IoT 

Amazon IoT is used to send the events between the mirror and the Matrix creator board.
You need to put your amazon IoT device certificates inside folder `utils/certs`.


## How it works

The matrix board will send events to topic `alya-data` whenever one of the following gestures are detected:

* 'fist' when a hand fist is detected, payload :

```json
{
"dataType": "fist-detected",
"data": {"location":{"x":228,"y":79,"width":133,"height":133},"tag":"HAND_PALM"}
}
```

* 'palm' when a hand palm is detected, payload :

```json
{
"dataType": "palm-detected",
"data": {"location":{"x":228,"y":79,"width":133,"height":133},"tag":"HAND_PALM"}
}
```