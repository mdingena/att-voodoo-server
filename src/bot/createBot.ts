import ApiConnection from 'js-tale/dist/Core/ApiConnection';
import SubscriptionManager from 'js-tale/dist/Core/SubscriptionManager';
import GroupManager from 'js-tale/dist/Groups/GroupManager';
import { initLogger } from 'js-tale/dist/logger';
import { VoodooServer } from '../voodoo';
import { handleServerConnectionOpened } from './serverConnectionHandlers';
import { config } from './config';

const api: ApiConnection = new ApiConnection();
const subscriptions: SubscriptionManager = new SubscriptionManager(api);
const groupManager: GroupManager = new GroupManager(subscriptions);

export const createBot = async (voodoo: VoodooServer): Promise<void> => {
  initLogger();

  await api.login(config);
  await subscriptions.init();
  await groupManager.groups.refresh(true);
  await groupManager.acceptAllInvites(true);

  /* Add every server to Voodoo for the server status screen in the client. */
  await Promise.all(
    groupManager.groups.items.map(async group => {
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
    })
  );

  await groupManager.automaticConsole(handleServerConnectionOpened(voodoo));
};
