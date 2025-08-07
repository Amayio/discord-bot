export async function getQuizQuestion(client, userId, guildId) {
	const questions = client.mongo
		.db('shinobichronicles')
		.collection('questions');
}
