// Marks if a tile can be walked on or not (ie. can we path find through the tile)

export const tile_walkable = new Array(500).fill(false);
tile_walkable[1 + 8] = true;
tile_walkable[1 + 9] = true;
tile_walkable[1 + 10] = true;
tile_walkable[1 + 11] = true;
tile_walkable[1 + 12] = true;
tile_walkable[1 + 14] = true;
tile_walkable[1 + 16] = true;
tile_walkable[1 + 17] = true;
tile_walkable[1 + 18] = true;
tile_walkable[1 + 19] = true;
tile_walkable[1 + 64] = true;
tile_walkable[1 + 65] = true;
tile_walkable[1 + 83] = true;
tile_walkable[1 + 84] = true;
tile_walkable[121 + 36] = true;
tile_walkable[121 + 37] = true;
tile_walkable[121 + 38] = true;