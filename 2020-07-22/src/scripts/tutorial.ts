import { Character, Emote, Simulation } from '../test.js';
import { sleep } from '../core.js';
import { mayaToPlayer, playerToMaya, mayaToDev, devToMaya } from '../data/dictionary.js';
import { textToWords, translate, parse, Word } from '../language_handler.js';

const MED_PAUSE = 1000;

export async function tutorial(simulation: Simulation, maya: Character, player: Character){
    player.name = 'dev';

    await initialize(simulation, maya, player);

    // Run the tutorial
    await input(simulation, maya, player);
    await dictionary(simulation, maya, player);
    await name_self(simulation, maya, player);
    await name_you(simulation, maya, player);
    await name_this(simulation, maya, player);
    await follow(simulation, maya, player);


    // Game is good to go
    devToMaya.set(player.name, player.name);
    mayaToDev.set(player.name, player.name);
    playerToMaya.set(player.name, player.name);
    mayaToPlayer.set(player.name, player.name);

    simulation.enableMovement = true;
    simulation.enableDictionary = true;
    simulation.enableTranslation = true;
    simulation.inputHandler.enabled = true;

    simulation.inputHandler.handler = (x) => {
        parse(simulation, player, maya, x.toLocaleUpperCase());
    }
}

////////////////////////////////////////////////////////////////////////////////
// Words taught: -None-
// Mechanics taught: Entering text
async function input(simulation: Simulation, maya: Character, player: Character){
    while(true){
        await walk_to_point_a(maya);

        await maya.emote(Emote.POINTS);
        await maya.talk(player, ['MAYA'], MED_PAUSE);

        await walk_to_point_b(maya);

        simulation.inputHandler.enabled = true;
        await maya.emote(Emote.POINTS);

        const result = await simulation.inputHandler.getInput();
        if(result !== undefined){
            player.name = result;
            break;
        }

        await simulation.showFullscreenText('To talk, type something and press enter.');
    }

    simulation.inputHandler.disable();

    // HACK: Insert player name into dictionaries to avoid translation
    devToMaya.set(player.name, player.name);
    mayaToDev.set(player.name, player.name);
    playerToMaya.set(player.name, player.name);
    mayaToPlayer.set(player.name, player.name);

    await maya.emote(Emote.SMILES);
}

////////////////////////////////////////////////////////////////////////////////
// Words taught: YOU, ME
// Mechanics taught: Using dictionary
async function dictionary(simulation: Simulation, maya: Character, player: Character){
    while(true){
        await walk_to_point_a(maya);

        await maya.emote(Emote.POINTS);
        await maya.talk(player, ['SELF'], MED_PAUSE);


        await walk_to_point_b(maya);

        await maya.emote(Emote.POINTS);
        await maya.talk(player, ['YOU'], MED_PAUSE);

        // Check if there is a word for both SELF and YOU
        const SELF = maya.dictionary.get("SELF")!;
        const YOU = maya.dictionary.get("YOU")!;
        if(player.dictionary.get(SELF) !== undefined && player.dictionary.get(YOU)){
            break;
        }

        // Introduce the dictionary
        simulation.enableDictionary = true;
        simulation.enableTranslation = true;
        await simulation.showFullscreenText('When you are ready, click the bottom right icon to add translations for both words');
    }

    simulation.inputHandler.enabled = true;
}

////////////////////////////////////////////////////////////////////////////////
// Words taught: NAME, QUERY, NO (Maybe), YES
async function name_self(simulation: Simulation, maya: Character, player: Character){
    await walk_to_point_a(maya);

    while(true){
        await maya.emote(Emote.POINTS);
        await maya.talk(player, ['NAME', 'SELF', 'MAYA'], MED_PAUSE);

        await walk_to_point_b(maya);

        await maya.emote(Emote.POINTS);
        await maya.talk(player, ['NAME', 'YOU', player.name], MED_PAUSE);

        await walk_to_point_a(maya);

        await maya.talk(player, ['NAME', 'SELF', 'QUERY'], MED_PAUSE);

        const result = await simulation.inputHandler.getInput();
        if(result?.toLocaleUpperCase() === "MAYA"){
            break;
        }
        
        // Only frown if the player types something wrong
        if(result !== undefined){
            await maya.emote(Emote.FROWNS);
            await maya.talk(player, ['NO']);
        }
    }

    await maya.emote(Emote.SMILES);
    await maya.talk(player, ['YES']);
    await maya.talk(player, ['NAME', 'SELF', 'MAYA'], MED_PAUSE);
}

