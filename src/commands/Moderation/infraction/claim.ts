import BulbBotClient from "../../../structures/BulbBotClient";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message, Snowflake, User } from "discord.js";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import { NonDigits } from "../../../utils/Regex";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "claim",
			clearance: 50,
			minArgs: 1,
			maxArgs: 1,
			argList: ["infraction:int"],
			usage: "<infraction>",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		if ((await infractionsManager.getInfraction(<Snowflake>context.guild?.id, Number(args[0].replace(NonDigits, "")))) === undefined) {
			return context.channel.send(
				await this.client.bulbutils.translate("infraction_not_found", context.guild?.id, {
					infraction_id: args[0],
				}),
			);
		}

		await infractionsManager.updateModerator(<Snowflake>context.guild?.id, Number(args[0].replace(NonDigits, "")), <User>context.member?.user);
		return await context.channel.send(await this.client.bulbutils.translate("infraction_claim_success", context.guild?.id, { infraction_id: args[0] }));
	}
}
