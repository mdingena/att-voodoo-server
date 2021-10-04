import { Server, ServerConnection } from 'js-tale';
import Logger from 'js-tale/dist/logger';
import { VoodooServer } from '../voodoo';

const logger = new Logger('Bot');

export const handleServerConnectionOpened = (voodoo: VoodooServer) => async (connection: ServerConnection) => {
  /* Do not connect to Quest servers. */
  // @ts-ignore
  if (connection.server.info.fleet !== 'att-release') {
    logger.warn(`Server '${connection.server.info.name}' is not a PCVR server.`);
    connection.disconnect();
    return;
  }

  /* Connection closed event handler. */
  const handleClosed = ({
    server: {
      isOnline,
      info: { id, name, online_players }
    }
  }: ServerConnection) => {
    connection.server.off('status', handleServerStatus);
    connection.unsubscribe('PlayerJoined', handlePlayerJoined);
    connection.unsubscribe('PlayerLeft', handlePlayerLeft);
    voodoo.removePlayers({ serverId: id });
    voodoo.updateServer({
      id,
      name,
      online: isOnline,
      players: online_players.length
    });

    logger.warn(`Disconnected from ${name}`);
  };

  /* Server info updated event handler. */
  const handleServerStatus = (server: Server) => {
    voodoo.updateServer({
      id: server.info.id,
      name: server.info.name,
      online: server.isOnline,
      players: server.info.online_players.length
    });
  };

  /* Player joined the server event handler. */
  const handlePlayerJoined = (event: any) => {
    voodoo.addPlayer({
      name: event.user.username,
      accountId: event.user.id,
      serverId: connection.server.info.id,
      serverConnection: connection
    });
  };

  /* Player left the server event handler. */
  const handlePlayerLeft = (event: any) => {
    voodoo.removePlayer({ accountId: event.user.id });
  };

  /* Register event handlers. */
  connection.on('closed', handleClosed);
  connection.subscribe('PlayerJoined', handlePlayerJoined);
  connection.subscribe('PlayerLeft', handlePlayerLeft);
  connection.server.on('status', handleServerStatus);

  /* Update server info immediately after connecting. */
  voodoo.updateServer({
    id: connection.server.info.id,
    name: connection.server.info.name,
    online: connection.server.isOnline,
    players: connection.server.info.online_players.length
  });

  /* Add all players on the server immediately after connecting. */
  try {
    const { Result: players } = await connection.send('player list');

    players.map((player: any) =>
      voodoo.addPlayer({
        name: player.username,
        accountId: player.id,
        serverId: connection.server.info.id,
        serverConnection: connection
      })
    );
  } catch (error) {
    logger.error(error);
  }

  logger.success(`Connected to ${connection.server.info.name}`);
};
