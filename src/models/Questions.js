import { MongoClient } from 'mongodb';
import 'dotenv/config';

const questionsData = [
	{
		question: "What is the full name of Kurama's second Jinchūriki?",
		options: [
			'Namikaze Minato',
			'Uzumaki Naruto',
			'Uzumaki Kushina',
			'Himawari Uzumaki',
		],
		answer: 'Uzumaki Kushina',
	},
	{
		question:
			'How many tailed beasts were sealed into the Gedo Statue before the Ten-Tails was revived?',
		options: [5, 7, 8, 9],
		answer: 7,
	},
];

const client = new MongoClient(process.env.DATABASE_CONNECT_STRING);

async function seedQuestions() {
	try {
		await client.connect();
		console.log('Connected to DB');

		const questions = client.db('shinobichronicles').collection('questions');
		await questions.deleteMany({});

		for (const q of questionsData) {
			const exist = await questions.findOne({ question: q.question });
			if (!exist) {
				await questions.insertOne(q);
				console.log('Done!');
			} else {
				console.log('Skipped existing question');
			}
		}
	} catch (err) {
		console.error('Error seeding questions:', err);
	} finally {
		await client.close();
	}
}

seedQuestions();
