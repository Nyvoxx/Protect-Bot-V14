const logs = require("../../util/logs.js");

module.exports = async (client, oldChannel, newChannel) => {
    const guild = oldChannel.guild;
    const dbname = "channeledit";
    const name = "Modification de salon";
    const raison = `Antiraid | ${name}`;

    await channel_update();
    await perm_update();
    await perm_add();
    await perm_delete();

    async function channel_update() {
        try {
            const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: 11 });
            const auditEntry = auditLogs.entries.first();
            if (!auditEntry) return;

            const executor = guild.members.cache.get(auditEntry.executor.id);
            if (!executor) return;

            let perm = false;
            let punish = "";
            let user_punish = false;

            const enabled = await client.database.get(`${dbname}_${guild.id}`);
            if (!enabled) return;

            if (client.user.id === executor.id || 
                guild.ownerId === executor.id || 
                client.config.owner.includes(executor.id) || 
                await client.database.get(`owner_${client.user.id}_${executor.id}`) === true) {
                perm = true;
            }

            if (await client.database.get(`wl_${guild.id}_${executor.id}`) === true) {
                perm = true;
            }

            const moduleWl = await client.database.get(`${dbname}wl_${guild.id}`);
            if (moduleWl && moduleWl !== true) {
                if (Array.isArray(moduleWl) && moduleWl.includes(executor.id)) {
                    perm = true;
                }
            }

            if (!perm) {
                const sanction = await client.database.get(`${dbname}sanction_${guild.id}`);
                if (!sanction || sanction === "kick") punish = "kick";
                else if (sanction === "ban") punish = "ban";
                else if (sanction === "derank") punish = "derank";

                try {
                    await newChannel.edit({
                        name: oldChannel.name,
                        permissions: oldChannel.permissionsOverwrites,
                        type: oldChannel.type,
                        topic: oldChannel.topic,
                        nsfw: oldChannel.nsfw,
                        bitrate: oldChannel.bitrate,
                        userLimit: oldChannel.userLimit,
                        rateLimitPerUser: oldChannel.rateLimitPerUser,
                        position: oldChannel.rawPosition,
                        reason: raison
                    });

                    if (punish === "ban") {
                        await executor.ban({ reason: raison });
                        user_punish = true;
                    } else if (punish === "kick") {
                        await executor.kick(raison);
                        user_punish = true;
                    } else if (punish === "derank") {
                        await executor.roles.set([], { reason: raison });
                        user_punish = true;
                    }
                } catch (error) {
                    console.error("Erreur lors de la restauration du salon ou de la sanction:", error);
                }

                const logObj = {
                    client: client,
                    guild: guild,
                    executor: executor.id,
                    punish: user_punish ? `🟢 ${punish}` : `🔴 ${punish}`,
                    name: name,
                    salon: `${oldChannel.name}`
                };

                await logs(logObj);
            }
        } catch (error) {
            console.error("Erreur dans channel_update:", error);
        }
    }

    async function perm_update() {
        try {
            const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: 14 });
            const auditEntry = auditLogs.entries.first();
            if (!auditEntry) return;

            const executor = guild.members.cache.get(auditEntry.executor.id);
            if (!executor) return;

            let perm = false;
            let punish = "";
            let user_punish = false;

            const enabled = await client.database.get(`${dbname}_${guild.id}`);
            if (!enabled) return;

            if (client.user.id === executor.id || 
                guild.ownerId === executor.id || 
                client.config.owner.includes(executor.id) || 
                await client.database.get(`owner_${client.user.id}_${executor.id}`) === true) {
                perm = true;
            }

            if (await client.database.get(`wl_${guild.id}_${executor.id}`) === true) {
                perm = true;
            }

            const moduleWl = await client.database.get(`${dbname}wl_${guild.id}`);
            if (moduleWl && moduleWl !== true) {
                if (Array.isArray(moduleWl) && moduleWl.includes(executor.id)) {
                    perm = true;
                }
            }

            if (!perm) {
                const sanction = await client.database.get(`${dbname}sanction_${guild.id}`);
                if (!sanction || sanction === "kick") punish = "kick";
                else if (sanction === "ban") punish = "ban";
                else if (sanction === "derank") punish = "derank";

                try {
                    await newChannel.permissionOverwrites.set(oldChannel.permissionOverwrites.cache);

                    if (punish === "ban") {
                        await executor.ban({ reason: raison });
                        user_punish = true;
                    } else if (punish === "kick") {
                        await executor.kick(raison);
                        user_punish = true;
                    } else if (punish === "derank") {
                        await executor.roles.set([], { reason: raison });
                        user_punish = true;
                    }
                } catch (error) {
                    console.error("Erreur lors de la restauration des permissions ou de la sanction:", error);
                }

                const logObj = {
                    client: client,
                    guild: guild,
                    executor: executor.id,
                    punish: user_punish ? `🟢 ${punish}` : `🔴 ${punish}`,
                    name: name,
                    salon: `${oldChannel.name}`
                };

                await logs(logObj);
            }
        } catch (error) {
            console.error("Erreur dans perm_update:", error);
        }
    }

    async function perm_add() {
        try {
            const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: 13 });
            const auditEntry = auditLogs.entries.first();
            if (!auditEntry) return;

            const executor = guild.members.cache.get(auditEntry.executor.id);
            if (!executor) return;

            let perm = false;
            let punish = "";
            let user_punish = false;

            const enabled = await client.database.get(`${dbname}_${guild.id}`);
            if (!enabled) return;

            if (client.user.id === executor.id || 
                guild.ownerId === executor.id || 
                client.config.owner.includes(executor.id) || 
                await client.database.get(`owner_${client.user.id}_${executor.id}`) === true) {
                perm = true;
            }

            if (await client.database.get(`wl_${guild.id}_${executor.id}`) === true) {
                perm = true;
            }

            const moduleWl = await client.database.get(`${dbname}wl_${guild.id}`);
            if (moduleWl && moduleWl !== true) {
                if (Array.isArray(moduleWl) && moduleWl.includes(executor.id)) {
                    perm = true;
                }
            }

            if (!perm) {
                const sanction = await client.database.get(`${dbname}sanction_${guild.id}`);
                if (!sanction || sanction === "kick") punish = "kick";
                else if (sanction === "ban") punish = "ban";
                else if (sanction === "derank") punish = "derank";

                try {
                    await newChannel.permissionOverwrites.set(oldChannel.permissionOverwrites.cache);

                    if (punish === "ban") {
                        await executor.ban({ reason: raison });
                        user_punish = true;
                    } else if (punish === "kick") {
                        await executor.kick(raison);
                        user_punish = true;
                    } else if (punish === "derank") {
                        await executor.roles.set([], { reason: raison });
                        user_punish = true;
                    }
                } catch (error) {
                    console.error("Erreur lors de la restauration des permissions ou de la sanction:", error);
                }

                const logObj = {
                    client: client,
                    guild: guild,
                    executor: executor.id,
                    punish: user_punish ? `🟢 ${punish}` : `🔴 ${punish}`,
                    name: name,
                    salon: `${oldChannel.name}`
                };

                await logs(logObj);
            }
        } catch (error) {
            console.error("Erreur dans perm_add:", error);
        }
    }

    async function perm_delete() {
        try {
            const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: 15 });
            const auditEntry = auditLogs.entries.first();
            if (!auditEntry) return;

            const executor = guild.members.cache.get(auditEntry.executor.id);
            if (!executor) return;

            let perm = false;
            let punish = "";
            let user_punish = false;

            const enabled = await client.database.get(`${dbname}_${guild.id}`);
            if (!enabled) return;

            if (client.user.id === executor.id || 
                guild.ownerId === executor.id || 
                client.config.owner.includes(executor.id) || 
                await client.database.get(`owner_${client.user.id}_${executor.id}`) === true) {
                perm = true;
            }

            if (await client.database.get(`wl_${guild.id}_${executor.id}`) === true) {
                perm = true;
            }

            const moduleWl = await client.database.get(`${dbname}wl_${guild.id}`);
            if (moduleWl && moduleWl !== true) {
                if (Array.isArray(moduleWl) && moduleWl.includes(executor.id)) {
                    perm = true;
                }
            }

            if (!perm) {
                const sanction = await client.database.get(`${dbname}sanction_${guild.id}`);
                if (!sanction || sanction === "kick") punish = "kick";
                else if (sanction === "ban") punish = "ban";
                else if (sanction === "derank") punish = "derank";

                try {
                    await newChannel.permissionOverwrites.set(oldChannel.permissionOverwrites.cache);

                    if (punish === "ban") {
                        await executor.ban({ reason: raison });
                        user_punish = true;
                    } else if (punish === "kick") {
                        await executor.kick(raison);
                        user_punish = true;
                    } else if (punish === "derank") {
                        await executor.roles.set([], { reason: raison });
                        user_punish = true;
                    }
                } catch (error) {
                    console.error("Erreur lors de la restauration des permissions ou de la sanction:", error);
                }

                const logObj = {
                    client: client,
                    guild: guild,
                    executor: executor.id,
                    punish: user_punish ? `🟢 ${punish}` : `🔴 ${punish}`,
                    name: name,
                    salon: `${oldChannel.name}`
                };

                await logs(logObj);
            }
        } catch (error) {
            console.error("Erreur dans perm_delete:", error);
        }
    }
}
