const { EmbedBuilder, version } = require('discord.js');
const os = require('os');

module.exports = {
    name: 'bot-info',
    description: "Affiche des informations détaillées sur le bot",
    usage: "bot-info",
    cooldown: 5,
    aliases: ["botinfo", "bi"],
    go: async (client, message, args, prefix, color) => {

        const days = Math.floor(client.uptime / 86400000);
        const hours = Math.floor(client.uptime / 3600000) % 24;
        const minutes = Math.floor(client.uptime / 60000) % 60;
        const seconds = Math.floor(client.uptime / 1000) % 60;
        const uptime = `${days}j ${hours}h ${minutes}m ${seconds}s`;
        
        const memoryUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        
        const embed = new EmbedBuilder()
            .setTitle(`Informations sur ${client.user.username}`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor(color)
            .addFields(
                { name: '⚙️ Général', value: 
                    `**• Nom:** ${client.user.tag}\n` +
                    `**• ID:** ${client.user.id}\n` +
                    `**• Créé le:** <t:${Math.floor(client.user.createdTimestamp / 1000)}:F>\n` +
                    `**• Uptime:** ${uptime}`, inline: false 
                },
                { name: '📊 Statistiques', value: 
                    `**• Serveurs:** ${client.guilds.cache.size}\n` +
                    `**• Utilisateurs:** ${client.users.cache.size}\n` +
                    `**• Salons:** ${client.channels.cache.size}\n` +
                    `**• Commandes:** ${client.commands.size}`, inline: true 
                },
                { name: '💻 Système', value: 
                    `**• Node.js:** ${process.version}\n` +
                    `**• Discord.js:** v${version}\n` +
                    `**• Mémoire:** ${memoryUsage} MB\n` +
                    `**• CPU:** ${os.cpus()[0].model}`, inline: true 
                }
            )
            .setFooter({ text: `Demandé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();
            
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
} 