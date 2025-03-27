const logs = require("../../util/logs.js");

module.exports = async (client, channel) => {
    if (!channel.guild) return;
    
    const guild = channel.guild;
    const dbname = "channeldelete";
    const name = "Suppression de salon";
    const raison = `Antiraid | ${name}`;
    
    try {

        const auditLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 12 
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
                await guild.channels.create({
                    name: channel.name,
                    type: channel.type,
                    topic: channel.topic,
                    nsfw: channel.nsfw,
                    bitrate: channel.bitrate,
                    userLimit: channel.userLimit,
                    parent: channel.parent,
                    permissionOverwrites: channel.permissionOverwrites.cache,
                    position: channel.rawPosition,
                    rateLimitPerUser: channel.rateLimitPerUser,
                    reason: raison
                });
            } catch (error) {
                console.error("Erreur lors de la re-création du canal:", error);
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
                salon: channel.name
            };
            
            await logs(logObj);
        }
    } catch (error) {
        console.error("Erreur dans channelDelete:", error);
    }
}
