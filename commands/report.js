const Discord = require("discord.js");
const config = require("../config.json");
const channels = require("../data/channels.json");

module.exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.reply("Veuillez utiliser la commande `!e report <Votre Rapport>`");
    }
    const reportchan = client.channels.get(channels[message.guild.id].report);
    var reportMsg = new Discord.RichEmbed()
        .setColor('#' + Math.floor(Math.random() * 16777215).toString(16))
        .setDescription(`**Nouveau report par ${message.author}**\n\n${args.join(" ")}`)
        .setTimestamp()
        .setThumbnail('https://cdn-features.semrush.com/my-reports-illustration.png');
    reportchan.send("Ce message est à destination du <@&444899335793278997>", reportMsg);
    message.delete()
    message.channel.send('Merci pour votre rapport, il a correctement été envoyé. Le Staff va pouvoir le prendre en compte d\'ici peu.')
}
module.exports.help = {
    name: "report"
}