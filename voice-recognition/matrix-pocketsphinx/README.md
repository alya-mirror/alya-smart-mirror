# Matrix creator voice recognition

An app that runs inside a raspberry connected to [Matrix creator](https://www.matrix.one/products/creator).
The app will listen to offline commands defined inside `assets/commands.txt` and send the same commands to [Amazon IoT](https://aws.amazon.com/iot/) as events.


## Installation

### Raspbian Dependencies 

``` 
echo "deb http://packages.matrix.one/matrix-creator/ ./" | sudo tee --append /etc/apt/sources.list
sudo apt-get clean
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install matrix-creator-init wiringpi cmake g++ git libzmq3-dev --no-install-recommends
reboot
```

Install matrix-creator-malos-wakeword package and dependencies:

``` 
echo "deb http://unstable-packages.matrix.one/ stable main" | sudo tee -a /etc/apt/sources.list
sudo apt-get update
sudo apt-get install matrix-creator-malos-wakeword --no-install-recommends
sudo reboot
```

Nodejs and npm on RaspberryPi:

``` 
curl -sL https://deb.nodesource.com/setup_6.x | sudo bash -
sudo apt-get install nodejs
```

### Amazon IoT dependency

Please make sure that the amazon IoT service is configured as explained [here](../../README.md).

## Run 

1. clone project:

``` 
git clone https://github.com/alronz/alya-smart-mirror.git
```

2. install packages

- first general dependencies:

```
npm install
```

- then this project dependencies:

```
cd voice-recognition/matrix-pocketsphinx
npm install
```

3. generate assets

 ``` 
  npm install -g https://github.com/matrix-io/lmtool-cli.git
  lmtool assets/commands.txt
  tar xf <generated_file>.tgz -C assets
  ```

4. change assets path in `config.defaults.json` :

```json
{
  "lmFileName": "1161.lm",
  "dicFileName": "1161.dic"
}
```

5. start:

```
node index.js
```

say some voice commands: `alya hi` for example:


## Add more commands

1. Add commands to `assets/commands.txt`, smth like this: 

  ``` nodejs
  alya stop
  alya start
  alya next
  alya previous
  ```

2. generate assets :

  ``` 
  npm install -g https://github.com/matrix-io/lmtool-cli.git
  lmtool assets/commands.txt
  tar xf <generated_file>.tgz -C assets
  ```
  
3- change the corresponding names inside `config.defaults.json` :

```json
{
  "lmFileName": "1161.lm",
  "dicFileName": "1161.dic"
}
```