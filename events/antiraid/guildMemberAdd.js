const logs = require("../../util/logs.js");

module.exports = async (client, member) => {
    if (!member.guild) return;
    
    const guild = member.guild;
    
    const isBlacklisted = await client.database.get(`bl_${client.user.id}_${member.id}`);
    if (isBlacklisted === true) {
        const name = "Blacklist";
        const raison = `Antiraid | ${name}`;
        let user_punish = false;
        
        try {
            await member.ban({ reason: raison });
            user_punish = true;
        } catch (error) {
            console.error("Erreur lors du bannissement d'un membre blacklisté:", error);
        }
        
        const logObj = {
            client: client,
            guild: guild,
            executor: member.id,
            punish: user_punish ? `🟢 ban` : `🔴 ban`,
            name: name
        };
        
        await logs(logObj);
        return;
    }
    
    if (member.user.bot) {
        const dbname = "bot";
        const name = "Ajout de bot";
        const raison = `Antiraid | ${name}`;
        
        try {
            const auditLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: 28 
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
                    await member.ban({ reason: raison });
                } catch (error) {
                    console.error("Erreur lors du bannissement du bot:", error);
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
                    name: name,
                    bot: member.id
                };
                
                await logs(logObj);
            }
        } catch (error) {
            console.error("Erreur dans guildMemberAdd:", error);
        }
    }
}
