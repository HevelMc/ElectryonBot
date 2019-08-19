const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
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

module.exports.help = {
    name: "ban"
}