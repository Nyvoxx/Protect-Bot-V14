module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === "DM") return;

    const prefix = await client.database.get(`prefix_${message.guild.id}`) || client.config.prefix;
    const color = await client.database.get(`color_${message.guild.id}`) || client.config.color;

    if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`)) !== null) {
        const isOwner = client.config.owner.includes(message.author.id) || 
                      await client.database.get(`owner_${client.user.id}_${message.author.id}`) === true;
        
        if (isOwner) {
            return message.reply({ content: `Mon prefix : \`${prefix}\``, allowedMentions: { repliedUser: false } });
        }
    }

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    
    if (!prefixRegex.test(message.content)) return;
    
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName) || 
                   client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (command) {
        
        if (!client.cooldowns) client.cooldowns = new Map();
        
        const now = Date.now();
        const timestamps = client.cooldowns.get(command.name) || new Map();
        const cooldownAmount = (command.cooldown || 3) * 1000; 
        
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply({ 
                    content: `Merci d'attendre ${timeLeft.toFixed(1)} secondes avant de réutiliser la commande \`${command.name}\`.`, 
                    allowedMentions: { repliedUser: false }
                });
            }
        }
        
        timestamps.set(message.author.id, now);
        client.cooldowns.set(command.name, timestamps);
        
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        
        command.go(client, message, args, prefix, color);
    }
}
