import ServerConnection from 'js-tale/dist/Groups/ServerConnection';
import Logger from 'js-tale/dist/logger';

const logger = new Logger('AltaManager');

export const handleServerConnectionOpened = (connection: ServerConnection) => {
  logger.success(`Connected to ${connection.server.info.name}`);

  connection.on('closed', handleServerConnectionClosed);
};

export const handleServerConnectionClosed = (connection: ServerConnection) => {
  logger.warn(`Disconnected from ${connection.server.info.name}`);
};
