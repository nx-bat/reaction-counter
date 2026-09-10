import { CommandClient, Constants, Member, NullCollection, User } from 'athena-prime';
import database from './database';
import events from './events';
import commands from './commands';

// ----------

const client = new CommandClient({
  token: `Bot ${process.env.DISCORD_TOKEN}`,

  options: {
    intents: [
      Constants.GatewayIntentBits.Guilds,
      Constants.GatewayIntentBits.GuildMessageReactions,
    ],

    disableEvents: {
      PRESENCE_UPDATE: true,
      TYPING_START: true,
    },

    largeBotOptimizations: true,

    cache: {
      users: () => new NullCollection(User),
      members: () => new NullCollection(Member)
    }
  },
});

commands.forEach(command => client.registerCommand(command));
events.forEach(event => client.registerEvent(event));

// ----------

database.init();
client.connect();