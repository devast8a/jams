import { Character, Emote, Simulation } from '../test.js';
import { sleep } from '../core.js';
import { mayaToPlayer, playerToMaya, mayaToDev, devToMaya } from '../data/dictionary.js';

const MED_PAUSE = 1000;

async function walk_to_a(character: Character){
    await character.walk({x: -46, y: 2});
    character.animation = 'standing/right';
}

async function walk_to_b(character: Character){
    await character.walk({x: -43, y: 2});
    character.animation = 'standing/right';
}

async function walk_to_chair(character: Character){
    await character.walk({x: -45, y: 2});
    character.animation = 'standing/down';
}

async function walk_to_drawers(character: Character){
    await character.walk({x: -46, y: 2});
    character.animation = 'standing/up';
}


export async function tutorial(simulation: Simulation, maya: Character, player: Character){
    // Setup everything for the start of the game
    player.x = -42;
    player.y = 2;
    maya.x = -46;
    maya.y = 2;
    maya.animation = 'standing/right';
    player.animation = 'standing/left';
    player.name = 'placeholder';

    //await input(simulation, maya, player);
    //await dictionary(simulation, maya, player);
    //await name_self(simulation, maya, player);
    //await name_you(simulation, maya, player);
    //await name_this(simulation, maya, player);
    //await follow(simulation, maya, player);

    simulation.enableDictionary = true;
    simulation.inputHandler.enabled = true;
    await maya.talk(player, ['SELF', 'NAME', 'QUERY', 'LOCATION']);
    const result = await simulation.inputHandler.getInput();
    console.log(result);
    console.log(player.dictionary);
    await maya.talk(player, ['SELF', 'NAME', 'QUERY', 'LOCATION']);
}

////////////////////////////////////////////////////////////////////////////////
// Words taught: -None-
// Mechanics taught: Entering text
async function input(simulation: Simulation, maya: Character, player: Character){
    while(true){
        await walk_to_a(maya);

        await maya.emote(Emote.POINTS);
        await maya.talk(player, ['MAYA'], MED_PAUSE);

        await walk_to_b(maya);

        simulation.inputHandler.enabled = true;
        await maya.emote(Emote.POINTS);

        const result = await simulation.inputHandler.getInput();
        simulation.inputHandler.disable();
        if(result !== undefined){
            player.name = result;
            break;
        }

        await simulation.showFullscreenText('To talk, type something and press enter.');
    }

    await maya.emote(Emote.SMILES);

    // HACK: Insert player name into dictionaries to avoid translation
    devToMaya.set(player.name, player.name);
    mayaToDev.set(player.name, player.name);
    playerToMaya.set(player.name, player.name);
    mayaToPlayer.set(player.name, player.name);
}

////////////////////////////////////////////////////////////////////////////////
// Words taught: YOU, ME
// Mechanics taught: Using dictionary
async function dictionary(simulation: Simulation, maya: Character, player: Character){
    while(true){
        await walk_to_a(maya);

        await maya.emote(Emote.POINTS);
        await maya.talk(player, ['SELF'], MED_PAUSE);


        await walk_to_b(maya);

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
        await simulation.showFullscreenText('Click the bottom right icon to add translations for both words');
    }

    simulation.inputHandler.enabled = true;
}

////////////////////////////////////////////////////////////////////////////////
// Words taught: NAME, QUERY, NO (Maybe), YES
async function name_self(simulation: Simulation, maya: Character, player: Character){
    await walk_to_a(maya);

    while(true){
        await maya.emote(Emote.POINTS);
        await maya.talk(player, ['NAME', 'SELF', 'MAYA'], MED_PAUSE);

        await walk_to_b(maya);

        await maya.emote(Emote.POINTS);
        await maya.talk(player, ['NAME', 'YOU', player.name], MED_PAUSE);

        await walk_to_a(maya);

        await maya.talk(player, ['NAME', 'SELF', 'QUERY'], MED_PAUSE);

        const result = await simulation.inputHandler.getInput();
        if(result?.toLocaleUpperCase() === "MAYA"){
            break;
        }

        await maya.emote(Emote.FROWNS);
        await maya.talk(player, ['NO']);
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

        await maya.emote(Emote.FROWNS);
        await maya.talk(player, ['NO']);

        await maya.talk(player, ['NAME', 'YOU', player.name], MED_PAUSE);
        await sleep(1000);
    }

    await maya.emote(Emote.SMILES);
    await maya.talk(player, ['YES']);
    await maya.talk(player, ['NAME', 'YOU', player.name], MED_PAUSE);
}

////////////////////////////////////////////////////////////////////////////////
// Words taught: THIS
async function name_this(simulation: Simulation, maya: Character, player: Character){
    while(true){
        await walk_to_chair(maya);
        await maya.emote(Emote.POINTS);
        await maya.talk(player, ['NAME', 'THAT', 'CHAIR']);

        await walk_to_drawers(maya);
        await maya.emote(Emote.POINTS);
        await maya.talk(player, ['NAME', 'THAT', 'DRAWERS']);

        await walk_to_chair(maya);
        await maya.talk(player, ['NAME', 'THAT', 'QUERY']);
        const result = await simulation.inputHandler.getInput();

        console.log(result);
    }
}

////////////////////////////////////////////////////////////////////////////////
// Words taught: FOLLOW
// Mechanics taught: Player movement
async function follow(simulation: Simulation, maya: Character, player: Character){
}