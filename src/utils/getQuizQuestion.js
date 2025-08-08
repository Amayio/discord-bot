export async function getQuizQuestion(client) {
	const questions = client.mongo
		.db('shinobichronicles')
		.collection('questions');

	const count = await questions.countDocuments();
	const randomIndex = Math.floor(Math.random() * count);

	if (count === 0) return null;

	const randomQuestion = questions.find().skip(randomIndex).limit(1);

	return await randomQuestion.next();
}
