const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");
let xp = require("../xp.json")


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

        var justeprix_réponse = client.channels.get(config.réponse_jeux)

        var justeprix_msg = new Discord.RichEmbed()
            .setTitle('Une partie de juste prix a été lancée')
            .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Logo_Le_Juste_Prix.png/250px-Logo_Le_Juste_Prix.png')
            .setDescription('**le nombre est compris entre ' + config.justeprix_min + ' et ' + config.justeprix_max + '!**\n\nProposez un nombre et je vous dirais si **c\'est plus** ou **c\'est moins**. [Ckwa Le juste prix ?](https://fr.wikipedia.org/wiki/Le_Juste_Prix)')
            .setColor('#FCC201')
            .setFooter('Partie lancée par ' + message.author.username);

        justeprix_channel.send(justeprix_msg)
            .then(
                client.on("message", async message2 => {
                    if (message2.channel.id === config.justeprix_id) {
                        if (message2.author.id !== client.user.id) {
                            if (message2.content === '!give') {
                                message2.delete()
                                if (message.member.hasPermission('ADMINISTRATOR')) {

                                    var fetched = await justeprix_réponse.fetchMessages().then(messages => {
                                        const toDelete = messages.filter(msg => msg.content.includes("`Dernière réponse du Juste-Prix`"));
                                        message.channel.bulkDelete(toDelete)
                                            .catch(error => message.reply(`Impossible de supprimer des messages à cause de: ${error}`));
                                    });
                                    var justeprix_givemsg = new Discord.RichEmbed()
                                        .setTitle("Réponse du Juste-Prix")
                                        .setThumbnail('https://www.dragnsurvey.com/blog/wp-content/uploads/2017/01/question-r%C3%A9ponse-quizz-300x154.jpg')
                                        .setDescription(justeprix_random)
                                        .setColor('#3ab6c7')
                                        .setFooter('Cette réponse a été demandée par: ' + message2.author.username)
                                        .setTimestamp();

                                    return justeprix_réponse.send({embed: justeprix_givemsg});
                                } else {
                                    return message.reply("Désolé, vous n'avez pas les permissions d'utiliser ceci!");
                                }
                            }
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

                                    justeprix_channel.send({
                                        embed: justeprix_winmsg
                                    }).then(embedMessage => {
                                        const emoji = client.emojis.get("613671749967413249");
                                        Level.add(message2, Math.floor(Math.random() * 20 + 10))
                                        return embedMessage.react(emoji);
                                    });
                                };
                            };
                        };
                    };
                })
            );
    };
}
Level = {
    test: function leveltest(message) {
        if (!xp[message.author.id]) {
            xp[message.author.id] = {
                xp: 80,
                level: 1
            };
        }

        if (xp[message.author.id].xp >= (xp[message.author.id].level * 50 + 50)) {
            xp[message.author.id].xp = xp[message.author.id].xp - (xp[message.author.id].level * 50 + 50);
            xp[message.author.id].level++;

            var levelup_msg = new Discord.RichEmbed()
                .setTitle('Félicitation ' + message.author.username + ', tu viens de passer niveau ' + xp[message.author.id].level + '!')
                .setThumbnail('https://i.pinimg.com/originals/64/bf/d8/64bfd800da7d2e66bdba8530cc0d32ee.png')
                .addField('Votre niveau:', `Niveau ${xp[message.author.id].level}`)
                .addField('Votre experience:', `${xp[message.author.id].xp} / ${xp[message.author.id].level * 50 + 50}`)
                .setColor('#ff6a00');
            return message.channel.send(levelup_msg);
        };

        fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
            if (err) console.log(err);
        });
    },
    add: function xpadd(message, number) {
        Level.test(message)
        xp[message.author.id].xp = xp[message.author.id].xp + number
        Level.test(message)
        var gain_msg = new Discord.RichEmbed()
            .setTitle('Bravo ' + message.author.username + ', tu as gagné ' + number + ' points!')
            .setThumbnail('https://media.forgecdn.net/avatars/115/744/636396938747077311.png')
            .addField('Votre niveau:', `Niveau ${xp[message.author.id].level}`)
            .addField('Votre experience:', `${xp[message.author.id].xp} / ${xp[message.author.id].level * 50 + 50}`)
            .setColor('#fce803');
        message.channel.send(gain_msg)
    }
}
module.exports.help = {
    name: "justeprix"
}