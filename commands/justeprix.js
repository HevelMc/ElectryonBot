const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (client, message, args) => {
    if (justeprix_encours) {
        return message.reply('Désolé, une partie est déjà en cours !');
    } else {

        var justeprix_channel = client.channels.get(config.justeprix_id);

        var fetched = await justeprix_channel.fetchMessages({});
        justeprix_channel.bulkDelete(fetched)
            .catch(error => message.reply(`Impossible de supprimer des messages à cause de: ${error}`));

        var justeprix_encours = true

        var justeprix_random = Math.random() * (+config.justeprix_max - +config.justeprix_min) + +config.justeprix_min;
        justeprix_random = Math.round(justeprix_random);

        console.log(justeprix_random);

        var justeprix_msg = new Discord.RichEmbed()
            .setTitle('Une partie de juste prix a été lancée')
            .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Logo_Le_Juste_Prix.png/250px-Logo_Le_Juste_Prix.png')
            .setDescription('**le nombre est compris entre ' + config.justeprix_min + ' et ' + config.justeprix_max + '!**\n\nProposez un nombre et je vous dirais si **c\'est plus** ou **c\'est moins**. [Ckwa Le juste prix ?](https://fr.wikipedia.org/wiki/Le_Juste_Prix)')
            .setColor('#FCC201')
            .setFooter('Partie lancée par ' + message.author.username);

        justeprix_channel.send(justeprix_msg)
            .then (
                client.on("message", message2 => {
                    if (message2.channel.id === config.justeprix_id){
                        if (message2.author.id !== client.user.id){
                            justeprix_number = parseInt(message2, 10);
                            if (justeprix_number >= config.justeprix_min && justeprix_number <= config.justeprix_max) {
                                if (justeprix_number < justeprix_random) message2.reply(justeprix_number + ' **C\'est plus**!');
                                if (justeprix_number > justeprix_random) message2.reply(justeprix_number + ' **C\'est moins**!');
                                if (justeprix_number === justeprix_random) {
                                    justeprix_random = undefined;

                                    var justeprix_winmsg = new Discord.RichEmbed()
                                        .setTitle(justeprix_number + ', C\'est exact!')
                                        .setThumbnail('https://i.imgur.com/urMPyjF.png')
                                        .setDescription('\n**Félicitation ' + message2.author + ', Tu as trouvé le nombre caché!**\n\nVous pouvez relancer une nouvelle partie en tappant la commande \`!e justeprix\`')
                                        .setColor('#33ff3f');

                                    return message2.channel.send(justeprix_winmsg);
                                };
                            };
                        };
                    };
                })
            );
    };
}

module.exports.help = {
    name: "justeprix"
}