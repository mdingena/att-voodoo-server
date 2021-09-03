import { Client } from 'js-tale';
import { initLogger } from 'js-tale/dist/logger';
import { VoodooServer } from '../voodoo';
import { handleServerConnectionOpened } from './serverConnectionHandlers';
import { config } from './config';

const CONSOLE_PERMISSION = 'Console';

export const createBot = async (voodoo: VoodooServer): Promise<Client> => {
  initLogger();

  const bot = new Client(config);

  await bot.initialize();
  await bot.groupManager.acceptAllInvites(true);

  /* Add every server to Voodoo for the server status screen in the client. */
  await Promise.all(
    bot.groupManager.groups.items.map(async group => {
      let hasConsoleAccess = false;

      for (const role of group.info.roles) {
        if (role.permissions.includes(CONSOLE_PERMISSION)) {
          hasConsoleAccess = true;
          break;
        }
      }

      if (hasConsoleAccess) {
        await group.servers.refresh(true);
        await group.servers.refreshStatus(true);

        group.servers.items.forEach(server => {
          voodoo.updateServer({
            id: server.info.id,
            name: server.info.name,
            online: server.isOnline,
            players: server.info.online_players.length
          });
        });
      }
    })
  );

  await bot.groupManager.automaticConsole(handleServerConnectionOpened(voodoo));

  return bot;
};
