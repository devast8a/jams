// Names of tiles

export const tile_names = new Array(500).fill(undefined);
// basic_tiles.png
tile_names[1 + 0] = "WALL";
tile_names[1 + 1] = "WALL";
tile_names[1 + 2] = "WALL";
tile_names[1 + 3] = "WALL";
tile_names[1 + 4] = "WALL";
tile_names[1 + 5] = "WALL";
tile_names[1 + 6] = "WALL";
tile_names[1 + 7] = "WALL";

tile_names[1 + 8] = "FLOOR";
tile_names[1 + 9] = "FLOOR";
tile_names[1 + 10] = "PATH";
tile_names[1 + 11] = "GRASS";
tile_names[1 + 12] = "FLOWER";
tile_names[1 + 13] = "WATER"; // Note, water is mostly overridden by override_names
tile_names[1 + 14] = "FLOOR";
tile_names[1 + 15] = "CLIFF";

tile_names[1 + 16] = "FLOOR";
tile_names[1 + 17] = "FLOOR";
tile_names[1 + 18] = undefined; // PATH (Unused)
tile_names[1 + 19] = undefined; // GRASS-PATH (Unused)
tile_names[1 + 20] = "SHRUB";
tile_names[1 + 21] = "WATERFALL";
tile_names[1 + 22] = undefined; // Unused
tile_names[1 + 23] = undefined; // CLIFF (Unused)

tile_names[1 + 24] = undefined; // CLIFF/SHORE
tile_names[1 + 25] = undefined; // CLIFF/SHORE
tile_names[1 + 26] = undefined; // CLIFF/SHORE
tile_names[1 + 27] = "POT";
tile_names[1 + 28] = undefined; // BROKEN-POT (Unused)
tile_names[1 + 29] = undefined; // WATER (Effect)
tile_names[1 + 30] = "TREE";
tile_names[1 + 31] = "WELL";

tile_names[1 + 32] = undefined; // CLIFF/SHORE
tile_names[1 + 33] = undefined; // CAVE? (Unused)
tile_names[1 + 34] = undefined; // CLIFF/SHORE
tile_names[1 + 35] = "CHEST";
tile_names[1 + 36] = "CHEST";
tile_names[1 + 37] = undefined; // WATER (Effect)
tile_names[1 + 38] = "TREE";
tile_names[1 + 39] = "PILLAR";

tile_names[1 + 40] = undefined; // CLIFF/SHORE
tile_names[1 + 41] = undefined; // CLIFF/SHORE
tile_names[1 + 42] = undefined; // CLIFF/SHORE
tile_names[1 + 43] = undefined; // Town Icons (Unused)
tile_names[1 + 44] = undefined; // Town Icons (Unused)
tile_names[1 + 45] = "BED";
tile_names[1 + 46] = "CHAIR";
tile_names[1 + 47] = "STATUE";

tile_names[1 + 48] = "DOOR";
tile_names[1 + 49] = "DOOR";
tile_names[1 + 50] = "DOOR";
tile_names[1 + 51] = "FENCE";
tile_names[1 + 52] = "MAT";
tile_names[1 + 53] = "BED";
tile_names[1 + 54] = "TABLE";
tile_names[1 + 55] = "DRAWERS";

tile_names[1 + 56] = undefined; // Stairs (Unused)
tile_names[1 + 57] = undefined; // Stairs (Unused)
tile_names[1 + 58] = "ROCK";
tile_names[1 + 59] = "ROCK";
tile_names[1 + 60] = "TORCH";
tile_names[1 + 61] = "TORCH";
tile_names[1 + 62] = undefined; // Mountain Icons (Unused)
tile_names[1 + 63] = undefined; // Mountain Icons (Unused)

tile_names[1 + 64] = "GRASS";
tile_names[1 + 65] = "GRASS";
tile_names[1 + 66] = undefined; // LAVA-CLIFF (Unused)
tile_names[1 + 67] = "SIGNPOST"; // SIGNPOST - needs to be handled separately
tile_names[1 + 68] = undefined; // GOLD (Unused)
tile_names[1 + 69] = undefined; // GEMS (Unused)
tile_names[1 + 70] = undefined; // ??? (Unused)
tile_names[1 + 71] = undefined; // ??? (Unused)

tile_names[1 + 72] = "FLOOR";
tile_names[1 + 73] = "FLOOR";
tile_names[1 + 74] = undefined; // LAVA-FLOOR (Unused)
tile_names[1 + 75] = undefined; // LAVA-FLOOR (Unused)
tile_names[1 + 76] = "TREE";
tile_names[1 + 77] = "TREE";
tile_names[1 + 78] = undefined; // ??? (Unused)
tile_names[1 + 79] = undefined; // ??? (Unused)

tile_names[1 + 80] = undefined; // ??? (Unused)
tile_names[1 + 81] = undefined; // ??? (Unused)
tile_names[1 + 82] = "SIGNPOST"; // SIGNPOST - needs to be handled separately
tile_names[1 + 83] = "BRIDGE";
tile_names[1 + 84] = "BRIDGE";

tile_names[1 + 88] = "TREE";
tile_names[1 + 89] = "TREE";
tile_names[1 + 90] = "TREE";
tile_names[1 + 92] = "TREE";
tile_names[1 + 96] = "TREE";
tile_names[1 + 97] = "TREE";
tile_names[1 + 98] = "TREE";
tile_names[1 + 104] = "TREE";
tile_names[1 + 105] = "TREE";
tile_names[1 + 106] = "TREE";
tile_names[1 + 112] = "TREE";
tile_names[1 + 113] = "TREE";
tile_names[1 + 114] = "TREE";
tile_names[1 + 115] = "TREE";

tile_names[1 + 100] = "PILLAR";
tile_names[1 + 108] = "PILLAR";

// things.png
for(let x = 0; x < 6; x++){
    for(let y = 0; y < 4; y++){
        tile_names[121 + 0  + x + y * 8] = "DOOR";
    }
}
for(let x = 0; x < 3; x++){
    for(let y = 0; y < 4; y++){
        tile_names[121 + 48 + x + y * 8] = "TORCH";
    }
}
for(let x = 0; x < 3; x++){
    for(let y = 0; y < 4; y++){
        tile_names[121 + 6  + x + y * 8] = "CHEST";
    }
}
for(let x = 0; x < 3; x++){
    for(let y = 0; y < 4; y++){
        tile_names[121 + 9  + x + y * 8] = "POT";
    }
}
for(let x = 0; x < 3; x++){
    for(let y = 0; y < 4; y++){
        tile_names[121 + 57  + x + y * 8] = "FIREPLACE";
    }
}

// Water has multiple names based on where it is
//  Eg. OCEAN/RIVER/LAKE
// We would also like to change trees to forest
export const override_names = [
    {
        // TODO: Coordinates
        left: -42,
        top: 0,
        right: -37,
        bottom: 4,
        name: ["RIVER"],
        override: "WATER",
    },
    {
        // TODO: Coordinates
        left: -42,
        top: 0,
        right: -37,
        bottom: 4,
        name: ["OCEAN"],
        override: "WATER",
    },

    {
        // TODO: Coordinates
        left: -42,
        top: 0,
        right: -37,
        bottom: 4,
        name: ["FOREST"],
        override: "TREE",
    },
];

export const signposts = [
    {
        // TODO: Coordinates
        left: -42,
        top: 0,
        right: -37,
        bottom: 4,
        text: ["HOME", "MAYA"],
    },
];