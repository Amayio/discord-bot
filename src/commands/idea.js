import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('idea')
	.setDescription('Describe your idea')
	.addStringOption(option =>
		option
			.setName('description')
			.setDescription('Describe your idea.')
			.setRequired(true),
	);

export async function execute(interaction) {
	const idea = interaction.options.getString('description');
	const targetChannel = interaction.client.channels.cache.get(
		'1382883281309270076',
	);

	const message = await targetChannel.send(idea);
	await message.react('✅');
	await message.react('🚫');

	await interaction.reply({ content: 'Done!' });
}
