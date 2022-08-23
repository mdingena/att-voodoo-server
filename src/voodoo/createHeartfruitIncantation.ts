import { CONJURE_HEARTFRUIT_WORDS } from 'att-voodoo-book-of-blood';

const pick = (exclude: string[]) => {
  const options = CONJURE_HEARTFRUIT_WORDS.filter(word => !exclude.includes(word));

  return options[Math.floor(Math.random() * options.length)];
};

export const createHeartfruitIncantation = (length: number) => {
  if (length > CONJURE_HEARTFRUIT_WORDS.length) {
    throw new Error(
      `Can't create incantion of ${length} words because there are only ${CONJURE_HEARTFRUIT_WORDS.length} options.`
    );
  }

  const incantation: string[] = [];

  while (incantation.length < length) {
    incantation.push(pick(incantation));
  }

  return incantation;
};
