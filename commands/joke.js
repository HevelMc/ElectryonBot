const Discord = require("discord.js");
const fs = require("fs");
let jokeArray = fs.readFileSync('jokes.json').toString().split("\n**");
let smileyArray = fs.readFileSync('urlemojis.txt').toString().split("\n");
const config = require("../config.json");

module.exports.run = async (client, message, args) => {
    const jokechan = client.channels.get(config.jokechanid);

    var jokeMsg = new Discord.RichEmbed()
        .setColor('#' + Math.floor(Math.random()*16777215).toString(16))
        .setTitle('');

    var jokeImg = smileyArray[Math.floor(Math.random()*smileyArray.length)];
    jokeMsg.setThumbnail(jokeImg);

    if (args > 0 && args <= jokeArray.length) {
        var Joke = jokeArray[args - 1];
        jokeMsg.setTitle(message.author.username + ' à réclamé la blague n°' + args);
        jokeMsg.setFooter('Blague n°' + args);
    } else {
        var jokeR = Math.floor(Math.random()*jokeArray.length);
        var Joke = jokeArray[jokeR];
        jokeMsg.setTitle(message.author.username + ' à réclamé une blague, en voici une:');
        jokeMsg.setFooter('Blague n°' + jokeR);
    }
    jokeMsg.setDescription('**' + Joke + '**');

    jokechan.send(jokeMsg)
        .then (async jokeMsg => {
            jokeMsg.react("👍");
            await sleep(100)
            jokeMsg.react("👎");

            client.on('messageReactionAdd', async (reaction, user) => {
                if (reaction.emoji.name === "👎" || reaction.emoji.name === "👍") {
                    if (user.id !== client.user.id) {
                        var AllReact = reaction.message.reactions;
                        AllReact.forEach(function (ireaction){
                            if (ireaction != reaction) ireaction.remove(user);
                        });

                        await sleep(1000)

                        var msgLikeYes = reaction.message.reactions.filter(a => a.emoji.name === '👍').map(reaction => reaction.count)[0];
                        var msgLikeNo = reaction.message.reactions.filter(a => a.emoji.name === '👎').map(reaction => reaction.count)[0];

                        msgLikeNo = msgLikeNo - 1;
                        msgLikeYes = msgLikeYes - 1;

                        var msgLikeMax = msgLikeYes + msgLikeNo;
                        var msgLikePC = msgLikeYes / msgLikeMax * 100;

                        reaction.message.edit('Blague appréciée à ' + round2(msgLikePC) + '% sur un total de ' + msgLikeMax + ' vote(s).');
                    };
                };
            });

            client.on('messageReactionRemove', async (reaction, user) => {
                if (reaction.emoji.name === "👎" || reaction.emoji.name === "👍") {
                    if (user.id !== client.user.id) {

                        var msgLikeYes = reaction.message.reactions.filter(a => a.emoji.name === '👍').map(reaction => reaction.count)[0];
                        var msgLikeNo = reaction.message.reactions.filter(a => a.emoji.name === '👎').map(reaction => reaction.count)[0];

                        msgLikeNo = msgLikeNo - 1;
                        msgLikeYes = msgLikeYes - 1;

                        var msgLikeMax = msgLikeYes + msgLikeNo;
                        var msgLikePC = msgLikeYes / msgLikeMax * 100;

                        reaction.message.edit('Blague appréciée à ' + round2(msgLikePC) + '% sur un total de ' + msgLikeMax + ' vote(s).');
                    };
                };
            });
        });
}

module.exports.help = {
    name: "joke"
}

function round2(nb){
    nb = nb * 100
    nb = Math.round(nb) / 100
    return(nb)
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}