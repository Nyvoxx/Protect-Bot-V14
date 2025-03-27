const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
module.exports = {
    name: 'whitelist',
    description: "Ajout ou suppression d'un membre whitelist",
    usage: "whitelist add @membre",
    cooldown: 10,
    aliases: ["wl"],
    go: async (client, message, args, prefix, color) => {
        if (await client.database.get(`owner_${client.user.id}_${message.author.id}`) === true) {
            if (args[0] === "add") {
                let member = client.users.cache.get(message.author.id);
                if (args[1]) member = client.users.cache.get(args[1]);
                else return message.reply({ allowedMentions: { repliedUser: false }, content: `Aucun membre trouvé pour \`${args[1] || "❌"}\`` });
                if (message.mentions.members.first()) member = client.users.cache.get(message.mentions.members.first().id);
                if (!member) return message.reply({ allowedMentions: { repliedUser: false }, content: `Aucun membre trouvé pour \`${args[1] || "❌"}\`` });
                if (await client.database.get(`wl_${message.guild.id}_${member.id}`) === true) return message.reply({ allowedMentions: { repliedUser: false }, content: `${member.username} est déjà whitelist` });
                await client.database.set(`wl_${message.guild.id}_${member.id}`, true)
                return message.reply({ allowedMentions: { repliedUser: false }, content: `${member.username} est maintenant whitelist` });
            } else if (args[0] === "clear") {
                const data = await client.database.all();
                const filteredData = data.filter(item => item.id.startsWith(`wl_${message.guild.id}`));
                let clear = 0;
                for (let i = 0; i < filteredData.length; i++) {
                    await client.database.delete(filteredData[i].id);
                    clear++;
                };
                return message.reply({ allowedMentions: { repliedUser: false }, content: `${filteredData.length ? filteredData.length : 0} ${filteredData.length > 1 ? "personnes ont été supprimées " : "personne a été supprimée"} des whitelists` });
            } else if (args[0] === "remove") {
                let member = client.users.cache.get(message.author.id);
                if (args[1]) member = client.users.cache.get(args[1]);
                else return message.reply({ allowedMentions: { repliedUser: false }, content: `Aucun membre trouvé pour \`${args[1] || "❌"}\`` });
                if (message.mentions.members.first()) member = client.users.cache.get(message.mentions.members.first().id);
                if (!member) return message.reply({ allowedMentions: { repliedUser: false }, content: `Aucun membre trouvé pour \`${args[1] || "❌"}\`` });
                if (await client.database.get(`wl_${message.guild.id}_${member.id}`) === null) return message.reply({ allowedMentions: { repliedUser: false }, content: `${member.username} n'est pas whitelist` });
                await client.database.delete(`wl_${message.guild.id}_${member.id}`)
                return message.reply({ allowedMentions: { repliedUser: false }, content: `${member.username} n'est plus whitelist` });
            } else if (args[0] === "list") {
                const allData = await client.database.all();
                const data = allData.filter(item => item.id.startsWith(`wl_${message.guild.id}`)).sort((a, b) => b.value - a.value);
                const count = 15;
                let p0 = 0;
                let p1 = count;
                let page = 1;

                let embed = new EmbedBuilder()
                    .setTitle(`Whitelist`)
                    .setFooter({ text: `${page} / ${Math.ceil(data.length / count) === 0 ? 1 : Math.ceil(data.length / count)}` })
                    .setColor(color)
                    .setDescription(data
                        .slice(p0, p1).map((m, c) => `<@${m.id.split("_")[2]}> `).join("\n") || "Aucune donnée trouvée");
                const msg = await message.reply({ content: `Chargement...`, allowedMentions: { repliedUser: false } });

                if (data.length > count) {
                    const btn = new ActionRowBuilder()
                        .addComponents(new ButtonBuilder()
                            .setCustomId(`wl1_${message.id}`)
                            .setLabel('◀')
                            .setStyle(ButtonStyle.Primary))
                        .addComponents(new ButtonBuilder()
                            .setCustomId(`wl2_${message.id}`)
                            .setLabel('▶')
                            .setStyle(ButtonStyle.Primary));
                    msg.edit({ content: null, allowedMentions: { repliedUser: false }, embeds: [embed], components: [btn] }).catch(error => {});
                    setTimeout(() => {
                        message.delete().catch(error => {});
                        return msg.delete().catch(error => {});
                    }, 60000 * 5);

                    const collector = msg.createMessageComponentCollector({ filter: i => i.customId.startsWith('wl') && i.user.id === message.author.id, time: 60000 * 5 });
                    collector.on("collect", async interaction => {
                        if (interaction.user.id !== message.author.id) return;
                        await interaction.deferUpdate().catch(error => {});

                        if (interaction.customId === `wl1_${message.id}`) {
                            if (p0 - count < 0) return;
                            if (p0 - count === undefined || p1 - count === undefined) return;

                            p0 = p0 - count;
                            p1 = p1 - count;
                            page = page - 1

                            embed.setFooter({ text: `${page} / ${Math.ceil(data.length / count) === 0 ? 1 : Math.ceil(data.length / count)}` })
                                .setDescription(data
                                    .slice(p0, p1).map((m, c) => `<@${m.id.split("_")[2]}> `).join("\n") || "Aucune donnée trouvée");
                            msg.edit({ embeds: [embed] }).catch(error => {});
                        }
                        if (interaction.customId === `wl2_${message.id}`) {
                            if (p1 + count > data.length + count) return;
                            if (p0 + count === undefined || p1 + count === undefined) return;

                            p0 = p0 + count;
                            p1 = p1 + count;
                            page++;

                            embed.setFooter({ text: `${page} / ${Math.ceil(data.length / count) === 0 ? 1 : Math.ceil(data.length / count)}` })
                                .setDescription(data
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