const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'ping',
    description: "Affiche la latence du bot",
    usage: "ping",
    cooldown: 5,
    aliases: ["latence"],
    go: async (client, message, args, prefix, color) => {
            const embed = new EmbedBuilder()
                .addFields(
                    { name: "Ping", value: `Calcul en cours`, inline: true },
                    { name: "Latence", value: `${client.ws.ping}ms`, inline: true }
                )
                .setColor(color);
            const msg = await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
            const embed2 = new EmbedBuilder()
                .addFields(
                    { name: "Ping", value: `${msg.createdTimestamp - message.createdTimestamp}ms`, inline: true },
                    { name: "Latence", value: `${client.ws.ping}ms`, inline: true }
                )
                .setColor(color);
            return msg.edit({ embeds: [embed2] });
        }
}
