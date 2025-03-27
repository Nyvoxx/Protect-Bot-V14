const logs = require("../../util/logs.js");

module.exports = async (client, message) => {
    if (!message.guild || !message.author || message.author.bot) return;
    
    const guild = message.guild;
    const executor = guild.members.cache.get(message.author.id);
    if (executor) {
        await ping();
        await pub();
        await spam();
    }

    async function ping() {
        const dbname = "ping";
        const name = "Multiplication de ping";
        const raison = `Antiraid | ${name}`;
        let perm = false;
        let user_punish = false;
        
        const pingTerms = ["@everyone", "@here"];
        
        if (pingTerms.some(word => message.content.includes(word))) {
            await client.database.add(`messagespingcount_${guild.id}_${executor.id}`, 1);
            const pingCount = await client.database.get(`messagespingcount_${guild.id}_${executor.id}`);
            
            const enabled = await client.database.get(`${dbname}_${guild.id}`);
            if (!enabled) return;
            
            if (client.user.id === executor.id || 
                guild.ownerId === executor.id || 
                client.config.owner.includes(executor.id) || 
                await client.database.get(`owner_${client.user.id}_${executor.id}`) === true ||
                pingCount <= 3) {
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
                await client.database.delete(`messagespingcount_${guild.id}_${executor.id}`);
                
                try {
                    await message.delete();
                } catch (error) {
                    console.error("Erreur lors de la suppression du message:", error);
                }
                
                try {
                    await executor.roles.set([], { reason: raison });
                    await executor.timeout(60000 * 5, raison);
                    user_punish = true;
                } catch (error) {
                    console.error("Erreur lors de l'application de la sanction:", error);
                }
                
                const logObj = {
                    client: client,
                    guild: guild,
                    executor: executor.id,
                    punish: user_punish ? `🟢 exclusion 5m` : `🔴 exclusion 5m`,
                    name: name
                };
                
                await logs(logObj);
            }
        }
    }
    
    async function spam() {
        const dbname = "spam";
        const name = "Multiplication de message";
        const raison = `Antiraid | ${name}`;
        let perm = false;
        let user_punish = false;
        
        const count = await client.database.add(`messagespamcount_${guild.id}_${executor.id}`, 1);
        
        setTimeout(async () => {
            await client.database.delete(`messagespamcount_${guild.id}_${executor.id}`);
        }, 20000);
        
        if (count >= 5) {
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
                try {
                    const spamMessages = await message.channel.messages.fetch({ limit: 5 });
                    spamMessages.filter(msg => msg.author.id === executor.id).forEach(async m => {
                        try {
                            await m.delete();
                        } catch (deleteError) {
                            console.error("Erreur lors de la suppression d'un message:", deleteError);
                        }
                    });
                    
                    await executor.roles.set([], { reason: raison });
                    await executor.timeout(60000 * 5, raison);
                    user_punish = true;
                } catch (error) {
                    console.error("Erreur lors de l'application de la sanction:", error);
                }
                
                const logObj = {
                    client: client,
                    guild: guild,
                    executor: executor.id,
                    punish: user_punish ? `🟢 exclusion 5m` : `🔴 exclusion 5m`,
                    name: name
                };
                
                await logs(logObj);
            }
        }
    }
    
    async function pub() {
        const discord = RegExp(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|)|discordapp\/invite)\/.+[^\s]/);
        
        if (discord.test(message.content)) {
            const count = await client.database.add(`pubcount_${guild.id}_${executor.id}`, 1);
            const dbname = "pub";
            const name = "Message contenant une invitation discord";
            const raison = `Antiraid | ${name}`;
            let perm = false;
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
                try {
                    await message.delete();
                } catch (error) {
                    console.error("Erreur lors de la suppression du message:", error);
                }
                
                if (count >= 3) {
                    try {
                        await executor.roles.set([], { reason: raison });
                        await executor.timeout(60000 * 5, raison);
                        user_punish = true;
                    } catch (error) {
                        console.error("Erreur lors de l'application de la sanction:", error);
                    }
                    
                    const logObj = {
                        client: client,
                        guild: guild,
                        executor: executor.id,
                        punish: user_punish ? `🟢 exclusion 5m` : `🔴 exclusion 5m`,
                        name: name
                    };
                    
                    await logs(logObj);
                }
            }
        }
    }
}
