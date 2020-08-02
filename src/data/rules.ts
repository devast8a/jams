import { reg, _ } from '../language_handler.js';
import { Character } from '../test.js';
import { tile_names } from './tile_names.js';

////////////////////////////////////////////////////////////////////////////////////////////////////
// Implement handlers for MayaLang

export function load_rules(){
    // What is the name of __?
    // NAME <WHAT> <NAME>
    reg(['NAME', _, 'QUERY'], async(simulation, speaker, listener, words) => {
        switch(words[1]){
            case 'YOU':
                await listener.talk(speaker, ['NAME', 'SELF', listener.name]);
                return;

            case 'THAT':
                const direction = getDirection(speaker);

                if(direction === undefined){
                    break;
                }

                const tiles = simulation.map.queryTileXY(speaker.x + direction.x, speaker.y + direction.y);

                if(tiles === undefined){
                    break;
                }

                const tileName = tile_names[tiles[tiles.length - 1]];
                await listener.talk(speaker, ['NAME', 'THAT', tileName]);
                return;
        }

        await listener.talk(speaker, ['NO', 'UNDERSTAND']);
    });

    // Follow me here
    // FOLLOW 'YOU' 'ME'
    reg(['FOLLOW', 'YOU', 'SELF'], async(simulation, speaker, listener, words) => {
        await listener.walk(speaker);
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
function getDirection(character: Character){
    // Get the tile the player is facing
    switch(character.animation){
        case 'standing/up':     return {x:  0, y: -1};
        case 'standing/down':   return {x:  0, y:  1};
        case 'standing/left':   return {x: -1, y:  0};
        case 'standing/right':  return {x:  1, y:  0};
    }

    return undefined;
}