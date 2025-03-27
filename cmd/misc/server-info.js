const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'server-info',
    description: "Affiche des informations détaillées sur le serveur",
    usage: "server-info",
    cooldown: 5,
    aliases: ["serverinfo", "si", "guild", "guildinfo"],
    go: async (client, message, args, prefix, color) => {
        const guild = message.guild;
        
        const createdAt = Math.floor(guild.createdTimestamp / 1000);
        
        const members = guild.members.cache;
        const totalMembers = members.size;
        const humanMembers = members.filter(member => !member.user.bot).size;
        const botMembers = members.filter(member => member.user.bot).size;
        
        const channels = guild.channels.cache;
        const totalChannels = channels.size;
        const textChannels = channels.filter(channel => channel.type === 0).size;
        const voiceChannels = channels.filter(channel => channel.type === 2).size;
        const categoryChannels = channels.filter(channel => channel.type === 4).size;
        const announcementChannels = channels.filter(channel => channel.type === 5).size;
        const threadChannels = channels.filter(channel => [10, 11, 12].includes(channel.type)).size;
        
        const emojis = guild.emojis.cache;
        const totalEmojis = emojis.size;
        const regularEmojis = emojis.filter(emoji => !emoji.animated).size;
        const animatedEmojis = emojis.filter(emoji => emoji.animated).size;
        
        const verificationLevels = {
            0: "Aucune",
            1: "Faible",
            2: "Moyenne",
            3: "Élevée",
            4: "Très élevée"
        };
        
        const boostLevel = guild.premiumTier;
        const boostCount = guild.premiumSubscriptionCount;
        
        const embed = new EmbedBuilder()
            .setTitle(`Informations sur ${guild.name}`)
            .setColor(color)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '📋 Général', value: 
                    `**• Nom:** ${guild.name}\n` +
                    `**• ID:** ${guild.id}\n` +
                    `**• Créé le:** <t:${createdAt}:F> (<t:${createdAt}:R>)\n` +
                    `**• Propriétaire:** <@${guild.ownerId}>\n` +
                    `**• Niveau de vérification:** ${verificationLevels[guild.verificationLevel]}\n` +
                    `**• Niveau de boost:** ${boostLevel} (${boostCount} boosts)`, inline: false 
                },
                { name: '👥 Membres', value: 
                    `**• Total:** ${totalMembers}\n` +
                    `**• Humains:** ${humanMembers}\n` +
                    `**• Bots:** ${botMembers}`, inline: true 
                },
                { name: '💬 Salons', value: 
                    `**• Total:** ${totalChannels}\n` +
                    `**• Textuels:** ${textChannels}\n` +
                    `**• Vocaux:** ${voiceChannels}\n` +
                    `**• Catégories:** ${categoryChannels}\n` +
                    `**• Annonces:** ${announcementChannels}\n` +
                    `**• Fils:** ${threadChannels}`, inline: true 
                },
                { name: '😀 Emojis', value: 
                    `**• Total:** ${totalEmojis}\n` +
                    `**• Statiques:** ${regularEmojis}\n` +
                    `**• Animés:** ${animatedEmojis}`, inline: true 
                }
            )
            .setImage(guild.bannerURL({ size: 1024 }))
            .setFooter({ text: `Demandé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();
            
        if (guild.description) {
            embed.setDescription(guild.description);
        }
        
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
} 