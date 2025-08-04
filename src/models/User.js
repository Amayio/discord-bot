import { MongoClient } from 'mongodb';

export async function getUserData(client, userId, guildId) {
	const users = client.mongo.db('shinobichronicles');

	let user = await users.findOne({ userId, guildId });

	if (!user) {
		user = { userId, guildId, totalXP: 0, level: 0 };
		await users.insertOne(user);
	}

	return user;
}

export async function addXP(client, userId, guildId, amount) {
	const users = client.mongo.db('shinobichronicles').collection('users');

	let user = await getUserData(client, userId, guildId);
	let previousLevel = user.level;
	let newTotalXP = users.totalXP + amount;
	let newLevel = getLevelFromXP(newTotalXP);

	await users.updateOne(
		{ userId, guildId },
		{ $set: { totalXP: newTotalXP, level: newLevel } },
	);

	return { newTotalXP, newLevel, leveledUp: newLevel > previousLevel };
}

function getXPThreshold(level) {
	return 2000 * (level + 1);
}

function getLevelFromXP(currentXP) {
	let level = 0;
	let xpNeeded = getXPThreshold(level);

	while (currentXP >= xpNeeded) {
		currentXP -= xpNeeded;
		level++;
		xpNeeded = getXPThreshold(level);
	}

	return level;
}
