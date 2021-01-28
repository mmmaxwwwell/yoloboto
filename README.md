# YOLO BOTo

A simple stock bot for discord.

## Running the Bot

Make sure you have a secrets file with:

```
IEX:<KEY>
DISCORD:<KEY>
```

Then run:

```console
$ npm i
$ npm start
```

## Interaction 

 * ```$$help``` will show commands
 * ```$$<symbol>``` will get that stock and if it cannot find it, it will let you know 
 * ```Some message $$<symbol> the rest``` will attempt to get the stock information, if it fails to find the symbol, it will not respond