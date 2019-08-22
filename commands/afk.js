const Discord = require("discord.js");
const fs = require("fs");
let afk = require("../data/afk.json")

module.exports.run = async (client, message, args) => {
    if (!afk[message.author.id]) {
        message.channel.send("Bien sur __" + message.author.username + "__, **nous activons votre mod \`AFK\`**")
        afk[message.author.id] = true
        fs.writeFile("./data/afk.json", JSON.stringify(afk), (err) => {
            if (err) console.log(err);
        });

    } else {
        message.channel.send("C'est fait, **nous avons retiré votre mod \`AFK\`**. Bon retour parmis nous, " + message.author)
        afk[message.author.id] = undefined
        fs.writeFile("./data/afk.json", JSON.stringify(afk), (err) => {
            if (err) console.log(err);
        });
    }
}

module.exports.help = {
    name: "afk"
}