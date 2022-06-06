import { VoodooServer } from '.';

/* Heroku grace period is 30 seconds. */
let timeLeft = 30;
let showTimeLeft = false;

/**
 * Print either a warning message or the remaining time before termination.
 */
const message = (timeLeft: number) =>
  showTimeLeft ? `Voodoo service is restarting in ${timeLeft} seconds` : 'Please hold your incantations!';

/**
 * Count down during graceful shutdown and exit process.
 */
const tick = (voodoo: VoodooServer) => {
  if (timeLeft === 0) process.exit(0);

  /* Print message for all players. */
  if (showTimeLeft || timeLeft % 3 === 0) {
    for (const [accountId, player] of Object.entries(voodoo.players)) {
      if (player.isVoodooClient) {
        voodoo.command({
          accountId: Number(accountId),
          command: `player message ${accountId} "${message(timeLeft)}" 3`
        });
      }
    }
  }

  /* Toggle time left or warning. */
  if (--timeLeft % 3 === 0) showTimeLeft = !showTimeLeft;
};

/**
 * Gracefully shutdown by messaging players after receiving SIGTERM.
 */
export const gracefulShutdown = (voodoo: VoodooServer) => () => {
  console.warn('SIGTERM received, beginning graceful shutdown.');

  setInterval(() => tick(voodoo), 970);
  tick(voodoo);

  /* Return all consumed spell materials for unfinished incantations. */
  for (const key in voodoo.players) {
    const accountId = Number(key);

    voodoo.returnMaterials({ accountId });
  }
};
