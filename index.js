//init
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const fs = require('fs');
let prefix = config.prefix;
client.commands = new Discord.Collection();
const Aliases = {'!j' : 'joke', '!jp' : 'justeprix', '!hw' : 'hideword'};

fs.readdir("./commands", (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0) {
        return console.log("Je ne trouve aucune commande !");
    }

    jsfile.forEach((f, i) =>{
        let props = require(`./commands/${f}`);
        console.log(`${f} lancé!`)
        client.commands.set(props.help.name, props);
    })

})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`Animer le Juste-Prix comme Vincent Lagaf'`);
});

//commands

client.on("message", async message => {

    let messageWithoutPrefix = message.content.split(prefix);
    let messageArray = messageWithoutPrefix.join('').split(" ");

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let msgcont = message.content;

    if (msgcont in Aliases) {

        let commandFile = client.commands.get(Aliases[msgcont]);
        console.log(commandFile);
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

    };
});

client.login('NDM5NzgzMzc4MDMyNzg3NDY2.XSt7QQ.Lk7kbHw_O7m8PlWBLY2GHRku-QM');
