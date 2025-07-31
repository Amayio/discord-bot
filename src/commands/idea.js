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
	const inputChannelId = process.env.INPUT_CHANNEL_ID;
	const outputChannelId = process.env.OUTPUT_CHANNEL_ID;
	const targetChannel = interaction.client.channels.cache.get(outputChannelId);

	if (interaction.channel.id !== inputChannelId) {
		return interaction.reply({
			content: `This command can be used only on  <#${inputChannelId}>.`,
			flags: 64,
		});
	}

	const message = await targetChannel.send(idea);
	const ideaId = message.id;
	await message.react('✅');
	await message.react('🚫');

	await interaction.reply({
		content: `You idea added on <#${ideaId.id}>`,
		flags: 64,
	});
}
