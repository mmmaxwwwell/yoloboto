const { promises: fs } = require('fs')
const fetch = require('node-fetch')
const Discord = require('discord.js');
const client = new Discord.Client();

const commands = [
    { command: '$$GME', desc: 'Replace GME with with your favorite stock' },
]

const indices = [
    { idx: 'DJI', desc: 'Dow Jones Industrial Average' },
    { idx: 'IXIC', desc: 'NASDAQ' },
    { idx: 'INX', desc: 'S&P500' },
]

// https://stackoverflow.com/questions/40263803/native-javascript-or-es6-way-to-encode-and-decode-html-entities 
// JavaScript is the future - this is fine...
const escapeHTML = str => str.replace(/[&<>'"]/g, 
  tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));

const stonkDays = [...Array(5).keys()].map(i => i + 1) // [1...6] is too much for the ECMAS folks
const asMoney = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const main = async () => {
    const fileData = await (await fs.readFile('secret', 'utf8')).trim()
    const keys = fileData.split('\n').reduce((prev, curr) => {
        const [key, value] = curr.split(':')
        prev[key] = value
        return prev
    }, {})

    client.on('ready', () => {
        console.log('I am ready!');
    });

    // @TODO(svavs): There is a pattern forming between commands and how messages are invoked
    client.on('message', async message => {
        if (message.content.substr(0, 2) !== '$$') return

        const uc = message.content.substr(2)
        const ucl = uc.toLowerCase()
        if(ucl.slice(0,1) == '^') { 
            message.channel.send('Indices are not implemented yet')
            return
        } else if (ucl === 'help') {
            const cons = commands.reduce((prev, curr) => `${prev}\t**${curr.command}:**\t ${curr.desc}\n`, '')
            message.channel.send(`List of commands: \n${cons}`)
            return
        } else if (ucl === 'market') {
            if (stonkDays.includes(new Date(Date.now()).getDay())) {
                // TODO(svavs): We need to check to see if the time is right: 9 - 5pm
                // TODO(svavs): There should be an easier way to check this - holidays ARE a thing, calgen
                message.channel.send(`Markets were open today at some point or now 🤷‍♂️`)
                return
            } else {
                message.channel.send(`Market is opening EVENTUALLY CHAD`)
            }
        } else {
            try {
                const avurl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=${keys['ALPHA']}&symbol=${escapeHTML(uc)}`
                const data = await fetch(avurl)
                const stock = (await data.json())['Global Quote'] || {}
                if (stock['05. price'] === undefined) {
                    message.channel.send(`Unable to locate **${uc}**`)
                    return
                }

                const price = Number.parseFloat(stock['05. price'])
                const change = Number.parseFloat(stock['09. change'])
                const [moji, suffix] = change > 0 ? ['📈', '+'] : ['📉', '']
                message.channel.send(`**${uc.toUpperCase()}**: ${asMoney(price)} (${suffix}${asMoney(change)}) ${moji}`)
            } catch (error) {
                message.channel.send('Oh no, I pooped myself 😞')
                console.log(error)
            }

            return
        }
    });

    client.login(keys['DISCORD']);
}

(async () => await main())()