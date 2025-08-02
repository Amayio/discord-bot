import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('dice')
	.setDescription('Roll a die with the chosen number of sides:')
	.addIntegerOption(option =>
		option
			.setName('sides')
			.setDescription('Number of sides:')
			.setRequired(true)
			.addChoices(
				{ name: '4', value: 4 },
				{ name: '6', value: 6 },
				{ name: '8', value: 8 },
				{ name: '10', value: 10 },
				{ name: '12', value: 12 },
				{ name: '20', value: 20 },
			),
	);

export async function execute(interaction) {
	const sides = interaction.options.getInteger('sides');
	const result = Math.floor(Math.random() * sides) + 1;
	await interaction.reply(
		`🎲 Rolling a ${sides}-sided dice... Your result is... ${result}`,
	);
}
