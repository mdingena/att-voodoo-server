type AltaApiConfig = {
  client_id: string;
  client_secret: string;
  scope: string;
};

export const config: AltaApiConfig = {
  client_id: process.env.ALTA_CLIENT_ID || '',
  client_secret: process.env.ALTA_CLIENT_SECRET || '',
  scope: [
    'group.info',
    'group.invite',
    'group.join',
    'group.leave',
    'group.members',
    'group.view',
    'server.console',
    'server.view',
    'ws.group',
    'ws.group_bans',
    'ws.group_invites',
    'ws.group_members',
    'ws.group_servers'
  ].join(' ')
};
