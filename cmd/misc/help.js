const { EmbedBuilder } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    description: "Affiche la liste des commandes disponibles",
    usage: "help [commande]",
    cooldown: 5,
    aliases: ["h"],
    go: async (client, message, args, prefix, color) => {
        
        if (args[0]) {
            const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));
            
            if (command) {
                const commandEmbed = new EmbedBuilder()
                    .setAuthor({ 
                        name: `Commande: ${command.name}`, 
                        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
                    })
                    .setDescription(`
                        \`\`\`fix
${command.description || "Aucune description disponible"}
\`\`\`
                    `)
                    .setColor(color)
                    .addFields(
                        { name: '📝 Utilisation', value: `\`${prefix}${command.usage || command.name}\``, inline: true },
                        { name: '⏱️ Cooldown', value: `\`${command.cooldown || 3} secondes\``, inline: true },
                        { name: '🔄 Aliases', value: command.aliases ? `\`${command.aliases.join('`, `')}\`` : "`Aucun`", inline: true }
                    )
                    .setFooter({ text: `${message.guild.name} • Demandé par ${message.author.tag}`, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setTimestamp();
                
                return message.reply({ embeds: [commandEmbed], allowedMentions: { repliedUser: false } });
            } else {
                return message.reply({ content: `❌ La commande \`${args[0]}\` n'existe pas. Utilisez \`${prefix}help\` pour voir la liste des commandes disponibles.`, allowedMentions: { repliedUser: false } });
            }
        }
        
        const categories = {};
        const cmdDir = path.join(process.cwd(), 'cmd');
        
        readdirSync(cmdDir).forEach(dir => {

            if (!readdirSync(path.join(cmdDir, dir)).filter(file => file.endsWith('.js')).length) return;
            
            const commands = readdirSync(path.join(cmdDir, dir))
                .filter(file => file.endsWith('.js'))
                .map(file => {
                    const cmd = require(path.join(cmdDir, dir, file));
                    return `\`${prefix}${cmd.name}\``;
                });
            
            const categoryEmojis = {
                antiraid: "🛡️",
                misc: "🔧",
                owner: "👑"
            };
            
            categories[dir] = {
                emoji: categoryEmojis[dir] || "📁",
                commands: commands
            };
        });
        
        const helpEmbed = new EmbedBuilder()
            .setAuthor({ 
                name: `Menu d'aide de ${client.user.username}`, 
                iconURL: client.user.displayAvatarURL({ dynamic: true }) 
            })
            .setDescription(`
                Bonjour ${message.author}, voici la liste des commandes disponibles.
                Pour plus d'informations sur une commande, tapez \`${prefix}help [commande]\`
                
                **Préfixe:** \`${prefix}\`
                **Total des commandes:** \`${client.commands.size}\`
            `)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor(color)
            .setFooter({ text: `${message.guild.name} • Demandé par ${message.author.tag}`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setTimestamp();
        
        for (const [category, data] of Object.entries(categories)) {

            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            helpEmbed.addFields({
                name: `${data.emoji} ${categoryName} [${data.commands.length}]`,
                value: data.commands.join(' • '),
                inline: false
            });
        }
        
        helpEmbed.addFields({
            name: '🔗 Liens utiles',
            value: `[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot) • [Support](https://discord.gg/zM6ZN9UfRs) • [GitHub](https://github.com/Nyvoxx/Protect-Bot-V14)`,
            inline: false
        });
        
        message.reply({ embeds: [helpEmbed], allowedMentions: { repliedUser: false } });
    }
}
