const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

module.exports = {
    name: "setup",
    description: "Configuration des évenements d'antiraid",
    usage: "setup",
    cooldown: 10,
    aliases: ["antiraid"],
    go: async (client, message, args, prefix, color) => {
        if (await client.database.get(`owner_${client.user.id}_${message.author.id}`) === true) {
            const lgs = { name: "Logs", emoji: "1️⃣", type: 1, db: "logs" };
            const array1 = [
                { name: "Création de rôle", emoji: "2️⃣", db: "rolecreate" },
                { name: "Suppression de rôle", emoji: "3️⃣", db: "roledelete" },
                { name: "Modification de rôle", emoji: "4️⃣", db: "roleedit" },
                { name: "Ajout de rôle avec des permissions dangereuses", emoji: "5️⃣", db: "roleadd" },
            ]
            const array2 = [
                { name: "Création de salon", emoji: "2️⃣", db: "channelcreate" },
                { name: "Suppression de salon", emoji: "3️⃣", db: "channeldelete" },
                { name: "Modification de salon", emoji: "4️⃣", db: "channeledit" },
                { name: "Modification du serveur", emoji: "5️⃣", db: "update" },
            ]
            const array3 = [
                { name: "Création de webhook", emoji: "2️⃣", db: "webhook" },
                { name: "Ajout de bot", emoji: "3️⃣", db: "bot" },
                { name: "Bannissement/Expulsion de membre", emoji: "4️⃣", db: "ban" },
                { name: "Message contenant une invitation discord", emoji: "5️⃣", db: "pub", sanction: "exclusion 5m" },
            ];
            const array4 = [
                { name: "Multiplication de ping", emoji: "2️⃣", db: "ping", sanction: "exclusion 5m" },
                { name: "Multiplication de message", emoji: "3️⃣", db: "spam", sanction: "exclusion 5m" },
                { name: "Déconnexion de membre", emoji: "4️⃣", db: "deco" },
                { name: "Mettre en mute des membres", emoji: "5️⃣", db: "mute" },
            ];
            const tableau = [array1, array2, array3, array4];
            if (client.config.owner.includes(message.author.id) || await client.database.get(`owner_${client.user.id}_${message.author.id}`) === true) {
                if (args[0] === "on") {
                    const msg = await message.reply({ content: `Chargement...`, allowedMentions: { repliedUser: false } });
                    for (const array of tableau) {
                        for (const e of array) {
                            await client.database.set(`${e.db}_${message.guild.id}`, true);
                            await client.database.set(`${e.db}wl_${message.guild.id}`, null);
                            await client.database.set(`${e.db}sanction_${message.guild.id}`, "derank");
                        }
                    }
                    msg.edit({ content: "Tout les évenements d'antiraid on été activé", allowedMentions: { repliedUser: false } }).catch(error => {});
                } else if (args[0] === "off") {
                    const msg = await message.reply({ content: `Chargement...`, allowedMentions: { repliedUser: false } });
                    for (const array of tableau) {
                        for (const e of array) {
                            await client.database.set(`${e.db}_${message.guild.id}`, null);
                        }
                    }
                    msg.edit({ content: "Tout les évenements d'antiraid on été désactivé", allowedMentions: { repliedUser: false } }).catch(error => {});
                } else if (args[0] === "max") {
                    const msg = await message.reply({ content: `Chargement...`, allowedMentions: { repliedUser: false } });
                    for (const array of tableau) {
                        for (const e of array) {
                            await client.database.set(`${e.db}_${message.guild.id}`, true);
                            await client.database.set(`${e.db}wl_${message.guild.id}`, true);
                            await client.database.set(`${e.db}sanction_${message.guild.id}`, "ban");
                        }
                    }
                    msg.edit({ content: "Tout les évenements d'antiraid on été activé en `max`", allowedMentions: { repliedUser: false } }).catch(error => {});
                } else if (args[0] === "config" || !args[0]) {
                    const msg = await message.reply({ content: `Chargement...`, allowedMentions: { repliedUser: false } });
                    await page1()
                    setTimeout(() => {
                        message.delete().catch(error => {});
                        return msg.delete().catch(error => {});
                    }, 60000 * 10);
                    const collector = msg.createMessageComponentCollector({ filter: i => ComponentType.Button && i.user.id === message.author.id, time: 60000 * 10 });
                    collector.on("collect", async i => {
                        if (i.user.id !== message.author.id) return;
                        await i.deferUpdate().catch(error => {});
                        if (i.customId === "antiraid4_" + message.id) {
                            page4()
                        }
                        if (i.customId === "antiraid3_" + message.id) {
                            page3()
                        }
                        if (i.customId === "antiraid2_" + message.id) {
                            page2()
                        }
                        if (i.customId === "antiraid1_" + message.id) {
                            page1()
                        }
                    });
                    const collector2 = msg.createMessageComponentCollector({ filter: i => ComponentType.StringSelect && i.user.id === message.author.id, time: 60000 * 10 });
                    collector2.on("collect", async (i) => {
                        if (i.user.id !== message.author.id) return;
                        const value = i.values[0];
                        await i.deferUpdate().catch(error => {});
                        if (value === "Logs") {
                            const embed = new EmbedBuilder()
                                .setColor(color)
                                .setDescription(`Quelle est **le nouveau salon de logs** ?`);
                            const msg = await i.channel.send({ embeds: [embed] });
                            let cld = await msg.channel.awaitMessages({ filter: (r) => { return r.author.id === i.user.id }, max: 1, time: 60000 * 10, errors: ["time"] });
                            cld = cld.first();
                            msg.delete().catch(error => {});
                            cld.delete().catch(error => {});
                            const embed2 = new EmbedBuilder()
                                .setColor(color)
                                .setDescription(`Aucun salon trouvé pour \`${cld.content}\``);
                            const channel = message.guild.channels.cache.get(cld.content) || cld.mentions.channels.first();
                            if (!channel) return i.channel.send({ embeds: [embed2] });
                            await client.database.set(`${lgs.db}_${message.guild.id}`, channel.id)
                            page1()
                        }
                        for (const array of tableau) {
                            for (const e of array) {
                                if (value === e.name + "_" + message.id) {
                                    const menu = new ActionRowBuilder()
                                        .addComponents(new StringSelectMenuBuilder()
                                            .setCustomId(`${e.name}onoff_${message.id} `)
                                            .setPlaceholder("Activité")
                                            .addOptions(
                                                { label: `・ On `, value: e.name + "on_" + message.id, emoji: "✅", description: "Activer: " + e.name },
                                                { label: `・ Off `, value: e.name + "off_" + message.id, emoji: "❌", description: "Desactiver: " + e.name },
                                            ))
                                    const menu2 = new ActionRowBuilder()
                                        .addComponents(new StringSelectMenuBuilder()
                                            .setCustomId(`${e.name}wl_${message.id} `)
                                            .setPlaceholder("Whitelist Bypass")
                                            .addOptions(
                                                { label: `・ WhitelistBypass On `, value: e.name + "wla_" + message.id, emoji: "👤", description: "Activer la whitelist bypass pour: " + e.name },
                                                { label: `・ WhitelistBypass Off `, value: e.name + "wld_" + message.id, emoji: "👥", description: "Desactiver la whitelist bypass pour: " + e.name },
                                            ))
                                    const menu3 = new ActionRowBuilder()
                                        .addComponents(new StringSelectMenuBuilder()
                                            .setCustomId(`${e.name}sanction_${message.id} `)
                                            .setPlaceholder("Sanctions")
                                            .addOptions(
                                                { label: `・ Derank `, value: e.name + "derank_" + message.id, emoji: "👤", description: "Définir la sanction derank pour: " + e.name },
                                                { label: `・ Kick `, value: e.name + "kick_" + message.id, emoji: "⚡", description: "Définir la sanction kick pour: " + e.name },
                                                { label: `・ Ban `, value: e.name + "ban_" + message.id, emoji: "🔌", description: "Définir la sanction ban pour: " + e.name },
                                            ))
                                    const btn = new ActionRowBuilder()
                                        .addComponents(new ButtonBuilder()
                                            .setCustomId(e.name + "yes_" + message.id)
                                            .setEmoji("✅")
                                            .setStyle(ButtonStyle.Success))
                                        .addComponents(new ButtonBuilder()
                                            .setCustomId(e.name + "non_" + message.id)
                                            .setEmoji("✖")
                                            .setStyle(ButtonStyle.Danger))
                                    const embed = new EmbedBuilder()
                                        .setTitle(`${e.emoji} ・ ${e.name}`)
                                        .setColor(color)
                                    let msg2;
                                    if (e.sanction) msg2 = await i.channel.send({ embeds: [embed], components: [menu, menu2, btn] });
                                    else msg2 = await i.channel.send({ embeds: [embed], components: [menu, menu2, menu3, btn] });
                                    const collector4 = msg2.createMessageComponentCollector({ filter: i => ComponentType.StringSelect && i.user.id === message.author.id, time: 60000 * 10 });
                                    collector4.on("collect", async (i2) => {
                                        if (i2.user.id !== message.author.id) return;
                                        const value2 = i2.values[0];
                                        await i2.deferUpdate().catch(error => {});
                                        if (value2 === e.name + "on_" + message.id) {
                                            await client.database.set(`tempevent_${e.name}_${message.id}`, true)
                                        };
                                        if (value2 === e.name + "off_" + message.id) {
                                            await client.database.set(`tempevent_${e.name}_${message.id}`, null)
                                        };
                                        if (value2 === e.name + "wla_" + message.id) {
                                            await client.database.set(`tempwl_${e.name}_${message.id}`, null)
                                        };
                                        if (value2 === e.name + "wld_" + message.id) {
                                            await client.database.set(`tempwl_${e.name}_${message.id}`, true)
                                        };
                                        if (value2 === e.name + "derank_" + message.id) {
                                            await client.database.set(`temppunish_${e.name}_${message.id}`, "derank")
                                        };
                                        if (value2 === e.name + "kick_" + message.id) {
                                            await client.database.set(`temppunish_${e.name}_${message.id}`, "kick")
                                        };
                                        if (value2 === e.name + "ban_" + message.id) {
                                            await client.database.set(`temppunish_${e.name}_${message.id}`, "ban")
                                        };
                                    });
                                    const collector3 = msg2.createMessageComponentCollector({ filter: i => ComponentType.Button && i.user.id === message.author.id, time: 60000 * 10 });
                                    collector3.on("collect", async (i2) => {
                                        if (i2.user.id !== message.author.id) return;
                                        await i2.deferUpdate().catch(error => {});
                                        if (i2.customId === e.name + "yes_" + message.id) {
                                            const wl = await client.database.get(`tempwl_${e.name}_${message.id}`) || null;
                                            const punish = await client.database.get(`temppunish_${e.name}_${message.id}`) || null;
                                            const evt = await client.database.get(`tempevent_${e.name}_${message.id}`) || null;

                                            if (wl) await client.database.set(`${e.db}wl_${message.guild.id}`, wl);
                                            if (punish) await client.database.set(`${e.db}sanction_${message.guild.id}`, punish);
                                            if (evt) await client.database.set(`${e.db}_${message.guild.id}`, evt);
                                            await client.database.delete(`tempevent_${e.name}_${message.id}`)
                                            await client.database.delete(`temppunish_${e.name}_${message.id}`)
                                            await client.database.delete(`tempwl_${e.name}_${message.id}`)
                                            msg2.delete().catch(error => {});
                                            for (const i of array1) {
                                                if (i.name === e.name) return page1()
                                            }
                                            for (const i of array2) {
                                                if (i.name === e.name) return page2()
                                            }
                                            for (const i of array3) {
                                                if (i.name === e.name) return page3()
                                            }
                                            for (const i of array4) {
                                                if (i.name === e.name) return page4()
                                            }
                                        };
                                        if (i2.customId === e.name + "non_" + message.id) {
                                            await client.database.delete(`tempevent_${e.name}_${message.id}`)
                                            await client.database.delete(`temppunish_${e.name}_${message.id}`)
                                            await client.database.delete(`tempwl_${e.name}_${message.id}`)
                                            msg2.delete().catch(error => {});
                                        };
                                    });
                                }
                            }
                        }
                    });


                    function all(e) {
                        return async function() {
                            const event1 = onoff(await client.database.get(`${e.db}_${message.guild.id}`));
                            const event2 = e.sanction ? e.sanction : (await client.database.get(`${e.db}sanction_${message.guild.id}`) === null ? "kick" : await client.database.get(`${e.db}sanction_${message.guild.id}`));
                            const event3 = onoff(!(await client.database.get(`${e.db}wl_${message.guild.id}`)) ? true : false);
                            return `Actif: \`${event1}\`\nSanction: \`${event2}\`\nWhitelist bypass: \`${event3}\``
                        }();
                    };

                    function logs(name) {
                        return async function() {
                            const logs = message.guild.channels.cache.get(await client.database.get(`${name}_${message.guild.id}`))
                            if (!logs) return "`🔴`";
                            else return `<#${logs.id}>`
                        }();
                    };

                    function onoff(antiraid) {
                        if (!antiraid) return "`🔴`";
                        if (antiraid) return "`🟢`";
                    };

                    async function page1() {
                        let array_menu = [];
                        let array_filds = [];
                        array_filds.push({ name: `${lgs.emoji} ・ ${lgs.name} `, value: `Salon: ${await logs(lgs.db)} ` });
                        array_menu.push({ label: `・ ${lgs.name}`, value: lgs.name, emoji: lgs.emoji, description: "" });
                        array1.forEach(async e => {
                            array_filds.push({ name: `${e.emoji} ・ ${e.name} `, value: `${await all(e)} ` });
                            array_menu.push({ label: `・ ${e.name} `, value: e.name + "_" + message.id, emoji: e.emoji, description: "" });
                        });
                        array_menu.push({ label: `・ Annuler `, value: "Annuler", emoji: "❌", description: "" });
                        const menu = new ActionRowBuilder()
                            .addComponents(new StringSelectMenuBuilder()
                                .setCustomId(`menu1_${message.id} `)
                                .setPlaceholder("Faix un choix")
                                .addOptions(array_menu));

                        const btn = new ActionRowBuilder()
                            .addComponents(new ButtonBuilder()
                                .setCustomId("antiraid4_" + message.id)
                                .setLabel("◀")
                                // .setDisabled(true)
                                .setStyle(ButtonStyle.Primary))
                            .addComponents(new ButtonBuilder()
                                .setCustomId("antiraid2_" + message.id)
                                .setLabel("▶")
                                .setStyle(ButtonStyle.Primary));

                        const embed = new EmbedBuilder()
                            .setTitle(`Configuration des évenements d"antiraid`)
                            .setColor(color)
                            .addFields(array_filds)
                            .setFooter({ text: `1 / 4` });
                        msg.edit({ content: null, allowedMentions: { repliedUser: false }, embeds: [embed], components: [menu, btn] }).catch(error => {});

                    }

                    async function page2() {
                        let array_menu = [];
                        let array_filds = [];
                        array_filds.push({ name: `${lgs.emoji} ・ ${lgs.name} `, value: `Salon: ${await logs(lgs.db)} ` });
                        array_menu.push({ label: `・ ${lgs.name} `, value: lgs.name, emoji: lgs.emoji, description: "" });
                        array2.forEach(async e => {
                            array_filds.push({ name: `${e.emoji} ・ ${e.name} `, value: `${await all(e)} ` });
                            array_menu.push({ label: `・ ${e.name} `, value: e.name + "_" + message.id, emoji: e.emoji, description: "" });
                        });
                        array_menu.push({ label: `・ Annuler `, value: "Annuler", emoji: "❌", description: "" });
                        const menu = new ActionRowBuilder()
                            .addComponents(new StringSelectMenuBuilder()
                                .setCustomId(`menu2_${message.id} `)
                                .setPlaceholder("Faix un choix")
                                .addOptions(array_menu))

                        const btn = new ActionRowBuilder()
                            .addComponents(new ButtonBuilder()
                                .setCustomId("antiraid1_" + message.id)
                                .setLabel("◀")
                                .setStyle(ButtonStyle.Primary))
                            .addComponents(new ButtonBuilder()
                                .setCustomId("antiraid3_" + message.id)
                                .setLabel("▶")
                                .setStyle(ButtonStyle.Primary));

                        const embed = new EmbedBuilder()
                            .setTitle(`Configuration des évenements d"antiraid`)
                            .setColor(color)
                            .addFields(array_filds)
                            .setFooter({ text: `2 / 4` });
                        msg.edit({ content: null, allowedMentions: { repliedUser: false }, embeds: [embed], components: [menu, btn] }).catch(error => {});

                    }

                    async function page3() {
                        let array_menu = [];
                        let array_filds = [];
                        array_filds.push({ name: `${lgs.emoji} ・ ${lgs.name} `, value: `Salon: ${await logs(lgs.db)} ` });
                        array_menu.push({ label: `・ ${lgs.name} `, value: lgs.name, emoji: lgs.emoji, description: "" });
                        array3.forEach(async e => {
                            array_filds.push({ name: `${e.emoji} ・ ${e.name} `, value: `${await all(e)} ` });
                            array_menu.push({ label: `・ ${e.name} `, value: e.name + "_" + message.id, emoji: e.emoji, description: "" });
                        });
                        array_menu.push({ label: `・ Annuler `, value: "Annuler", emoji: "❌", description: "" });
                        const menu = new ActionRowBuilder()
                            .addComponents(new StringSelectMenuBuilder()
                                .setCustomId(`menu3_${message.id} `)
                                .setPlaceholder("Faix un choix")
                                .addOptions(array_menu));

                        const btn = new ActionRowBuilder()
                            .addComponents(new ButtonBuilder()
                                .setCustomId("antiraid2_" + message.id)
                                .setLabel("◀")
                                .setStyle(ButtonStyle.Primary))
                            .addComponents(new ButtonBuilder()
                                .setCustomId("antiraid4_" + message.id)
                                .setLabel("▶")
                                // .setDisabled(true)
                                .setStyle(ButtonStyle.Primary));

                        const embed = new EmbedBuilder()
                            .setTitle(`Configuration des évenements d"antiraid`)
                            .setColor(color)
                            .addFields(array_filds)
                            .setFooter({ text: `3 / 4` });
                        msg.edit({ content: null, allowedMentions: { repliedUser: false }, embeds: [embed], components: [menu, btn] }).catch(error => {});
                    }
                    async function page4() {
                        let array_menu = [];
                        let array_filds = [];
                        array_filds.push({ name: `${lgs.emoji} ・ ${lgs.name} `, value: `Salon: ${await logs(lgs.db)} ` });
                        array_menu.push({ label: `・ ${lgs.name} `, value: lgs.name, emoji: lgs.emoji, description: "" });
                        array4.forEach(async e => {
                            array_filds.push({ name: `${e.emoji} ・ ${e.name} `, value: `${await all(e)} ` });
                            array_menu.push({ label: `・ ${e.name} `, value: e.name + "_" + message.id, emoji: e.emoji, description: "" });
                        });
                        array_menu.push({ label: `・ Annuler `, value: "Annuler", emoji: "❌", description: "" });
                        const menu = new ActionRowBuilder()
                            .addComponents(new StringSelectMenuBuilder()
                                .setCustomId(`menu3_${message.id} `)
                                .setPlaceholder("Faix un choix")
                                .addOptions(array_menu))

                        const btn = new ActionRowBuilder()
                            .addComponents(new ButtonBuilder()
                                .setCustomId("antiraid3_" + message.id)
                                .setLabel("◀")
                                .setStyle(ButtonStyle.Primary))
                            .addComponents(new ButtonBuilder()
                                .setCustomId("antiraid1_" + message.id)
                                .setLabel("▶")
                                // .setDisabled(true)
                                .setStyle(ButtonStyle.Primary));

                        const embed = new EmbedBuilder()
                            .setTitle(`Configuration des évenements d"antiraid`)
                            .setColor(color)
                            .addFields(array_filds)
                            .setFooter({ text: `4 / 4` });
                        msg.edit({ content: null, allowedMentions: { repliedUser: false }, embeds: [embed], components: [menu, btn] }).catch(error => {});
                    }
                }
            }
        }
    }
}

