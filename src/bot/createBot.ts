import { Client } from 'att-client';
import { VoodooServer } from '../voodoo';
import { handleServerConnectionOpened } from './serverConnectionHandlers';
import { config } from './config';

const CONSOLE_PERMISSION = 'Console';

export const createBot = async (voodoo: VoodooServer): Promise<Client> => {
  const bot = new Client(config);

  bot.on('ready', async () => {
    /* Add every server to Voodoo for the server status screen in the client. */
    Object.values(bot.groups).map(group => {
      const hasConsoleAccess = group.permissions.includes(CONSOLE_PERMISSION);

      if (hasConsoleAccess) {
        for (const server of Object.values(group.servers)) {
          if (server.fleet === 'att-release') {
            voodoo.updateServer({
              id: server.id,
              groupId: server.group.id,
              name: server.name,
              online: server.status === 'connected',
              players: server.players.length
            });
          }
        }
      }
    });
  });

  bot.on('connect', handleServerConnectionOpened(voodoo));

  bot.start();

  return bot;
};
