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

  groupManager.automaticConsole(handleServerConnectionOpened(voodoo));
};
