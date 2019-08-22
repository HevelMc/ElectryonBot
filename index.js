//init
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const token = require("./token.json");
const fs = require('fs');
let afk = require("./afk.json")
let prefix = config.prefix;
client.commands = new Discord.Collection();
const Aliases = {
    '!j': 'joke',
    '!jp': 'justeprix',
    '!hw': 'hideword',
    '!p': 'pendu',
    '!h': 'help'
};

fs.readdir("./commands", (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        return console.log("Je ne trouve aucune commande !");
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} lancé!`)
        client.commands.set(props.help.name, props);
    })

})

client.on('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}!`);
    client.user.setActivity(`Pendre de pauvres petits stickmans`);
});

//commands

client.on("message", async message => {

    if (message.author.bot) return;

    if (afk[message.author.id] === true) {
        if (!message.content.includes("!e ")) {
            message.channel.send(`Oh, heureux de vous re-voir **${message.author.username}**. \nAu fait, votre Mod \`AFK\` est toujours activé, n'hésitez pas à le retirer avec la commande \`!e afk\`.`).then(msg => msg.delete(10000))
        }
    }

    mentions = message.mentions.users;

    if (mentions !== null) {
        mentions.forEach(function (user) {
            if (afk[user.id] === true) {
                if (message.author.id !== user.id) {
                    message.reply(`Désolé, **${user.username}** est actuellement \`AFK\`, veuillez attendre son retour.`);
                }
            }
        });
    }
    // if (message.content.includes(afk))
    // afk.forEach(function (item, index) {
    //     // message.channel.reply("<@" + index + ">")
    //     if (message.content.includes("<@" + index + ">")) {
    //         message.delete(1)
    //         message.channel.send(':grin:')
    //     }
    // })

    let messageWithoutPrefix = message.content.split(prefix);
    let messageArray = messageWithoutPrefix.join('').split(" ");

    if (message.channel.type === "dm") return;
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let msgcont = message.content;

    if (msgcont in Aliases) {

        let commandFile = client.commands.get(Aliases[msgcont]);
        if (commandFile) commandFile.run(client, message, args);

        return;

    } else if (message.content.includes("!e ") === false) {

        return;

    } else {

        let commandFile = client.commands.get(cmd);
        if (commandFile) commandFile.run(client, message, args);

        //ping command
        if (cmd === "ping") {
            const m = await message.channel.send("Ping?");
            m.edit(`**Pong!** la latence est de \`${m.createdTimestamp - message.createdTimestamp}\`ms. la latence de l'API est de \`${Math.round(client.ping)}\`ms`);
        }

        //justeprixstop
        if (cmd === "justeprixstop") var justeprix_encours = undefined;

        if (cmd === "jpt") Level.test(message);

    };
});

client.on('messageReactionAdd', (reaction, user) => {
    if (user.bot) return;
	if (reaction.emoji.name === '🔁') {
        if (message.channel.id === config.penduid) {
            message.reply("Restarting game.")
        }
    };
});

client.login(token.token);