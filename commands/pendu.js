const Discord = require("discord.js");
const fs = require("fs");
const config = require("../config.json");
let wordArray = fs.readFileSync('liste_francais.txt').toString().split("\r\n");
let xp = require("../xp.json")

module.exports.run = async (client, message, args) => {
    if (message.channel.id === config.penduid) {

        var pendu_channel = client.channels.get(config.penduid)
        var pendu_full = wordArray[Math.floor(Math.random() * wordArray.length)];

        var pendu_cut = pendu_full.split("");
        var pendu_cutreal = new Array
        var pendu_cuthide = new Array
        var pendu_état = 0

        pendu_cut.forEach(function(item, index) {
            pendu_cutreal[index] = item;
            pendu_cuthide[index] = '﹏';
        });

        var pendu_joinspace = pendu_cuthide.join(' ');

        console.log(pendu_joinspace)

        var fetched = await pendu_channel.fetchMessages({});
        pendu_channel.bulkDelete(fetched)
            .catch(error => message.reply(`Impossible de supprimer des messages à cause de: ${error}`));

        console.log(pendu_full);
        var pendu_réponse = client.channels.get(config.réponse_jeux)
        pendu_réponse.send("Réponse pendu\n" + "`"+pendu_full+"`")

        var pendu_msg = new Discord.RichEmbed()
            .setTitle('Une partie de Pendu a été lancée')
            .setImage('https://www.oligalma.com/downloads/images/hangman/hangman/0.jpg')
            .setDescription('**Les lettres du mot si dessous ont été cachées par le symbole `﹏`, retrouvez les bonnes ou vous serez pendu!**\n\n\`' + pendu_joinspace.toUpperCase() + '\`')
            .setColor('#ff8870')
            .setFooter(`Partie lancée par ${message.author.username}`);

        pendu_channel.send({embed: pendu_msg})
            .then (embedMessage => {
                client.on("message", message2 => {
                    if (message2.channel.id === config.penduid){
                        if (pendu_full !== undefined){
                            if (message2.author.id !== client.user.id){

                                if (message2.content.toLowerCase().length < 2) {
                                    var letter = message2.content.toLowerCase()
                                    var found = 0
                                    pendu_cutreal.forEach(function(item, index) {
                                        if (item === letter) {
                                            pendu_cuthide[index] = item;
                                            found++
                                            //message2.channel.send("Votre lettre est valide")
                                        }
                                    });

                                    if (found < 1) {
                                        message.reply('Aïe, vous avez donné une mauvaise lettre. :disappointed_relieved:').then(msg => {msg.delete(5000)})
                                        pendu_état++
                                    }

                                    var pendu_joinspace = pendu_cuthide.join(' ');
                                    pendu_msg.setDescription('**Les lettres du mot si dessous ont été cachées par le symbole `﹏`, retrouvez les bonnes ou vous serez pendu!**\n\n\`' + pendu_joinspace.toUpperCase() + '\`')
                                    pendu_msg.setImage(`https://www.oligalma.com/downloads/images/hangman/hangman/${pendu_état}.jpg`)
                                    embedMessage.edit(pendu_msg);

                                    var number_remains = 0

                                    pendu_cuthide.forEach(function(item){
                                        if (item === '﹏') {
                                            number_remains++
                                        }
                                    });

                                    if (pendu_état > 9) {

                                        var pendu_winmsg = new Discord.RichEmbed()
                                            .setTitle(pendu_full + ', C\'est exact!')
                                            .setThumbnail('https://i.imgur.com/urMPyjF.png')
                                            .setDescription(`\n**OUTCH le pendu est... pendu!**\n**Le mot était __${pendu_full}__**\n\nVous ne connaissiez pas ce mot ? [Chercher la définition](https://www.linternaute.fr/dictionnaire/fr/definition/${pendu_full})\n\nVous pouvez relancer une nouvelle partie en tappant la commande \`!e pendu\``)
                                            .setColor('#f56151');

                                        pendu_full = undefined;

                                        message.channel.send({embed: pendu_winmsg}).then(embedMessage => {
                                            const emoji = client.emojis.get("613852586629660672");
                                            return embedMessage.react(emoji);
                                        });
                                    }

                                    if (number_remains < 1) {

                                        var pendu_winmsg = new Discord.RichEmbed()
                                            .setTitle(pendu_full + ', C\'est exact!')
                                            .setThumbnail('https://i.imgur.com/urMPyjF.png')
                                            .setDescription(`\n**Félicitation ${message2.author} Tu as sauvé le pendu!**\n\nVous ne connaissez pas ce mot ? [Chercher la définition](https://www.linternaute.fr/dictionnaire/fr/definition/${pendu_full})\n\nVous pouvez relancer une nouvelle partie en tappant la commande \`!e pendu\``)
                                            .setColor('#33ff3f');

                                        pendu_full = undefined;

                                        message.channel.send({embed: pendu_winmsg}).then(embedMessage => {
                                            const emoji = client.emojis.get("613671749967413249");
                                            return embedMessage.react(emoji);
                                        });
                                    }



                                } //else {
                                //     var points = 0
                                //     hideword_cut.forEach(function(item, index){
                                //         if (item === '﹏') {
                                //             points = points + 10
                                //         }
                                //     });
                                //
                                //     hideword_full = undefined;
                                //
                                //     var hideword_winmsg = new Discord.RichEmbed()
                                //         .setTitle(message2.content + ', C\'est exact!')
                                //         .setThumbnail('https://i.imgur.com/urMPyjF.png')
                                //         .setDescription(`\n**Félicitation ${message2.author} Tu as trouvé le mot caché!**\n\nVous ne connaissez pas ce mot ? [Chercher la définition](https://www.linternaute.fr/dictionnaire/fr/definition/${message2.content})\n\nVous pouvez relancer une nouvelle partie en tappant la commande \`!e hideword\``)
                                //         .setColor('#33ff3f');
                                //
                                //     message.channel.send({embed: hideword_winmsg}).then(embedMessage => {
                                //         const emoji = client.emojis.get("613671749967413249");
                                //         return embedMessage.react(emoji);
                                //     });
                                //
                                //     Level.add(message2, points)
                                //
                                // };
                            };
                        };
                    };
                })
            })

    }
}

module.exports.help = {
    name: "pendu"
}