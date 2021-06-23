import { Server, ServerConnection } from 'js-tale';
import Logger from 'js-tale/dist/logger';
import { VoodooServer } from '../voodoo';

const logger = new Logger('Bot');

export const handleServerConnectionOpened = (voodoo: VoodooServer) => async (connection: ServerConnection) => {
  /* Connection closed event handler. */
  const handleClosed = ({
    server: {
      isOnline,
      info: { id, name, online_players }
    }
  }: ServerConnection) => {
    connection.server.off('update', handleUpdate);
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
  const handleUpdate = (server: Server) => {
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
      accountId: event.user.id,
      serverId: connection.server.info.id,
      serverConnection: connection
    });
    /* Hijack player event because server update event doesn't fire. */
    // @todo remove
    voodoo.updateServer({
      id: connection.server.info.id,
      name: connection.server.info.name,
      online: connection.server.isOnline,
      players: (voodoo.servers.find(({ id }) => id === connection.server.info.id)?.players ?? 0) + 1
    });
  };

  /* Player left the server event handler. */
  const handlePlayerLeft = (event: any) => {
    voodoo.removePlayer({ accountId: event.user.id });
    /* Hijack player event because server update event doesn't fire. */
    // @todo remove
    voodoo.updateServer({
      id: connection.server.info.id,
      name: connection.server.info.name,
      online: connection.server.isOnline,
      players: (voodoo.servers.find(({ id }) => id === connection.server.info.id)?.players ?? 1) - 1
    });
  };

  /* Register event handlers. */
  connection.on('closed', handleClosed);
  connection.subscribe('PlayerJoined', handlePlayerJoined);
  connection.subscribe('PlayerLeft', handlePlayerLeft);
  connection.server.on('update', handleUpdate);

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
