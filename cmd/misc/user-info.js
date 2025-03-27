const { EmbedBuilder, UserFlags } = require('discord.js');

module.exports = {
    name: 'user-info',
    description: "Affiche des informations détaillées sur un utilisateur",
    usage: "user-info [@utilisateur]",
    cooldown: 5,
    aliases: ["userinfo", "ui", "whois"],
    go: async (client, message, args, prefix, color) => {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const user = member.user;
        
        const joinedAt = Math.floor(member.joinedTimestamp / 1000);
        const createdAt = Math.floor(user.createdTimestamp / 1000);
        
        // Utilisation de UserFlags pour les badges
        const badgesMap = {
            [UserFlags.Staff]: "Staff Discord",
            [UserFlags.Partner]: "Partenaire Discord",
            [UserFlags.Hypesquad]: "HypeSquad Events",
            [UserFlags.BugHunterLevel1]: "Chasseur de bugs Niveau 1",
            [UserFlags.BugHunterLevel2]: "Chasseur de bugs Niveau 2",
            [UserFlags.HypeSquadOnlineHouse1]: "HypeSquad Bravery",
            [UserFlags.HypeSquadOnlineHouse2]: "HypeSquad Brilliance",
            [UserFlags.HypeSquadOnlineHouse3]: "HypeSquad Balance",
            [UserFlags.PremiumEarlySupporter]: "Supporter précoce",
            [UserFlags.TeamPseudoUser]: "Utilisateur d'équipe",
            [UserFlags.VerifiedBot]: "Bot vérifié",
            [UserFlags.VerifiedDeveloper]: "Développeur vérifié",
            [UserFlags.CertifiedModerator]: "Modérateur certifié",
            [UserFlags.BotHTTPInteractions]: "Bot HTTP Interactions",
            [UserFlags.ActiveDeveloper]: "Développeur actif"
        };
        
        // Récupérer les badges de l'utilisateur avec UserFlags
        const userBadges = user.flags ? user.flags.toArray().map(flag => badgesMap[flag] || flag).filter(Boolean).join(", ") : "Aucun badge";
        
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .filter(r => r.id !== message.guild.id)
            .map(r => `<@&${r.id}>`)
            .slice(0, 15);
        
        const roleDisplay = roles.length ? roles.join(", ") : "Aucun rôle";
        
        const activities = [];
        if (member.presence && member.presence.activities) {
            member.presence.activities.forEach(activity => {
                if (activity.type === 0) activities.push(`Joue à ${activity.name}`);
                if (activity.type === 1) activities.push(`Stream ${activity.name}`);
                if (activity.type === 2) activities.push(`Écoute ${activity.name}`);
                if (activity.type === 3) activities.push(`Regarde ${activity.name}`);
                if (activity.type === 4) activities.push(`${activity.state || activity.name}`);
                if (activity.type === 5) activities.push(`Participe à ${activity.name}`);
            });
        }
        
        // Créer l'embed
        const embed = new EmbedBuilder()
            .setTitle(`Informations sur ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor(member.displayHexColor === "#000000" ? color : member.displayHexColor)
            .addFields(
                { name: '👤 Utilisateur', value: 
                    `**• Nom:** ${user.tag}\n` +
                    `**• ID:** ${user.id}\n` +
                    `**• Créé le:** <t:${createdAt}:F> (<t:${createdAt}:R>)\n` +
                    `**• Badges:** ${userBadges}`, inline: false 
                },
                { name: '📋 Membre', value: 
                    `**• Surnom:** ${member.nickname || "Aucun"}\n` +
                    `**• A rejoint le:** <t:${joinedAt}:F> (<t:${joinedAt}:R>)\n` +
                    `**• Plus haut rôle:** ${member.roles.highest.id === message.guild.id ? "Aucun" : `<@&${member.roles.highest.id}>`}`, inline: false 
                },
                { name: `🎭 Rôles [${roles.length}]`, value: roleDisplay, inline: false }
            )
            .setFooter({ text: `Demandé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();
            
        if (activities.length) {
            embed.addFields({ name: '🎮 Activités', value: activities.join('\n'), inline: false });
        }
        
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
} 