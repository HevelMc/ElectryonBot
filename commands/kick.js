const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    console.log("run!")
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


module.exports.help = {
    name: "kick"
}