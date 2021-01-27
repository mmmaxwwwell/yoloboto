const { promises: fs } = require('fs')
const fetch = require('node-fetch')
const readline = require('readline')
const Discord = require('discord.js');
const { Console } = require('console');
const client = new Discord.Client();

const main = async () => {
    const fileData = await (await fs.readFile('secret', 'utf8')).trim()
    const keys = fileData.split('\n').reduce((prev, curr) => {
        const [key, value] = curr.split(':')
        prev[key] = value
        return prev
    }, {})

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    //for await (const line of rl) {

    //}
    client.on('ready', () => {
        console.log('I am ready!');
    });

    // Create an event listener for messages
    client.on('message', async message => {
        if (message.content.substr(0, 2) === '$$') {

            const sym = message.content.substr(2)
            try {
                const avurl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=${keys['ALPHA']}&symbol=${sym}`
                const data = await fetch(avurl)
                const stock = await data.json()
                if(stock['Global Quote']['05. price'] === undefined) {
                    message.channel.send(`I can't find **${sym}** 🥺`)
                    return
                }
                const price = Number.parseFloat(stock['Global Quote']['05. price'])
                const change = Number.parseFloat(stock['Global Quote']['09. change'])
                const [moji, suffix] = change > 0 ? ['📈', '+'] : ['📉', '']
                const asMoney = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                message.channel.send(`**${sym.toUpperCase()}**: ${asMoney(price)} (${suffix}${asMoney(change)}) ${moji}`)
            } catch(error) {
                message.channel.send('Oh no, I pooped myself 😞')
            }
        }
    });

    client.login(keys['DISCORD']);
}

(async () => await main())()