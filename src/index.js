import {
	Client,
	GatewayIntentBits,
	Collection,
	Events,
	Partials,
} from 'discord.js';
import 'dotenv/config';
import path from 'path';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
	partials: [
		Partials.Message,
		Partials.Channel,
		Partials.Reaction,
		Partials.User,
	],
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
	],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(
	file => file.endsWith('.js') && file !== 'deploy-commands.js',
);

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = await import(`file://${filePath}`);
	client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
	console.log(`Logged in: ${client.user.tag}`);
});

const eventsPath = path.join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = await import(`file://${filePath}`);

	if (event.default.once) {
		client.once(event.default.name, (...args) =>
			event.default.execute(...args, client),
		);
	} else {
		client.on(event.default.name, (...args) =>
			event.default.execute(...args, client),
		);
	}
}

client.login(process.env.TOKEN);
