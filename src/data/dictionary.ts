////////////////////////////////////////////////////////////////////////////////////////////////////

// Translate English used in the development to MayaLang
export const devToMaya = new Map([
    ["MAYA", "MAYA"],           // HACK: Avoid translating Maya's name

    ////////////////////////////////////////////////////////////////////////////////
    // Markers
    ['QUERY',   'TU'],          // QUERY

    ////////////////////////////////////////////////////////////////////////////////
    // Knowledge
    ['NAME',        'TURE'],   // NAME <TARGET> <NAME>
    ['LOCATION',    'TUTA'],   // LOCATION <TARGET> <NAME>
    ['EMOTION',     'TUCI'],   // EMOTION <TARGET> <EMOTION>

    ////////////////////////////////////////////////////////////////////////////////
    // Commands
    ['FOLLOW',      'FIRU'],    // FOLLOW <LISTENER> <TARGET>

    ////////////////////////////////////////////////////////////////////////////////
    // Things
    ['ROCK',        'AKU'],
    ['WALL',        'LAKU'],    // LIT. Many Rock
    ['WATERFALL',   'BALAKU'],  // LIT. Water Wall
    ['CLIFF',       'AKUAKU'],  // LIT. Rock Wall

    ////////////////////////////////////////////////////////////////////////////////
    // Furniture
    ['HOME',        'TATU'],
    ['BED',         'WHUATU'],  // LIT. Small Home
    ['CHAIR',       'KAHR'],
    ['DOOR',        'CHAKU'],   // LIT. People Wall
    ['TABLE',       'QUTATU'],  // LIT. Tree in Home
    ['DRAWERS',     'CHETU'],   // LIT. Thing Home
    ['CHEST',       'TULA'],

    ['FLOOR',       'BAAT'],
    ['MAT',         'CHUAT'],       // LIT. Self Floor
    ['PATH',        'FIRUBAAT'],    // LIT. Follow Ground
    ['BRIDGE',      'BAFIRUBAAT'],  // LIT. Water Path.
    ['FENCE',       'FIRUAKU'],     // LIT. Follow Wall

    ////////////////////////////////////////////////////////////////////////////////
    // LIFE/TREES
    ['GRASS',       'HUCHA'],       // LIT. One Group ("LIFE")
    ['FLOWER',      'LACIHUA'],     // LIT. Happy Life
    ['SHRUB',       'HUQA'],        // LIT. Large Grass
    ['TREE',        'QU'],          // (Massively shortened from LAQUHUQA, LIT. Large Shrub)

    ['PILLAR',      'QUAKU'],       // LIT. Tree Rock
    ['STATUE',      'BAKU'],        // LIT. Water Rock

    ////////////////////////////////////////////////////////////////////////////////
    // Directions
    ['UP',          'BITUA'],
    ['LEFT',        'LATUA'],
    ['RIGHT',       'TALATUA'],
    ['DOWN',        'BATUA'],

    ////////////////////////////////////////////////////////////////////////////////
    // Water related
    ['WATER',   'BA'],
    ['OCEAN',   'BATU'],        // LIT. Water Home
    ['POT',     'WHUBATU'],     // LIT. Small Water Home
    ['RIVER',   'FIRUBATU'],    // LIT. Follow Water
    ['WELL',    'BABAAT'],      // LIT. Water Ground

    ////////////////////////////////////////////////////////////////////////////////
    // Fire Related
    ['FIRE',        'BI'],
    ['TORCH',       'BITU'],    // LIT. Fire Home
    ['FIREPLACE',   'BITAKU'],  // LIT. Fire Home Rock

    ////////////////////////////////////////////////////////////////////////////////
    // Emotions
    ['HAPPY',   'LACI'],        // LIT: Many Emotion
    ['SAD',     'WHUCI'],       // LIT: One Emotion
    ['SCARED',  'BACI'],        // LIT: Water Emotion
    ['ANGRY',   'BICI'],        // LIT: Fire Emotion

    ////////////////////////////////////////////////////////////////////////////////
    // Pronouns
    ['SELF',    'CHU'],
    ['YOU',     'CHI'],
    ['GROUP',   'CHA'],
    ['THAT',    'CHE'],

    ////////////////////////////////////////////////////////////////////////////////
    // Yes/No
    ['YES',     'JI'],
    ['NO',      'TA'],

    ////////////////////////////////////////////////////////////////////////////////
    // Numbers
    ['ONE',     'HU'],
    ['TWO',     'HI'],
    ['THREE',   'HA'],
    ['FOUR',    'LU'],
    ['FIVE',    'LI'],
    ['SIX',     'LA'],
    ['SMALL',   'WHU'],         // SMALL/FEW
    ['LARGE',   'LAQU'],        // LARGE/MANY
]);

export const mayaToPlayer = new Map<string, string>([
    ["MAYA", "MAYA"],
]);
export const playerToMaya = new Map<string, string>([
    ["MAYA", "MAYA"],
]);
export const mayaToDev = new Map<string, string>([
    ["MAYA", "MAYA"],
]);

for(const [key, value] of devToMaya){
    // Translate MayaLang back into English used in development
    mayaToDev.set(value, key);

    // Allow the player to speak MayaLang directly
    playerToMaya.set(value, value);
}

// Make sure we didn't screw anything up
if(new Set(devToMaya.values()).size !== devToMaya.size){
    console.log('== Duplicate word in dictionary');
}

// For debugging purposes automatically add translations for the following words.
//export const debugging = Array.from(devToMaya.keys());
//
//for(const word of debugging){
//    const translation = devToMaya.get(word)!;
//    playerToMaya.set(word, translation);
//    mayaToPlayer.set(translation, word);
//}