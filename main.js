const { promises: fs } = require('fs')
const fetch = require('node-fetch')
const Discord = require('discord.js');
const client = new Discord.Client();

let keys
const commands = [
    { command: '$$GME', desc: 'Replace GME with with your favorite stock' },
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

const asMoney = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const main = async () => {
    const fileData = await (await fs.readFile('secret', 'utf8')).trim()
    keys = fileData.split('\n').reduce((prev, curr) => {
        const [key, value] = curr.split(':')
        prev[key] = value
        return prev
    }, {})

    client.on('ready', () => {
        console.log('I am ready!');
    });

    // @TODO(svavs): There is a pattern forming between commands and how messages are invoked
    client.on('message', async message => {

        if(message.content.includes('$$') && message.content.substr(0, 2) !== '$$') {
            const [j1, symsec] = message.content.split('$$')
            const [sym, j2] = symsec.split(' ')
            const { ok, reply } = await getStock(sym)

            if(ok) {
                message.channel.send(reply)
            }

            return    
        }

        if (message.content.substr(0, 2) !== '$$') return

        const uc = message.content.substr(2)
        const ucl = uc.toLowerCase()

        console.log(message.content)

        if (ucl.slice(0, 1) == '^') {
            message.channel.send('Indices are not implemented yet')
        } else if (ucl === 'help') {
            const cons = commands.reduce((prev, curr) => `${prev}\t**${curr.command}:**\t ${curr.desc}\n`, '')
            message.channel.send(`List of commands: \n${cons}`)
        } else {
            const [sym, j3] = uc.split(' ')
            const {ok, reply} = await getStock(sym)

            message.channel.send(reply)
        }
    });

    client.login(keys['DISCORD']);
}

const getStock = async (sym) => {
    try {
        const avurl = `https://cloud.iexapis.com/stable/stock/${escapeHTML(sym)}/quote?token=${keys['IEX']}`
        const data = await fetch(avurl)
        if (!data.ok) {
            return { ok: false, reply: `Unable to locate **${sym}**` }
        }

        const stock = await data.json()
        if (stock.isUSMarketOpen) {
            return { ok: true, reply: `**${sym.toUpperCase()}**: ${asMoney(stock.latestPrice)} (${suffix}${asMoney(stock.change)}) ${moji}` }
        } else {
            const [moji, suffix] = stock.change > 0 ? ['📈', '+'] : ['📉', '']
            return { ok: true, reply: `Premarket data is being worked on...\n**${sym.toUpperCase()}**: ${asMoney(stock.latestPrice)} (${suffix}${asMoney(stock.change)}) ${moji}` }
        }
    } catch (error) {
        console.log(error)
        return { ok: false, reply: 'Oh no, I pooped myself 😞' }
    }

}

(async () => await main())()