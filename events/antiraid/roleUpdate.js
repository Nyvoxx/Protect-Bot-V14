const logs = require("../../util/logs.js");

module.exports = async (client, oldRole, newRole) => {
    if (!oldRole.guild) return;
    
    const guild = oldRole.guild;
    const dbname = "roleedit";
    const name = "Modification de rôle";
    const raison = `Antiraid | ${name}`;
    
    try {

        const auditLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 31 
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
                await newRole.edit({
                    name: oldRole.name,
                    color: oldRole.hexColor,
                    permissions: oldRole.permissions,
                    hoist: oldRole.hoist,
                    mentionable: oldRole.mentionable,
                    position: oldRole.rawPosition,
                    reason: raison
                });
            } catch (error) {
                console.error("Erreur lors de la restauration du rôle:", error);
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
                roles: oldRole.name
            };
            
            await logs(logObj);
        }
    } catch (error) {
        console.error("Erreur dans roleUpdate:", error);
    }
}
