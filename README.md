# YOLO BOTo

A simple stock bot for discord.

## Prerequisites

* Docker
* Docker Compose

## Running the bot using a locally generated image

1. Rename ```settings.example``` to ```settings```
2. Replace the IEX and DISCORD values in ```./settings/yoloboto.env```
3. Run ```sudo docker-compose build && sudo docker-compose up```

## Running the bot using an image from dockerhub
1. Rename ```settings.example``` to ```settings```
2. Replace the IEX and DISCORD values in ```./settings/yoloboto.env```
3. In ```docker-compose.yml```, ensure services.yolobot.image is uncommented, and services.yoloboto.build and all children are commented out
4. Run ```sudo docker-compose up```

## Stopping the bot

* Run ```sudo docker-compose stop```

## Destroying the container

* Run ```sudo docker-compose down```

## Interaction 

 * ```$$help``` will show commands
 * ```$$<symbol>``` will get that stock and if it cannot find it, it will let you know 
 * ```Some message $$<symbol> the rest``` will attempt to get the stock information, if it fails to find the symbol, it will not respond