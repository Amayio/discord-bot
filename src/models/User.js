export async function getUserData(client, userId, guildId) {
	const users = client.mongo.db('shinobichronicles').collection('users');

	let user = await users.findOne({ userId, guildId });
	// Check if user exist //DEBUG
	console.log('Target User:', { userId, guildId });

	if (!user) {
		// IF user doens't exist add new one //DEBUG
		user = { userId, guildId, totalXP: 0, level: 0 };
		await users.insertOne(user);
	}

	return user;
}
