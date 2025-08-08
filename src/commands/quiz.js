import {
	SlashCommandBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder,
} from 'discord.js';
import { getQuizQuestion } from '../utils/getQuizQuestion.js';

export const data = new SlashCommandBuilder()
	.setName('quiz')
	.setDescription('Initiate your quiz question!');

export async function execute(interaction) {
	const client = interaction.client;
	const question = await getQuizQuestion(client);

	if (!question) {
		return interaction.reply('No questions in the database');
	}

	const options = question.options.map((option, index) => ({
		label: String(option),
		description: `Select an option ${index + 1}`,
		value: String(option),
	}));

	const row = new ActionRowBuilder().addComponents(
		new StringSelectMenuBuilder()
			.setCustomId('quiz_answer')
			.setPlaceholder('Select your answer')
			.addOptions(options),
	);

	await interaction.reply({
		content: `**Question:** ${question.question}`,
		components: [row],
		// flags: 64,
	});
}
