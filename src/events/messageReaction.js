export default {
	name: 'messageReactionAdd',
	once: false,
	async execute(reaction, user) {
		if (reaction.partial) {
			try {
				await reaction.fetch();
			} catch (error) {
				console.error("Can't get reaction informations", error);
				return;
			}
		}

		try {
			await reaction.message.fetch();
			for (const react of reaction.message.reactions.cache.values()) {
				await react.users.fetch();
			}
		} catch (error) {
			console.error("Can't fetch message or users", error);
			return;
		}

		if (user.bot) return;
		if (reaction.message.channel.id !== process.env.OUTPUT_CHANNEL_ID) return;

		const allReactions = reaction.message.reactions.cache;

		allReactions
			.filter(
				reply =>
					reply.users.cache.has(user.id) &&
					reply.emoji.name !== reaction.emoji.name,
			)
			.forEach(reply => reply.users.remove(user.id));
	},
};
