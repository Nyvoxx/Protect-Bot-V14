const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType} = require('discord.js')
module.exports = {
    name: 'owner',
    description: "Ajout ou suppression d'un membre owner",
    usage: "owner add @membre",
    cooldown: 10,
    aliases: ["owners"],
    go: async (client, message, args, prefix, color) => {
        if (client.config.owner.includes(message.author.id)) {
            if (args[0] === "add") {
                let member = client.users.cache.get(message.author.id);
                if (args[1]) member = client.users.cache.get(args[1]);
                else return message.reply({ allowedMentions: { repliedUser: false }, content: `Aucun membre trouvé pour \`${args[1] || "❌"}\`` });
                if (message.mentions.members.first()) member = client.users.cache.get(message.mentions.members.first().id);
                if (!member) return message.reply({ allowedMentions: { repliedUser: false }, content: `Aucun membre trouvé pour \`${args[1] || "❌"}\`` });
                
                const isOwner = await client.database.get(`owner_${client.user.id}_${member.id}`);
                if (isOwner === true) return message.reply({ allowedMentions: { repliedUser: false }, content: `${member.username} est déjà owner` });
                
                await client.database.set(`owner_${client.user.id}_${member.id}`, true);
                return message.reply({ allowedMentions: { repliedUser: false }, content: `${member.username} est maintenant owner` });
            } else if (args[0] === "clear") {
                const data = await client.database.all();
                const ownerData = data.filter(data => data.id.startsWith(`owner_${client.user.id}`));
                let clear = 0;
                
                for (let i = 0; i < ownerData.length; i++) {
                    await client.database.delete(ownerData[i].id);
                    clear++;
                };
                
                return message.reply({ allowedMentions: { repliedUser: false }, content: `${ownerData.length ? ownerData.length : 0} ${ownerData.length > 1 ? "personnes ont été supprimées " : "personne a été supprimée"} des owners` });
            } else if (args[0] === "remove") {
                let member = client.users.cache.get(message.author.id);
                if (args[1]) member = client.users.cache.get(args[1]);
                else return message.reply({ allowedMentions: { repliedUser: false }, content: `Aucun membre trouvé pour \`${args[1] || "❌"}\`` });
                if (message.mentions.members.first()) member = client.users.cache.get(message.mentions.members.first().id);
                if (!member) return message.reply({ allowedMentions: { repliedUser: false }, content: `Aucun membre trouvé pour \`${args[1] || "❌"}\`` });
                
                const isOwner = await client.database.get(`owner_${client.user.id}_${member.id}`);
                if (isOwner === null) return message.reply({ allowedMentions: { repliedUser: false }, content: `${member.username} n'est pas owner` });
                
                await client.database.delete(`owner_${client.user.id}_${member.id}`);
                return message.reply({ allowedMentions: { repliedUser: false }, content: `${member.username} n'est plus owner` });
            } else if (args[0] === "list") {
                const allData = await client.database.all();
                const data = allData.filter(data => data.id.startsWith(`owner_${client.user.id}`)).sort((a, b) => b.value - a.value);
                const count = 15;
                let p0 = 0;
                let p1 = count;
                let page = 1;

                let embed = new EmbedBuilder()
                    .setTitle(`Owner`)
                    .setFooter({ text: `${page} / ${Math.ceil(data.length / count) === 0 ? 1 : Math.ceil(data.length / count)}` })
                    .setColor(color)
                    .setDescription(data
                        // .filter(x => message.guild.members.cache.get(x.id.split('_')[2]))
                        .slice(p0, p1).map((m, c) => `<@${m.id.split("_")[2]}> `).join("\n") || "Aucune donnée trouvée");
                const msg = await message.reply({ allowedMentions: { repliedUser: false }, content: `Chargement...` });

                if (data.length > count) {
                    const btn = new ActionRowBuilder()
                        .addComponents(new ButtonBuilder()
                            .setCustomId(`owner1_${message.id}`)
                            .setLabel('◀')
                            .setStyle(ButtonStyle.Primary))
                        .addComponents(new ButtonBuilder()
                            .setCustomId(`owner2_${message.id}`)
                            .setLabel('▶')
                            .setStyle(ButtonStyle.Primary));
                    msg.edit({ content: null, allowedMentions: { repliedUser: false }, embeds: [embed], components: [btn] });
                    setTimeout(() => {
                        message.delete().catch(error => {});
                        return msg.delete().catch(error => {});
                    }, 60000 * 5);

                    const collector = msg.createMessageComponentCollector({ filter: i => i.customId.startsWith('owner') && i.user.id === message.author.id, time: 60000 * 5 });
                    collector.on("collect", async interaction => {
                        if (interaction.user.id !== message.author.id) return;
                        await interaction.deferUpdate().catch(error => {});

                        if (interaction.customId === `owner1_${message.id}`) {
                            if (p0 - count < 0) return;
                            if (p0 - count === undefined || p1 - count === undefined) return;

                            p0 = p0 - count;
                            p1 = p1 - count;
                            page = page - 1

                            embed.setFooter({ text: `${page} / ${Math.ceil(data.length / count) === 0 ? 1 : Math.ceil(data.length / count)}` })
                                .setDescription(data
                                    // .filter(x => message.guild.members.cache.get(x.id.split('_')[2]))
                                    .slice(p0, p1).map((m, c) => `<@${m.id.split("_")[2]}> `).join("\n") || "Aucune donnée trouvée");
                            msg.edit({ embeds: [embed] }).catch(error => {});
                        }
                        if (interaction.customId === `owner2_${message.id}`) {
                            if (p1 + count > data.length + count) return;
                            if (p0 + count === undefined || p1 + count === undefined) return;

                            p0 = p0 + count;
                            p1 = p1 + count;
                            page++;

                            embed.setFooter({ text: `${page} / ${Math.ceil(data.length / count) === 0 ? 1 : Math.ceil(data.length / count)}` })
                                .setDescription(data
                                    // .filter(x => message.guild.members.cache.get(x.id.split('_')[2]))
                                    .slice(p0, p1).map((m, c) => `<@${m.id.split("_")[2]}> `).join("\n") || "Aucune donnée trouvée");
                            msg.edit({ embeds: [embed] }).catch(error => {});
                        }
                    });
                } else {
                    msg.edit({ content: null, allowedMentions: { repliedUser: false }, embeds: [embed] }).catch(error => {});
                }
            }
        }
    }
}
