export async function getUserData(client, userId, guildId) {
	const users = client.mongo.db('shinobichronicles').collection('users');

	let user = await users.findOne({ userId, guildId });

	if (!user) {
		user = { userId, guildId, totalXP: 0, level: 0 };
		await users.insertOne(user);
	}

	return user;
}

