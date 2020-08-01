////////////////////////////////////////////////////////////////////////////////////////////////////
// Translate English used in the development to MayaLang
export const devToMaya = new Map([
    ["MAYA", "MAYA"],           // Hack to avoid translating MAYA's name

    // Markers
    ['QUERY',   'TU'],          // QUERY

    // Knowledge
    ['NAME',        'TURE'],   // NAME <TARGET> <NAME>
    ['LOCATION',    'TUTA'],   // LOCATION <TARGET> <NAME>
    ['EMOTION',     'TUCI'],   // EMOTION <TARGET> <EMOTION>

    // Commands
    ['FOLLOW',      'FIRU'],    // FOLLOW <LISTENER> <TARGET>

    // Things
    ['HOME',    'TATU'],
    ['BED',     'WHUATU'],      // LIT. Small Home

    // BED
    // BRIDGE
    // CHAIR
    // CHEST
    // CLIFF
    // DOOR
    // DRAWERS
    // FENCE
    // FLOOR
    // FIREPLACE
    // FLOWER
    // GRASS
    // MAT
    // PATH
    // PILLAR
    // POT
    // ROCKS
    // ROCKS
    // SHRUB
    // STATUE
    // TABLE
    // TORCH
    // TREE
    // WALL
    // WATERFALL
    // WELL

    // Water related
    ['WATER',   'BA'],
    ['OCEAN',   'BATU'],        // LIT. Water Home
    ['POT',     'WHUBATU'],     // LIT. Small Water Home
    ['RIVER',   'FIRUBATU'],    // LIT. Follow Water

    // Fire Related
    ['FIRE',    'BI'],
    ['TORCH',   'BITU'],        // LIT. Fire Home

    // Emotions
    ['HAPPY',   'LACI'],        // LIT: Many Emotion
    ['SAD',     'WHUCI'],       // LIT: One Emotion
    ['SCARED',  'BACI'],        // LIT: Water Emotion
    ['ANGRY',   'BICI'],        // LIT: Fire Emotion

    // Pronouns
    ['SELF',    'CHU'],
    ['YOU',     'CHI'],
    ['GROUP',   'CHA'],

    // Yes/No
    ['YES',     'JI'],
    ['NO',      'TA'],

    // Numbers?
    ['ONE',     'HU'],
    ['TWO',     'HI'],
    ['THREE',   'HA'],
    ['FOUR',    'LU'],
    ['FIVE',    'LI'],
    ['SIX',     'LA'],
    ['SMALL',   'WHU'],         // SMALL/FEW
    ['LARGE',   'LAQU'],        // LARGE/MANY
]);

// Translate MayaLang back into English used in development
export const mayaToDev = new Map<string, string>();
for(const [key, value] of devToMaya){
    mayaToDev.set(value, key);
}

// Make sure we didn't screw anything up
if(new Set(devToMaya.values()).size !== devToMaya.size){
    console.log('== Duplicate word in dictionary');
}