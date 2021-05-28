import ServerConnection from 'js-tale/dist/Groups/ServerConnection';
import Logger from 'js-tale/dist/logger';
import { VoodooServer } from '../voodoo';

const logger = new Logger('Bot');

export const handleServerConnectionOpened = (voodoo: VoodooServer) => async (connection: ServerConnection) => {
  logger.success(`Connected to ${connection.server.info.name}`);

  voodoo.addServer({
    id: connection.server.info.id,
    name: connection.server.info.name,
    online: connection.server.isOnline,
    players: connection.server.info.online_players.length
  });

  connection.server.on('update', server => {
    voodoo.updateServer({
      id: server.info.id,
      name: server.info.name,
      online: server.isOnline,
      players: server.info.online_players.length
    });
  });

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

  const serverId = connection.server.info.id;
  voodoo.removePlayers({ serverId });
  voodoo.removeServer({ serverId });
};
