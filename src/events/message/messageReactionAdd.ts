import { CommandClient, Constants, Event, Member, Message } from 'athena-prime';
import database from '../../database';

// ----------

class MessageReactionAddEvent extends Event<CommandClient> {
  event: string = 'messageReactionAdd' as const;

  async handle(context: CommandClient, message: Message, emoji: Constants.APIEmoji, member: Member) {
    const emojiKey = emoji.id ?? emoji.name;
    if (emojiKey) await database.addEmoji(emojiKey);
  }
}

export default new MessageReactionAddEvent('messageReactionAdd');
