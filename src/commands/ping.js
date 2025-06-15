import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('It always answers with Pong! Unbelievable!');

export async function execute(interaction) {
	await interaction.reply('Pong!');
}
