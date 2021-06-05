import { Components } from '../components';

type DeadEmbeddedEntity = {
  isAlive: false;
  components: null;
};

type AliveEmbeddedEntity = {
  isAlive: true;
  components: Components;
};

export type EmbeddedEntities = {
  [key: string]: AliveEmbeddedEntity | DeadEmbeddedEntity;
};
