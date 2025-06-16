import {
	Client,
	GatewayIntentBits,
	Collection,
	Events,
	Partials,
} from 'discord.js';
import 'dotenv/config';
import { readdirSync } from 'fs';
import path from 'path';
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

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'An error occurred while executing the command.',
			ephemeral: true,
		});
	}
});

const TARGET_CHANNEL_ID = '810471727746121742';

client.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error("Can't get reaction informations", error);
		}
	}

	if (user.bot) return;
	if (reaction.message.channel.id !== TARGET_CHANNEL_ID) return;

	const allReactions = reaction.message.reactions.cache;

	allReactions
		.filter(
			reply =>
				reply.users.cache.has(user.id) &&
				reply.emoji.name !== reaction.emoji.name,
		)
		.forEach(reply => reply.users.remove(user.id));
});

client.login(process.env.TOKEN);
