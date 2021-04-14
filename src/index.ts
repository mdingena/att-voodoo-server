import ApiConnection from 'js-tale/dist/Core/ApiConnection';
import SubscriptionManager from 'js-tale/dist/Core/SubscriptionManager';
import ServerConnection from 'js-tale/dist/Groups/ServerConnection';
import GroupManager from 'js-tale/dist/Groups/GroupManager';
import Logger, { initLogger } from 'js-tale/dist/logger';

import altaApiConfig from './altaApiConfig';

initLogger();

const logger = new Logger('Main');

class Main {
  api: ApiConnection = new ApiConnection();
  subscriptions: SubscriptionManager = new SubscriptionManager(this.api);
  groupManager: GroupManager = new GroupManager(this.subscriptions);

  async init() {
    const config = {
      ...altaApiConfig,
      client_id: altaApiConfig.client_id ?? process.env.client_id,
      client_secret: altaApiConfig.client_secret ?? process.env.client_secret
    };

    await this.api.login(config);
    await this.subscriptions.init();
    await this.groupManager.groups.refresh(true);
    await this.groupManager.acceptAllInvites(true);

    this.groupManager.automaticConsole(this.connectionOpened.bind(this));
  }

  private connectionOpened(connection: ServerConnection) {
    logger.success(`Connected to ${connection.server.info.name}`);

    connection.on('closed', this.connectionClosed);
  }

  private connectionClosed(connection: ServerConnection) {
    logger.warn(`Disconnected from ${connection.server.info.name}`);
  }
}

var main = new Main();
main.init();
