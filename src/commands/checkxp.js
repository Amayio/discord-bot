import { SlashCommandBuilder } from 'discord.js';
import { getUserData } from '../models/User.js';

export const data = new SlashCommandBuilder()
	.setName('checkxp')
	.setDescription('Check your level and total XP');

export async function execute(interaction) {
	const userId = interaction.user.id;
	const guildId = interaction.guild.id;
	const client = interaction.client;

	const user = await getUserData(client, userId, guildId);

	const { totalXP, level } = user;

	await interaction.reply({
		content: `🔹${interaction.user.username}: You're currently at level ${level}, and your total XP is ${totalXP} `,
		flags: 64,
	});
}
