const Discord = require("discord.js");
const fs = require("fs");
let wordArray = fs.readFileSync('liste_francais.txt').toString().split("\r\n");
const config = require("../config.json");
let xp = require("../xp.json")

module.exports.run = async (client, message, args) => {
    var hideword_full = wordArray[Math.floor(Math.random() * wordArray.length)];

    console.log(hideword_full);

    var hideword_réponse = client.channels.get(config.réponse_jeux)

    hideword_réponse.send("Réponse hideword\n" + "`"+hideword_full+"`")

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
        .setFooter(`Partie lancée par ${message.author.username} --- Utilisez !indice en cas de nécessité`);

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
                            if (message2.content.toLowerCase() === '!indice'||message2.content.toLowerCase() === '!i') {
                                var allLetters = hideword_full.split("");
                                var once = true;
                                hideword_cut.forEach(function(item, index){
                                    if (once) {
                                        if (item === '﹏') {
                                            hideword_cut[index] = allLetters[index];
                                            hideword_joinspace = hideword_cut.join(' ');
                                            once = undefined;
                                        };
                                    };
                                });

                                var hideword_msgindice = new Discord.RichEmbed()
                                    .setTitle('Un indice a été réclamé')
                                    .setThumbnail('https://www.redwallpapers.com/public/redwallpapers-large-thumb/puzzles-puzzle-part-shape-free-stock-photos-images-hd-wallpaper.jpg')
                                    .setDescription('**Le mot si dessous contient des lettres cachées et remplacées par le symbole `﹏`, retrouvez-le pour gagner la partie!**\n\n\`' + hideword_joinspace + '\`')
                                    .setColor('#34deeb')
                                    .setFooter(`Indice demmandé par ${message.author.username} --- Utilisez !indice en cas de nécessité`);

                                return message.channel.send(hideword_msgindice);
                            }
                            if (message2.content.toLowerCase() !== hideword_full) {
                                message2.reply('**Le mot caché n\'est pas  \`' + message2.content + '\`**');
                            } else {
                                var points = 0
                                hideword_cut.forEach(function(item, index){
                                    if (item === '﹏') {
                                        points = points + 10
                                    }
                                });

                                hideword_full = undefined;

                                var hideword_winmsg = new Discord.RichEmbed()
                                    .setTitle(message2.content + ', C\'est exact!')
                                    .setThumbnail('https://i.imgur.com/urMPyjF.png')
                                    .setDescription(`\n**Félicitation ${message2.author} Tu as trouvé le mot caché!**\n\nVous ne connaissez pas ce mot ? [Chercher la définition](https://www.linternaute.fr/dictionnaire/fr/definition/${message2.content})\n\nVous pouvez relancer une nouvelle partie en tappant la commande \`!e hideword\``)
                                    .setColor('#33ff3f');

                                message.channel.send({embed: hideword_winmsg}).then(embedMessage => {
                                    const emoji = client.emojis.get("613671749967413249");
                                    return embedMessage.react(emoji);
                                });

                                Level.add(message2, points)

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