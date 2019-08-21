const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    let helpEmbed = new Discord.RichEmbed()
        .setTitle("Menu d\'aide du bot Electryon")
        .addField("Commandes utiles:", "\`!e help\` ouvre le menu d\'aide\n\`!e ping\` renvoi votre latence et celle du bot\n\`!e report <message>\` envoi un message important au staff")
        .addField("Commandes de modération:", "\`!e kick <pseudo>\` expluse un membre du serveur\n\`!e ban <pseudo>\` banni un membre du serveur\n\`!e purge <1-100>\` efface les derniers messages du salon")
        .addField("Commandes des Jeux:", "\`!e justeprix\` lance une partie de <#611687328863485971>\n\`!e hideword\` lance une partie de <#612989981794893844>\n\`!e pendu\` lance une partie de <#613827452724314122>")
        .addField("Commandes drôles:", "\`!e joke\` envoi une blague aléatoire dans le salon <#610936704911802379>")
        .setColor("#349eeb")
        .setThumbnail('http://a53.idata.over-blog.com/1/63/77/59/Photos-2011/Info-logo.png')
        .setFooter('Ce message sera supprimé au bout de 30 secondes.');

    message.delete(5000)
    message.channel.send(helpEmbed).then(msg => {msg.delete(30000)})
}

module.exports.help = {
    name: "help"
}