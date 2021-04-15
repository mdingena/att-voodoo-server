import ApiConnection from 'js-tale/dist/Core/ApiConnection';
import SubscriptionManager from 'js-tale/dist/Core/SubscriptionManager';
import GroupManager from 'js-tale/dist/Groups/GroupManager';
import { handleServerConnectionOpened } from './serverConnectionHandlers';
import { altaApiConfig } from './altaApiConfig';

const config = {
  ...altaApiConfig,
  client_id: altaApiConfig.client_id ?? process.env.client_id,
  client_secret: altaApiConfig.client_secret ?? process.env.client_secret
};

const api: ApiConnection = new ApiConnection();
const subscriptions: SubscriptionManager = new SubscriptionManager(api);
const groupManager: GroupManager = new GroupManager(subscriptions);

const init = async () => {
  await api.login(config);
  await subscriptions.init();
  await groupManager.groups.refresh(true);
  await groupManager.acceptAllInvites(true);

  groupManager.automaticConsole(handleServerConnectionOpened);
};

export const altaManager = { init };
