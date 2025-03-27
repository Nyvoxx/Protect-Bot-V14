const { EmbedBuilder } = require('discord.js');
const { readdirSync } = require('fs');
module.exports = {
    name: 'help',
    description: "Affiche la liste des commandes disponibles",
    usage: "help",
    cooldown: 5,
    aliases: ["h"],
    go: async (client, message, args, prefix, color) => {
        
            const embed = new EmbedBuilder()
                .setTitle(`Help`)
                .setDescription(`Voici la liste des commandes disponibles pour le serveur ${message.guild.name}`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setColor(color)
                .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .addFields(
                    { name: "./Antiraid", value: `\`\`\`${prefix}antiraid [on/off/max/config]\n${prefix}whitelist <add/clear/list/remove>\`\`\``, inline: false },
                    { name: "./Misc", value: `\`\`\`${prefix}help\n${prefix}ping\`\`\``, inline: false },
                    { name: "./Owner", value: `\`\`\`${prefix}blacklist <add/clear/list/remove>\n${prefix}owner <add/clear/list/remove>\`\`\``, inline: false },
                );
            message.reply({ content: null, embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}
