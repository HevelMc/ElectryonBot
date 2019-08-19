const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
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

    //ban
    await member.ban(reason)
        //report errors
        .catch(error => message.reply(`Désolé ${message.author}, Je ne peux bannir cet utilisateur car : ${error}`));

    //message
    message.reply(`${member.user.tag} a correctement été banni par ${message.author.tag} a cause de : ${reason}`);
}

module.exports.help = {
    name: "ban"
}