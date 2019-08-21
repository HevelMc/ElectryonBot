const Discord = require("discord.js");
let xp = require("../xp.json")

module.exports.run = async (client, message, args) => {
    if(args[0]) {
        var user = getUserFromMention(args[0]);
        if (!xp[user.id]) return message.reply("L'utilisateur " + user + " n'a pas encore participé aux jeux.")
    } else {
        var user = message.author
    }
    var levelup_msg = new Discord.RichEmbed()
        .setTitle('Statistiques du joueur ' + user.username)
        .setThumbnail('https://gamepedia.cursecdn.com/minecraft_gamepedia/9/93/Bottle_o%27_Enchanting.png')
        .addField('Niveau:', `Niveau ${xp[user.id].level}`)
        .addField('Experience:', `${xp[user.id].xp} / ${xp[user.id].level * 50 + 50}`)
        .setColor('#ff0084');
    message.channel.send(levelup_msg)


    function getUserFromMention(mention) {
    	if (!mention) return;

    	if (mention.startsWith('<@') && mention.endsWith('>')) {
    		mention = mention.slice(2, -1);

    		if (mention.startsWith('!')) {
    			mention = mention.slice(1);
    		}

    		return client.users.get(mention);
    	}
    }
}

module.exports.help = {
    name: "niveau"
}
