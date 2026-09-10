import postgres from "postgres";

// -----------

const client = postgres(process.env.DATABASE_URL!);

async function init() {
  await client`
    CREATE TABLE IF NOT EXISTS emojis (
      emoji TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0
    )
  `;
}

async function addEmoji(emoji: string, amount = 1) {
  await client`
    INSERT INTO emojis (emoji, count)
    VALUES (${emoji}, ${amount})
    ON CONFLICT (emoji)
    DO UPDATE SET count = emojis.count + ${amount}
    RETURNING emoji, count
  `;
}

async function removeEmoji(emoji: string, amount = 1) {
  await client`
    INSERT INTO emojis (emoji, count)
    VALUES (${emoji}, 0)
    ON CONFLICT (emoji)
    DO UPDATE SET count = GREATEST(0, emojis.count - ${amount})
    RETURNING emoji, count
  `;
}

async function getEmoji(emoji: string): Promise<{ emoji: string, count: number }> {
  const [result] = await client`
    SELECT emoji, count FROM emojis
    WHERE emoji = ${emoji}
  `;

  return result as { emoji: string; count: number };
}

export default {
  init,
  addEmoji,
  removeEmoji,
  getEmoji
};