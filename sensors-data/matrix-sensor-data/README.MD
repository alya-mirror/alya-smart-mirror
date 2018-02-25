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
cd sensor-data
matrix deploy matrix-sensor-data
```

## Configuring amazon IoT 

Amazon IoT is used to send the events between the mirror and the Matrix creator board.
You need to put your amazon IoT device certificates inside folder `utils/certs`.


## How it works

The mirror sends MQTT commands through amazon IoT platform to the matrix board as explained below:

* A command with topic `alya-commands` and payload like:

```json
{
"commandType": "get-matrix-sensor-data"
}
```

* Sensor data will be sent to topic `alya-data` and payload like:

```json
{
"dataType": "matrix-sensor-data",
"status": "success",
"data": [
          {
             "x":-0.0260009765625,
             "y":-0.93707275390625,
             "z":0.37823486328125,
             "type":"accelerometer"
          },
          {
             "x":-0.001820000004954636,
             "y":0.4118800163269043,
             "z":-0.2692199945449829,
             "type":"magnetometer"
          },
          {
             "value":-2.5122909545898438,
             "type":"temperature"
          },
          {
             "value":95160.5,
             "type":"pressure"
          },
          {
             "yaw":89.37448120117188,
             "pitch":1.3995394706726074,
             "roll":-67.83077239990234,
             "x":2.071075439453125,
             "y":-0.43365478515625,
             "z":-0.530853271484375,
             "type":"gyroscope"
          },
          {
             "value":0,
             "risk":"Low",
             "type":"uv"
          },
          {
             "value":526.25,
             "type":"altitude"
          },
          {
             "value":29.052505493164062,
             "type":"humidity"
          }
        ]
}
```