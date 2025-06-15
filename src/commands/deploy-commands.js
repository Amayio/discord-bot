import 'dotenv/config';
import { REST, Routes } from 'discord.js';
// import { config } from 'dotenv';
import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const commandsPath = path.join(__dirname);
const commandFiles = readdirSync(commandsPath).filter(
	file => file.endsWith('.js') && file !== 'deploy-commands.js',
);

for (const file of commandFiles) {
	const { data } = await import(`./${file}`);
	commands.push(data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
	console.log('Command registration...');

	await rest.put(
		Routes.applicationGuildCommands(
			process.env.CLIENT_ID,
			process.env.GUILD_ID,
		),
		{ body: commands },
	);

	console.log('Success.');
} catch (error) {
	console.error(error);
}
