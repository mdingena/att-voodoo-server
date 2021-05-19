type AltaApiConfig = {
  client_id: string;
  client_secret: string;
  client_name: string;
  grant_types: string[];
  redirect_uris: string[];
  scope: string;
  owner_id: number;
};

const environment = !!process.env.ON_HEROKU ? 'PRODUCTION' : 'STAGING';

const client = {
  id: process.env[`ALTA_CLIENT_${environment}_ID`] || '',
  secret: process.env[`ALTA_CLIENT_${environment}_SECRET`] || ''
};

export const config: AltaApiConfig = {
  client_id: client.id,
  client_secret: client.secret,
  client_name: 'Voodoo Server',
  grant_types: ['client_credentials'],
  redirect_uris: [],
  scope:
    'group.info group.invite group.join group.leave group.members group.view server.console server.view ws.group ws.group_bans ws.group_invites ws.group_members ws.group_servers',
  owner_id: 0
};
