module.exports = async (client) => {
    console.log(`> Connecter: ${client.user.tag}`);
    client.user.setActivity({ ActivityType: "Watching", name: "Protège vos serveurs" });
    
    for (const ownerId of client.config.owner) {
        const ownerExists = await client.database.get(`owner_${client.user.id}_${ownerId}`);
        if (ownerExists !== true) {
            await client.database.set(`owner_${client.user.id}_${ownerId}`, true);
        }
    }
}