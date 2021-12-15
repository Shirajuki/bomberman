let _id = 0;
export const key = () => _id++;

export const GAMESTATE_LOBBY = key();
export const GAMESTATE_START = key();
export const GAMESTATE_END = key();

export const TILE_SIZE = 36;
export const MAP = `11111111111111111
10000000100000001
10101101110110101
10000000000000001
10101111011110101
10100000000000101
10110101110101101
10000101110100001
10110101110101101
10100000000000101
10101111011110101
10000000000000001
10101101110110101
10000000100000001
11111111111111111`;
