import { SlashCommandBuilder } from 'discord.js';
import { addXP } from '../utils/xp';

export const data = new SlashCommandBuilder()
	.setName('addxp')
	.setDescription('Add exp to user.')
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription('User receiving XP')
			.setRequired(true),
	)
	.addIntegerOption(option =>
		option
			.setName('amount')
			.setDescription('Amount XP do add')
			.setRequired(true),
	);

export async function execute(interaction) {
	const targetUser = interaction.options.getUser('user');
	const amount = interaction.options.getInteger('amount');

	if (!interaction.member.permissions.has('Administrator')) {
		return interaction.reply({ content: 'No permissions', flags: 64 });
	}

	await addXP(interaction.client, targetUser.id, interaction.guild.id, amount);

	await interaction.reply(`${targetUser.username} received ${amount} XP.`);
}
