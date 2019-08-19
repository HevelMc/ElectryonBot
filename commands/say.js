const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_CHANNELS'))
        return message.reply("Vous n'avez pas la permission d'envoyer des messages à l'aide du bot !")

    message.delete().catch(O_o => {});

    if (args !== 0) {
        var sayMessage = args.join(" ");
        message.channel.send(sayMessage);
    }


    var Attachment = (message.attachments).array();
    Attachment.forEach(function(attachment) {
        message.channel.send({
            files: [attachment.url]
        })
    })

    //log
    const logchan = client.channels.get(config.logchanid);

    const logmsg = new Discord.RichEmbed()
        .setColor('#fff5c9')
        .setAuthor('Commande SAY utilisée')
        .setThumbnail(message.author.avatarURL)
        .setTimestamp()
        .setFooter('ID user: ' + message.author.id + ' - ID msg: ' + message.id)

        if (args !== 0) {
            logmsg.setDescription(`**${message.author} a utilisé la commande Say pour envoyer \`` + sayMessage + `\` dans le salon ${message.channel}**`)
        } else {
            logmsg.setDescription(`**${message.author} a utilisé la commande Say pour envoyer une image dans le salon ${message.channel}**`)
        }

    logchan.send(logmsg);
}

module.exports.help = {
    name: "say"
}