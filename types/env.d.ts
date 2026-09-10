declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      DISCORD_TOKEN: string;
    }
  }
}

// ----------

export {};