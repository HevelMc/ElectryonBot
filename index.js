//init
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const fs = require('fs');
var isvac;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`Préparer ses blagues nulles.`);
});


var jokeArray = fs.readFileSync('jokes.json').toString().split("\n**");
var smileyArray = fs.readFileSync('urlemojis.txt').toString().split("\n");

//commands

client.on("message", async message => {

    //empeche les boucles du bot
    if (message.author.bot) return;

    //ne fonctionne que si la commande commence par /e
    if (message.content.indexOf(config.prefix) !== 0) return;

    //argument tester/correcter
    var args = '';
    args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //ping command
    if (command === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`**Pong!** la latence est de \`${m.createdTimestamp - message.createdTimestamp}\`ms. la latence de l'API est de \`${Math.round(client.ping)}\`ms`);
    }

    //say command
    if (command === "say") {

        if (!message.member.hasPermission('MANAGE_CHANNELS'))
            return message.reply("Vous n'avez pas la permission d'envoyer des messages à l'aide du bot !")

        message.delete().catch(O_o => {});

        if (args !== 0) {
            const sayMessage = args.join(" ");
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

        // Attachment.forEach(function(attachment) {
        //     logmsg.attachFile({
        //         files: [attachment]
        //     })
        // })

        logchan.send(logmsg);

    }

    //kick
    if (command === "kick") {

        //no permission
        if (!message.member.hasPermission('KICK_MEMBERS'))
            return message.reply("Désolé, vous n'avez pas les permissions d'utiliser ceci!");

        //find member
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);

        //tests
        if (!member)
            return message.reply("Veuillez mentionner un membre valide de ce serveur.");
        if (!member.kickable)
            return message.reply("Je ne peux pas expluser cet utilisateur ! Il a sûrement un rôle plus important. Est-ce que j'ai les permissions d'expultion ?");

        //reason
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "Aucune raison fournie";

        //kick
        await member.kick(reason)
            //report errors
            .catch(error => message.reply(`Sorry ${message.author} Je ne peux expulsé cet utilisateur car : ${error}`));

        //message
        message.reply(`${member.user.tag} a correctement été explusé du serveur par ${message.author.tag} a cause de : ${reason}`);

    }

    //kick
    if (command === "ban") {

        //no permission
        if (!message.member.hasPermission('BAN_MEMBERS'))
            return message.reply("Désolé, vous n'avez pas les permissions d'utiliser ceci!");

        //find member
        let member = message.mentions.members.first();

        //tests
        if (!member)
            return message.reply("Veuillez mentionner un membre valide de ce serveur.");
        if (!member.bannable)
            return message.reply("Je ne peux pas bannir cet utilisateur ! Il a sûrement un rôle plus important. Est-ce que j'ai les permissions de bannissement ?");

        //reason
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "Aucune raison fournie";

        //kick
        await member.ban(reason)
            //report errors
            .catch(error => message.reply(`Désolé ${message.author}, Je ne peux bannir cet utilisateur car : ${error}`));

        //message
        message.reply(`${member.user.tag} a correctement été banni par ${message.author.tag} a cause de : ${reason}`);
    }

    //purge
    if (command === "purge") {

        //nombre de messages a supprimer
        var deleteCount = parseInt(args[0], 10);

        //test nombre message
        if (!deleteCount || deleteCount < 1 || deleteCount > 100)
            return message.channel.send("Veuillez indiquer un nombre entre 1 et 100 pour le nombre de messages à supprimer.");

        // add 1 for remove
        deleteCount = deleteCount + 1

        //delete list
        const fetched = await message.channel.fetchMessages({
            limit: deleteCount
        });

        //delete
        message.channel.bulkDelete(fetched)
            //errors
            .catch(error => message.reply(`Impossible de supprimer des messages à cause de: ${error}`));
    }

    //jokes command request
    if (command === "joke") {
        const jokechan = client.channels.get(config.jokechanid);

        const jokeMsg = new Discord.RichEmbed()
            .setColor('#' + Math.floor(Math.random()*16777215).toString(16))
            .setTitle('')
            // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
            // .addField('Regular field title', 'Some value here')
            // .addBlankField()
            // .addField('Inline field title', 'Some value here', true)
            .setTimestamp()

        var jokeImg = smileyArray[Math.floor(Math.random()*smileyArray.length)];
        jokeMsg.setThumbnail(jokeImg)

        if (args > 0 && args <= jokeArray.length) {
            var Joke = jokeArray[args - 1];
            jokeMsg.setTitle(message.author.username + ' à réclamé la blague n°' + args)
            jokeMsg.setFooter('Blague n°' + args);
        } else {
            var jokeR = Math.floor(Math.random()*jokeArray.length)
            var Joke = jokeArray[jokeR];
            jokeMsg.setTitle(message.author.username + ' à réclamé une blague, en voici une:')
            jokeMsg.setFooter('Blague n°' + jokeR);
        }
        jokeMsg.setDescription('**' + Joke + '**')

        jokechan.send(jokeMsg)
            .then (jokeMsg => {
                jokeMsg.react("👍")
                jokeMsg.react("👎")

                client.on('messageReactionAdd', (reaction, user) => {
                    if (reaction.emoji.name === "👍" && user.id !== client.user.id) {
                        reaction.remove(client.user.id);
                    }
                    if (reaction.emoji.name === "👎" && user.id !== client.user.id) {
                        reaction.remove(client.user.id);
                    }
                })

                client.on('messageReactionAdd', (reaction, user) => {
                    if (reaction.emoji.name === "👎" || reaction.emoji.name === "👍") {
                        if (user.id !== client.user.id) {
                            var AllReact = reaction.message.reactions
                            AllReact.forEach(function (ireaction){
                                if (ireaction != reaction) {
                                    ireaction.remove(user)
                                }
                            })
                        }
                    }
                })


                client.on('messageReactionRemove', (reaction, user) => {
                    if (reaction.emoji.name === "👍" && user.id !== client.user.id) {
                        if (reaction.count < 1) {
                            jokeMsg.react("👍")
                        }
                    }
                    if (reaction.emoji.name === "👎" && user.id !== client.user.id) {
                        if (reaction.count < 1) {
                            jokeMsg.react("👎")
                        }
                    }
                  })

            })
    }
});

// client.on('message', message => {
//     if (message.content === ('#jesuisenvacances')) {
//         if (message.author == '<@204212272585768960>') {
//             if (isvac == true) {
//                 isvac = false;
//                 message.channel.send(":white_check_mark: Bon retour parmi nous <@204212272585768960> 💥");
//             } else {
//                 isvac = true;
//                 message.channel.send(":white_check_mark: Parfait, bonnes vacances ! ⛱️");
//             }
//         }
//     }
//     if (message.content.includes('<@204212272585768960>')) {
//         if (isvac == true) {
//             if (message.author == '<@204212272585768960>') {
//                 console.log('coucou hevel ^^');
//             } else {
//                 message.channel.send("Bonjour " + message.author + ", je suis désolé mais Hevel est actuellement en vacances jusqu'au 25/07.");
//                 message.channel.send("Si votre message est urgent, contactez un <@&444184435995312149>, sinon vous pouvez patienter jusqu'à son retour.");
//             }
//         }
//     }
// });

client.login('NDM5NzgzMzc4MDMyNzg3NDY2.XSt7QQ.Lk7kbHw_O7m8PlWBLY2GHRku-QM');
