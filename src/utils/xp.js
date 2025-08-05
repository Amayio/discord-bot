import { getUserData } from '../models/User.js';

export async function addXP(client, userId, guildId, amount) {
	const users = client.mongo.db('shinobichronicles').collection('users');

	let user = await getUserData(client, userId, guildId);
	let level = user.level;
	let newTotalXP = user.totalXP + amount;
	let xpLeftToLevel = newTotalXP;

	while (xpLeftToLevel >= getXPThreshold(level)) {
		xpLeftToLevel -= getXPThreshold(level);
		level++;
	}

	await users.updateOne(
		{ userId, guildId },
		{ $set: { totalXP: newTotalXP, level: level } },
	);

	return {
		totalXP: newTotalXP,
		newLevel: level,
		leveledUp: level !== user.level,
	};
}

function getXPThreshold(level) {
	return 2000 * (level + 1);
}
