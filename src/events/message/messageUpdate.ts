import Event from "../../structures/Event";
import { Message, Util } from "discord.js";
import LoggingManager from "../../utils/managers/LoggingManager";
import * as fs from "fs";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(oldMessage: Message, newMessage: Message): Promise<void> {
		if (newMessage.author.id === this.client.user!.id) return;
		if (oldMessage.content === newMessage.content) return;
		if (!newMessage.guild) return;

		const msg: string = await this.client.bulbutils.translateNew("event_message_edit", newMessage.guild.id, {
			user_tag: newMessage.author.bot ? `${newMessage.author.tag} :robot:` : newMessage.author.tag,
			user: newMessage.author,
			message: newMessage,
			before: Util.cleanContent(oldMessage.content, oldMessage),
			after: Util.cleanContent(newMessage.content, newMessage),
		});

		if (msg.length >= 1850) {
			fs.writeFileSync(`${__dirname}/../../../files/MESSAGE_UPDATE-${newMessage.guild?.id}.txt`, `**B:** ${oldMessage.content}\n**A:** ${newMessage.content}`);
			await loggingManager.sendEventLogFile(
				this.client,
				newMessage.guild,
				"message",
				await this.client.bulbutils.translateNew("event_message_edit_special", newMessage.guild.id, {
					user_tag: newMessage.author.bot ? `${newMessage.author.tag} :robot:` : newMessage.author.tag,
					user: newMessage.author,
					message: newMessage,
				}),
				`${__dirname}/../../../files/MESSAGE_UPDATE-${newMessage.guild?.id}.txt`,
			);
		} else await loggingManager.sendEventLog(this.client, newMessage.guild, "message", msg);
	}
}
