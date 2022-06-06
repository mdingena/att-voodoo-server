import { QueryResult } from 'pg';
import { VoodooServer } from '../voodoo';
import { db } from './db';
import { deleteSessions } from './sql';

const PURGE_INTERVAL = 60000;

const purgeSessions = async (voodoo: VoodooServer) => {
  const results = (await db.query(deleteSessions)) as unknown as [QueryResult, QueryResult];
  const rows = Math.max(results[0].rowCount, results[1].rowCount);
  if (rows) console.info(`Purged ${rows} stale sessions`);
};

export const regularlyPurgeSessions = (voodoo: VoodooServer): NodeJS.Timeout => {
  purgeSessions(voodoo);

  return setInterval(() => purgeSessions(voodoo), PURGE_INTERVAL);
};
