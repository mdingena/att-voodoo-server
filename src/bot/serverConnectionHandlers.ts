import ServerConnection from 'js-tale/dist/Groups/ServerConnection';
import Logger from 'js-tale/dist/logger';
import { VoodooServer } from '../voodoo';

const logger = new Logger('AltaManager');

export const handleServerConnectionOpened = (voodoo: VoodooServer) => async (connection: ServerConnection) => {
  logger.success(`Connected to ${connection.server.info.name}`);

  connection.subscribe('PlayerJoined', event => {
    voodoo.addPlayer({
      accountId: event.user.id,
      serverId: connection.server.info.id,
      serverConnection: connection
    });
  });

  connection.subscribe('PlayerLeft', event => {
    voodoo.removePlayer({ accountId: event.user.id });
  });

  connection.on('closed', handleServerConnectionClosed(voodoo));

  try {
    const { Result: players } = await connection.send('player list');

    players.map((item: any) =>
      voodoo.addPlayer({
        accountId: item.id,
        serverId: connection.server.info.id,
        serverConnection: connection
      })
    );
  } catch (error) {
    logger.error(error);
  }
};

export const handleServerConnectionClosed = (voodoo: VoodooServer) => (connection: ServerConnection) => {
  logger.warn(`Disconnected from ${connection.server.info.name}`);

  voodoo.removePlayers({ serverId: connection.server.info.id });
};
