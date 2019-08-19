const Discord = require("discord.js");
const fs = require("fs");
let wordArray = fs.readFileSync('liste_francais.txt').toString().split("\r\n");
const config = require("../config.json");

module.exports.run = async (client, message, args) => {
    var hideword_full = wordArray[Math.floor(Math.random() * wordArray.length)];

    console.log(hideword_full);

    var hideword_cut = hideword_full.split("");
    // var hideword_join = []

    var hideletters = hideword_full.length * 40 / 100;
    var hideletters = Math.round(hideletters);

    for (var i = 1; i <= hideletters;) {
        var number = Math.floor(Math.random()*hideword_cut.length);
        if (hideword_cut[number] !== '﹏') {
            // console.log(hideword_cut.length + ' ' + i + ' ' + number + ' ' + hideword_cut[number]);
            hideword_cut[number] = '﹏';
            i++
        };
    };

    var hideword_joinlast = hideword_cut.join('');
    var hideword_joinspace = hideword_cut.join(' ');

    var hideword_msg = new Discord.RichEmbed()
        .setTitle('Une partie de Mot Caché a été lancée')
        .setThumbnail('https://d1kz0yd1invg7i.cloudfront.net/uploads/app/icon/11/Hide.png')
        .setDescription('**Le mot si dessous contient des lettres cachées et remplacées par le symbole `﹏`, retrouvez-le pour gagner la partie!**\n\n\`' + hideword_joinspace + '\`')
        .setColor('#ff8870')
        .setFooter('Partie lancée par ' + message.author.username);

    const hideword_channel = client.channels.get(config.hideword_id);

    var fetched = await hideword_channel.fetchMessages({});
    hideword_channel.bulkDelete(fetched)
        .catch(error => message.reply(`Impossible de supprimer des messages à cause de: ${error}`));

    console.log(hideword_joinlast);
    hideword_channel.send(hideword_msg)
        .then (
            client.on("message", message2 => {
                if (message2.channel.id === config.hideword_id){
                    if (hideword_full !== undefined){
                        if (message2.author.id !== client.user.id){
                            if (message2.content.toLowerCase() !== hideword_full) {
                                message2.reply('**Le mot caché n\'est pas  \`' + message2.content + '\`**');
                            } else {

                                hideword_full = undefined;

                                var hideword_winmsg = new Discord.RichEmbed()
                                    .setTitle(message2.content + ', C\'est exact!')
                                    .setThumbnail('https://i.imgur.com/urMPyjF.png')
                                    .setDescription('\n**Félicitation ' + message2.author + ', Tu as trouvé le mot caché!**\n\nVous pouvez relancer une nouvelle partie en tappant la commande \`!e hideword\`')
                                    .setColor('#33ff3f');

                                return message2.channel.send(hideword_winmsg);
                            };
                        };
                    };
                };
            })
        )
}

module.exports.help = {
    name: "hideword"
}