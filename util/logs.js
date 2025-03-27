const { EmbedBuilder } = require("discord.js");

const logs = async (obj) => {
    const { guild, client, name, executor, punish, salon, user, roles, bot, limit } = obj;
    
    if (!guild) return;
    
    const logsChannelId = await client.database.get(`logs_${guild.id}`);
    const logsChannel = guild.channels.cache.get(logsChannelId);
    if (!logsChannel) return; 
    
    const colorValue = await client.database.get(`color_${guild.id}`);
    const color = colorValue || client.config.color;

    const embed = new EmbedBuilder()
        .setTitle(`\`📰\` - \`\`\`js\n${name}\`\`\``)
        .setColor(color)
        .setTimestamp();
    
    embed.addFields({ name: "Autheur:", value: `<@${executor}>`, inline: true });
    embed.addFields({ name: "Sanction:", value: `\`${punish}\``, inline: true });
    
    if (salon) embed.addFields({ name: "Salon:", value: `\`${salon}\``, inline: true });
    if (user) embed.addFields({ name: "Membre:", value: `<@${user}>`, inline: true });
    if (roles) embed.addFields({ name: "Roles:", value: `<@&${roles}>`, inline: true });
    if (bot) embed.addFields({ name: "Bot:", value: `<@${bot}>`, inline: true });
    if (limit) embed.addFields({ name: "Limit:", value: `${limit}`, inline: true });
    
    try {
        await logsChannel.send({ embeds: [embed] });
    } catch (error) {
        console.error("Erreur lors de l'envoi du log:", error);
    }
};

module.exports = logs;