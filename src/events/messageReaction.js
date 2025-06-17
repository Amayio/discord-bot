const TARGET_CHANNEL_ID = '810471727746121742';

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

		if (user.bot) return;
		if (reaction.message.channel.id !== TARGET_CHANNEL_ID) return;

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
