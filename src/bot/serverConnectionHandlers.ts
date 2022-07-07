import { Server, ServerConnection, SubscriptionEventMessage } from 'att-client';
import { VoodooServer } from '../voodoo';

type PlayerList = { id: number; username: string }[];

export const handleServerConnectionOpened = (voodoo: VoodooServer) => async (connection: ServerConnection) => {
  /* Do not connect to Quest servers. */
  // if (connection.server.fleet !== 'att-release') {
  //   console.warn(`Server '${connection.server.name}' is not a PCVR server.`);
  //   connection.server.disconnect();
  //   return;
  // }

  /* Connection closed event handler. */
  const handleClosed = () => {
    voodoo.removePlayers({ serverId: connection.server.id });
    voodoo.updateServer({
      id: connection.server.id,
      groupId: connection.server.group.id,
      name: connection.server.name,
      online: connection.server.status === 'connected',
      players: connection.server.players.length
    });

    console.warn(`Disconnected from ${connection.server.name}`);
  };

  /* Server info updated event handler. */
  const handleServerUpdate = (server: Server) => {
    voodoo.updateServer({
      id: server.id,
      groupId: server.group.id,
      name: server.name,
      online: server.status === 'connected',
      players: server.players.length
    });
  };

  /* Player joined the server event handler. */
  const handlePlayerJoined = (message: SubscriptionEventMessage<'PlayerJoined'>) => {
    const { user } = message.data;
    voodoo.addPlayer({
      name: user.username,
      accountId: user.id,
      serverId: connection.server.id,
      serverConnection: connection
    });
  };

  /* Player left the server event handler. */
  const handlePlayerLeft = (message: SubscriptionEventMessage<'PlayerLeft'>) => {
    voodoo.removePlayer({ accountId: message.data.user.id });
  };

  /* Register event handlers. */
  connection.on('close', handleClosed);
  connection.subscribe('PlayerJoined', handlePlayerJoined);
  connection.subscribe('PlayerLeft', handlePlayerLeft);
  connection.server.on('update', handleServerUpdate);

  /* Update server info immediately after connecting. */
  voodoo.updateServer({
    id: connection.server.id,
    groupId: connection.server.group.id,
    name: connection.server.name,
    online: connection.server.status === 'connected',
    players: connection.server.players.length
  });

  /* Add all players on the server immediately after connecting. */
  try {
    const response = await connection.send<PlayerList>('player list');

    if (typeof response === 'undefined') throw new Error("Couldn't get player list.");

    const players = response.data.Result;

    players.map((player: any) =>
      voodoo.addPlayer({
        name: player.username,
        accountId: player.id,
        serverId: connection.server.id,
        serverConnection: connection
      })
    );
  } catch (error) {
    console.error(error);
  }

  console.log(`Connected to ${connection.server.name}`);
};
