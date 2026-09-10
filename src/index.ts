import { CommandClient, Constants, Member, NullCollection, User } from 'athena-prime';
import events from './events';

// ----------

const client = new CommandClient({
  token: `Bot ${process.env.DISCORD_TOKEN}`,

  options: {
    intents: [Constants.GatewayIntentBits.Guilds],

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

events.forEach(event => client.registerEvent(event));

// ----------

client.connect();