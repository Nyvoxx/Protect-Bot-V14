const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'invitebot',
    description: "Génère un lien d'invitation pour ajouter le bot sur votre serveur",
    usage: "invitebot",
    cooldown: 5,
    aliases: ["invite", "botinvite", "add"],
    go: async (client, message, args, prefix, color) => {
        
        const inviteLink = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;
        
        const embed = new EmbedBuilder()
            .setTitle(`Inviter ${client.user.username}`)
            .setDescription(`Merci de vouloir inviter ${client.user.username} sur votre serveur ! Utilisez le lien ci-dessous pour ajouter le bot à votre serveur.`)
            .setColor(color)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '🔗 Lien d\'invitation', value: `[Cliquez ici pour inviter le bot](${inviteLink})`, inline: false },
                { name: '📚 Support', value: `[Serveur de support](https://discord.gg/zM6ZN9UfRs)`, inline: true },
                { name: '📋 GitHub', value: `[Code source](https://github.com/Nyvoxx/Protect-Bot-V14)`, inline: true }
            )
            .setFooter({ text: `Demandé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();
            
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
} 
