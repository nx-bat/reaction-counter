import { CommandClient, Constants, Event, Message } from 'athena-prime';
import database from '../../database';

// ----------

class MessageReactionRemoveEvent extends Event<CommandClient> {
  event: string = 'messageReactionRemove' as const;

  async handle(context: CommandClient<any, any>, message: Message, emoji: Constants.APIEmoji, user: string) {
    const emojiKey = emoji.id ?? emoji.name;
    if (emojiKey) await database.removeEmoji(emojiKey);
  }
}

export default new MessageReactionRemoveEvent('messageReactionRemove');