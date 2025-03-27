const logs = require("../../util/logs.js");

module.exports = async (client, channel) => {
    if (!channel.guild) return;
    
    const guild = channel.guild;
    const dbname = "channel";
    const name = "Création de salon";
    const raison = `Antiraid | ${name}`;
    
    try {

        const auditLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 10 
        });
        
        const auditEntry = auditLogs.entries.first();
        if (!auditEntry) return;
        
        const executor = guild.members.cache.get(auditEntry.executor.id);
        if (!executor) return;
        
        let perm = false;
        
        const enabled = await client.database.get(`${dbname}_${guild.id}`);
        if (!enabled) return;
        
        if (client.config.owner.includes(executor.id) || 
            await client.database.get(`owner_${client.user.id}_${executor.id}`) === true || 
            executor.id === guild.ownerId) {
            perm = true;
        }
        
        const wl = await client.database.get(`${dbname}wl_${guild.id}`);
        if (wl && wl.includes(executor.id)) {
            perm = true;
        }
        
        if (!perm) {

            const sanctionType = await client.database.get(`${dbname}sanction_${guild.id}`);
            
            let punish = "";
            if (!sanctionType || sanctionType === "kick") punish = "kick";
            if (sanctionType === "ban") punish = "ban";
            if (sanctionType === "derank") punish = "derank";
            
            await channel.delete({ reason: raison }).catch(error => {
                console.error("Erreur lors de la suppression du canal:", error);
            });
            
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
                salon: channel.name
            };
            
            await logs(logObj);
        }
    } catch (error) {
        console.error("Erreur dans channelCreate:", error);
    }
}
