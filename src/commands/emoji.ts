import {
  Command,
  CommandBuilder,
  CommandClient,
  CommandInteraction,
  Constants,
  SlashCommand,
} from "athena-prime";
import database from "../database";

const customEmojiPattern = /^<(a?):([a-zA-Z0-9_]+):(\d{17,20})>$/;
const unicodeEmojiPattern =
  /^(?:\p{Regional_Indicator}{2}|\p{Emoji}(?:\uFE0F|\uFE0E)?(?:\p{Emoji_Modifier}|\u20E3)?)(?:\u200D\p{Emoji}(?:\uFE0F|\uFE0E)?(?:\p{Emoji_Modifier}|\u20E3)?)*$/u;

@SlashCommand(
  new CommandBuilder("emoji", "Get information about an emoji.")
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput)
    .addStringOption({ name: "emoji", description: "The emoji to view information about.", required: true })
)
class EmojiCommand extends Command<CommandClient> {
  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction, data: any) {
    try {
      const emoji = interaction.getRequiredString("emoji").trim();

      const customEmoji = emoji.match(customEmojiPattern);
      const unicodeEmoji = unicodeEmojiPattern.test(emoji);

      if (!customEmoji && !unicodeEmoji) {
        await interaction.createMessage({
          content: "Please provide a custom Discord emoji or a default Unicode emoji.",
          flags: Constants.MessageFlags.Ephemeral,
        });
        return;
      }

      const [, animationMarker, name, id] = customEmoji ?? [];
      const lookupKey = id ?? emoji;
      const animated = animationMarker === "a";

      const emojiData = await database.getEmoji(lookupKey);

      if (!emojiData) {
        await interaction.createMessage({
          content: "I couldn't find any information for that emoji.",
          flags: Constants.MessageFlags.Ephemeral,
        });

        return;
      }

      await interaction.createMessage({
        embeds: [
          {
            title: `Emoji | ${emoji}`,
            fields: [
              { name: "Name", value: name ?? emoji, inline: true },
              { name: "ID", value: id ?? "N/A", inline: true },
              { name: "Animated", value: animated ? "Y" : "N", inline: true },
              {
                name: "Count",
                value: `${emojiData.count}`,
                inline: false,
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error("Failed to process /emoji command:", error);

      await interaction.createMessage({
        content: "Something went wrong while processing that emoji. Please try again later.",
        flags: Constants.MessageFlags.Ephemeral,
      });
    }
  }
}

export default new EmojiCommand("emoji");