////////////////////////////////////////////////////////////////////////////////
// Words taught: NAME, QUERY, NO (Maybe), YES
async function name_you(simulation: Simulation, maya: Character, player: Character){
    while(true){
        await maya.talk(player, ['NAME', 'YOU', 'QUERY'], MED_PAUSE);

        const result = await simulation.inputHandler.getInput();
        if(result?.toLocaleLowerCase() === (player.name as string).toLocaleLowerCase()){
            break;
        }

        // Only frown if the player types something wrong
        if(result !== undefined){
            await maya.emote(Emote.FROWNS);
            await maya.talk(player, ['NO']);
        }

        await maya.talk(player, ['NAME', 'YOU', player.name], MED_PAUSE);
        await sleep(1000);
    }

    await maya.emote(Emote.SMILES);
    await maya.talk(player, ['YES']);
    await maya.talk(player, ['NAME', 'YOU', player.name], MED_PAUSE);
}

////////////////////////////////////////////////////////////////////////////////
// Words taught: THAT
async function name_this(simulation: Simulation, maya: Character, player: Character){
    await walk_to_drawers(maya);
    await maya.emote(Emote.POINTS);
    await maya.talk(player, ['NAME', 'THAT', 'DRAWERS']);
    await walk_to_chair(maya);

    while(true){
        await maya.emote(Emote.POINTS);
        await maya.talk(player, ['NAME', 'THAT', 'CHAIR']);

        await maya.talk(player, ['NAME', 'THAT', 'QUERY']);

        const result = translateInput(await simulation.inputHandler.getInput());
        if(compareWords(result, ['CHAIR'])){
            break;
        }

        // Only frown if the player types something wrong
        if(result !== undefined){
            await maya.emote(Emote.FROWNS);
            await maya.talk(player, ['NO']);
        }
    }

    await maya.emote(Emote.SMILES);
    await maya.talk(player, ['YES']);
}

////////////////////////////////////////////////////////////////////////////////
// Words taught: FOLLOW
// Mechanics taught: Player movement
async function follow(simulation: Simulation, maya: Character, player: Character){
    await walk_to_left_room(maya);
    while(true){
        await maya.talk(player, ['FOLLOW', 'YOU', 'SELF']);

        if(player.inRect(leftRoom)){
            break;
        }

        await simulation.showFullscreenText('Left click on a tile to walk toward it.');
        simulation.enableMovement = true;
    }

    await maya.emote(Emote.SMILES);
    await walk_to_right_room(maya);

    while(true){
        await maya.talk(player, ['FOLLOW', 'YOU', 'SELF']);

        if(player.inRect(rightRoom)){
            break;
        }

        await simulation.showFullscreenText('Follow maya into the other room.');
        simulation.enableMovement = true;
    }

    await maya.emote(Emote.SMILES);
}

////////////////////////////////////////////////////////////////////////////////
// Helper functions
async function walk_to_point_a(character: Character){
    await character.walk({x: -46, y: 2});
    character.animation = 'standing/right';
}

async function walk_to_point_b(character: Character){
    await character.walk({x: -43, y: 2});
    character.animation = 'standing/right';
}

const leftRoom = {
    left: -47,
    right: -43,
    top: 0,
    bottom: 7,
};
async function walk_to_left_room(character: Character){
    await character.walk({x: -44, y: 5});
    character.animation = 'standing/up';
}

const rightRoom = {
    left: -43,
    right: -37,
    top: 0,
    bottom: 3,
};
async function walk_to_right_room(character: Character){
    await character.walk({x: -39, y: 3});
    character.animation = 'standing/left';
}

async function walk_to_chair(character: Character){
    await character.walk({x: -45, y: 2});
    character.animation = 'standing/down';
}

async function walk_to_drawers(character: Character){
    await character.walk({x: -46, y: 2});
    character.animation = 'standing/up';
}

async function initialize(simulation: Simulation, maya: Character, player: Character){
    // Setup everything for the start of the game
    player.x = -42;
    player.y = 2;
    maya.x = -46;
    maya.y = 2;
    maya.animation = 'standing/right';
    player.animation = 'standing/left';
    player.name = 'placeholder';
}

function compareWords(left: Word[] | undefined, right: string[]){
    if(left === undefined){
        return false;
    }

    if(left.length !== right.length){
        return false;
    }

    for(let i = 0; i < left.length; i++){
        if(left[i] !== right[i]){
            return false;
        }
    }

    return true;
}

function translateInput(input: string | undefined){
    if(input === undefined){
        return undefined;
    }

    const words = textToWords(input);
    const translation = translate(translate(words, playerToMaya), mayaToDev);

    return translation;
}