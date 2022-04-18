import { Client } from 'js-tale';

const migrationInterval = 600000;

export const regularlyMigrateWebsocket = (bot: Client): NodeJS.Timer | undefined =>
  setInterval(() => {
    bot.subscriptions.test_migrate();
  }, migrationInterval);
