const Discord = require("discord.js");
const fs = require("fs");
var channels = require("../data/channels")

module.exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('BAN_MEMBERS')) return message.reply("Vous n'avez pas la permission d'effectuer cette commande !");

    if (args[0] === "blagues" || args[0] === "justeprix" || args[0] === "motscachés" || args[0] === "pendu" || args[0] === "réponses" || args[0] === "report" || args[0] === "logs") {
        try {
            var channel_id = args[1].slice(2, 20)
            var channel = client.channels.get(channel_id)
            if (!channel) {
                return message.reply("Veuillez entrer un salon valide");
            }
        } catch (err) {
            return message.reply("Veuillez entrer un salon valide");
        }

        var server_id = message.guild.id

        message.reply("Sauvegarde du salon " + channel + " pour le jeu " + args[0])

        var jeu = args[0]

        if (!channels[server_id]) {
            console.log("undefined !")
            channels[server_id] = {
                [jeu]: channel_id
            }
        } else {
            channels[server_id][jeu] = channel_id
            console.log("changé !!")
        }

        fs.writeFile("./data/channels.json", JSON.stringify(channels), (err) => {
            if (err) console.log(err);
        });

        console.log(channel_id)
    } else return message.reply("veillez entrer une option valide: **!e channel \`blagues\`/\`justeprix\`/\`motscachés\`/\`pendu\`/\`réponses\`/\`report\`/\`logs\` #salon**");
}

module.exports.help = {
    name: "channel"
}