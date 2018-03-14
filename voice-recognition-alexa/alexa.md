# Alexa on as cloud voice service for alya
Alya can be integrated with Alexa by setting the AVS on the Raspberry Pi.

## General commands to try
Alya will have all the great build in capabilities of alexa like :
* Alexa, sing for me.
* Alexa, give me a joke.
* Alexa, open lizard spock.
* Alexa, sing for me.
* Alexa, how many people live in 'place'?
* Alexa, what was the score of the 'team' game?
* Alexa, will I need an umbrella today?

And it has Many and many other awesome built in commands. For checking the full list of commands [here](https://alexaincanada.ca/alexa-commands-complete-list/).
## Installation 
Installing Alexa to Alya is done simply by integrating the AVS on the Raspberry Pi. Follow the steps provided by Amazon in [alexa-avs-raspberry-pi](https://github.com/alexa/alexa-avs-sample-app/wiki/Raspberry-Pi).
## Wake word
Alexa keyword can be changed from 'Alexa' to 'Alya' which will change the commands to :
* Alya, sing for me.
* Alya, give me a joke.

...

It can also be changed to any name from your choice using [Snowboy](https://github.com/Kitt-AI/snowboy).
Simply by two steps:
* Create your personal hotword model through their [website](https://snowboy.kitt.ai/) or [hotword API](https://snowboy.kitt.ai/api/v1/train/).
* Replace the hotword model in [Alexa AVS sample app](https://github.com/alexa/alexa-avs-sample-app) (after installation) with your personal model.

For more details check [Snowboy-Alexa-support](https://github.com/Kitt-AI/snowboy#alexa-support).