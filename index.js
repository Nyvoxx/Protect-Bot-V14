const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { QuickDB } = require('quick.db');
const { readdirSync } = require('fs');
const path = require('path');


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences
	],
	partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction],
	failIfNotExists: false,
	allowedMentions: { parse: ['users', 'roles'], repliedUser: false },
	rest: { timeout: 15000 }
});

process.on("unhandledRejection", (err) => {
	console.error("Erreur non gérée:", err);
});

client.database = new QuickDB();
client.config = require('./config.json');
client.commands = new Collection();
client.aliases = new Collection();
client.logs = logs;
client.header = header;

const loadCommands = (dir = "./cmd/") => {
	try {
		const folders = readdirSync(dir);
		for (const folder of folders) {
			const commandPath = path.join(dir, folder);
			const commandFiles = readdirSync(commandPath).filter(file => file.endsWith(".js"));
			
			for (const file of commandFiles) {
				const filePath = path.join(commandPath, file);
				const command = require(filePath);
				
				if (command.name) {
					client.commands.set(command.name, command);
					if (command.aliases && Array.isArray(command.aliases)) {
						command.aliases.forEach(alias => client.aliases.set(alias, command.name));
					}
					console.log(`> Commande chargée: ${command.name} [${folder}]`);
				}
			}
		}
	} catch (error) {
		console.error("Erreur lors du chargement des commandes:", error);
	}
};

const loadEvents = (dir = "./events/") => {
	try {
		const folders = readdirSync(dir);
		for (const folder of folders) {
			const eventPath = path.join(dir, folder);
			const eventFiles = readdirSync(eventPath).filter(file => file.endsWith(".js"));
			
			for (const file of eventFiles) {
				const filePath = path.join(eventPath, file);
				const event = require(filePath);
				const eventName = file.split(".")[0];
				
				client.on(eventName, (...args) => event(client, ...args));
				console.log(`> Événement chargé: ${eventName}`);
			}
		}
	} catch (error) {
		console.error("Erreur lors du chargement des événements:", error);
	}
};

loadEvents();
loadCommands();

client.login(client.config.token)
	.then(() => {
		console.log(`> Bot connecté: ${client.user.tag}`);
	})
	.catch((error) => {
		console.error("Erreur lors de la connexion:", error);
	});
