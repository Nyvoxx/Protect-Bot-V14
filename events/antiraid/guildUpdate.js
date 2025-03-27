const logs = require("../../util/logs.js");

module.exports = async (client, oldGuild, newGuild) => {
    const guild = oldGuild;
    const dbname = "update";
    const name = "Modification du serveur";
    const raison = `Antiraid | ${name}`;
    
    try {
        const auditLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 1 
        });
        
        const auditEntry = auditLogs.entries.first();
        if (!auditEntry) return;
        
        const executor = guild.members.cache.get(auditEntry.executor.id);
        if (!executor) return;
        
        const enabled = await client.database.get(`${dbname}_${guild.id}`);
        if (!enabled) return;
        
        let perm = false;
        
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
            const sanctionType = await client.database.get(`${dbname}sanction_${guild.id}`);
            
            let punish = "";
            if (!sanctionType || sanctionType === "kick") punish = "kick";
            if (sanctionType === "ban") punish = "ban";
            if (sanctionType === "derank") punish = "derank";
            
            try {
                await newGuild.setName(oldGuild.name);
                await newGuild.setIcon(oldGuild.iconURL({ dynamic: true }));
                await newGuild.setBanner(oldGuild.bannerURL());
                await newGuild.setChannelPositions([{ channel: oldGuild.id, position: oldGuild.position }]);
                await newGuild.setSystemChannel(oldGuild.systemChannel);
                await newGuild.setSystemChannelFlags(oldGuild.systemChannelFlags);
                await newGuild.setVerificationLevel(oldGuild.verificationLevel);
                await newGuild.setRulesChannel(oldGuild.rulesChannel);
                await newGuild.setPublicUpdatesChannel(oldGuild.publicUpdatesChannel);
                await newGuild.setDefaultMessageNotifications(oldGuild.defaultMessageNotifications);
                await newGuild.setAFKChannel(oldGuild.afkChannel);
                await newGuild.setAFKTimeout(oldGuild.afkTimeout);
                
                if (oldGuild.vanityURLCode) {
                    try {
                        const vanityData = {
                            url: `https://discord.com/api/v9/guilds/${guild.id}/vanity-url`,
                            method: 'PATCH',
                            headers: {
                                'Authorization': `Bot ${client.token}`,
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify({ code: oldGuild.vanityURLCode })
                        };
                        
                        await guild.client.rest.put(
                            `/guilds/${guild.id}/vanity-url`, 
                            { body: { code: oldGuild.vanityURLCode } }
                        );
                    } catch (vanityError) {
                        console.error("Erreur lors de la restauration de l'URL personnalisée:", vanityError);
                    }
                }
            } catch (restoreError) {
                console.error("Erreur lors de la restauration du serveur:", restoreError);
            }
            
            let user_punish = false;
            try {
                if (punish === "ban") {
                    await executor.ban({ reason: raison });
                    user_punish = true;
                } else if (punish === "kick") {
                    await executor.kick({ reason: raison });
                    user_punish = true;
                } else if (punish === "derank") {
                    await executor.roles.set([], { reason: raison });
                    user_punish = true;
                }
            } catch (error) {
                console.error(`Erreur lors de l'application de la sanction ${punish}:`, error);
            }
            
            const logObj = {
                client: client,
                guild: guild,
                executor: executor.id,
                punish: user_punish ? `🟢 ${punish}` : `🔴 ${punish}`,
                name: name
            };
            
            await logs(logObj);
        }
    } catch (error) {
        console.error("Erreur dans guildUpdate:", error);
    }
}
