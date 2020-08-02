import { TextDisplay, Animations } from './text_animations.js';
import { InputHandler } from './input_handler.js';
import { CharacterAnimations, CharacterAnimation } from './data/animations.js';
import { TmxEngine } from './tmx.js';
import { PathFinder } from './path_finder.js';
import { Point } from './point.js';
import { tutorial } from './scripts/tutorial.js';
import { devToMaya, mayaToDev, mayaToPlayer } from './data/dictionary.js';
import { sleep } from './core.js';
import { FullscreenText } from './fullscreen_text.js';

function translate(words: any[], dictionary: Map<string, string>){
    return words.map(word => dictionary.get(word) || "???");
}

const _ = Symbol('Placeholder');
type Word = string | typeof _;

export enum Emote {
    FROWNS,
    POINTS,
    SMILES,
}

export function EmoteToText(emote: Emote, timeFadeout: number){
    switch(emote){
        case Emote.FROWNS:      return new TextDisplay(`--frowns--`, {animation: Animations.wavey, timeFadeout: timeFadeout, color: '200,255,200'});
        case Emote.POINTS:      return new TextDisplay(`--points--`, {animation: Animations.wavey, timeFadeout: timeFadeout, color: '200,255,200'});
        case Emote.SMILES:      return new TextDisplay(`--smiles--`, {animation: Animations.wavey, timeFadeout: timeFadeout, color: '200,255,200'});
    }
    throw new Error
}

export class Character {
    public name: Word = _;

    public readonly simulation: Simulation;

    public dictionary: Map<string, string>;
    public text = new Array<TextDisplay>();
    public x: number;
    public y: number;

    public animationData: CharacterAnimation;
    public textColor = '255,255,255';

    public constructor(
        simulation: Simulation,
        dictionary: Map<string, string>,
        animationData: CharacterAnimation,
    ){
        this.simulation = simulation;
        this.dictionary = dictionary;
        this.x = 0;
        this.y = 0;
        this.animationData = animationData;
        this.animationFrame = animationData['standing/down'][0];
    }

    private walk_promise: (() => void) | undefined = undefined;

    public walk(target: Point, offset?: Point){
        // Is there a pending completion of a walk?
        if(this.walk_promise){
            this.walk_promise();
            this.walk_promise = undefined;
        }

        const startPoint = {
            x: Math.round(this.x),
            y: Math.round(this.y),
        }
        const targetPoint = {
            x: Math.round(target.x + (offset !== undefined ? offset.x : 0)),
            y: Math.round(target.y + (offset !== undefined ? offset.y : 0)),
        };

        const path = PathFinder.find(this.simulation.map, startPoint, targetPoint);
        this.targetTile = path.pop();
        this.path = path;

        return new Promise<void>((resolve) => {
            this.walk_promise = resolve;
        });
    }

    public emote(emote: Emote, delay = 1000){
        const text = EmoteToText(emote, delay);

        this.text.push(text);

        return new Promise((resolve, reject) => {
            text.onTimeout = () => resolve();
        });
    }

    public talk(listener: Character, words: (string | typeof _)[], delay = 1000): Promise<void> {
        const as_speaker = translate(words, this.dictionary);

        if(this.simulation.enableTranslation){
            const as_listener = translate(as_speaker, listener.dictionary);
            this.text.push(new TextDisplay(as_listener.join(' ')));
        }

        const text = new TextDisplay(as_speaker.join(' '), {color: this.textColor});
        this.text.push(text);


        // Update LRU words
        for(const word of as_speaker){
            if(typeof(word) !== 'string'){
                continue;
            }

            if(word === 'MAYA' || word === this.simulation.player.name){
                continue;
            }

            const index = this.simulation.LRUwords.indexOf(word);
            if(index !== -1){
                this.simulation.LRUwords.splice(index, 1);
            }
            this.simulation.LRUwords.push(word);
        }

        return new Promise((resolve, reject) => {
            text.onTimeout = () => resolve();
        });
    }

    private targetTile: Point | undefined;
    private path = new Array<Point>();
    
    public currentAnimationFrame = 0;
    public currentAnimationTime = 0;
    public animation: any = 'walking/down';
    public animationFrame: number[];

    public update(delta: number){
        // Update movement
        const move_speed = 3 * delta / 1000;
        if(this.targetTile !== undefined){
            if(Math.abs(this.x - this.targetTile.x) >= move_speed * 1.5){
                this.y = this.targetTile.y;
                if(this.x < this.targetTile.x){this.x += move_speed; this.animation = 'walking/right';}
                if(this.x > this.targetTile.x){this.x -= move_speed; this.animation = 'walking/left';}
            } else if(Math.abs(this.y - this.targetTile.y) >= move_speed * 1.5) {
                this.x = this.targetTile.x;
                if(this.y < this.targetTile.y){this.y += move_speed; this.animation = 'walking/down';}
                if(this.y > this.targetTile.y){this.y -= move_speed; this.animation = 'walking/up';}
            } else {
                this.targetTile = this.path.pop();
                
                if(this.targetTile === undefined){
                    this.x = Math.round(this.x);
                    this.y = Math.round(this.y);
                    this.animation = this.animation.replace('walking', 'standing');

                    if(this.walk_promise !== undefined){
                        this.walk_promise();
                        this.walk_promise = undefined;
                    }
                }
            }
        }

        // Update animation
        const animation = (this as any).animationData[this.animation] as number[][];
        if(this.currentAnimationFrame >= animation.length){
            this.currentAnimationFrame = 0;
        }
        this.currentAnimationTime += delta;
        if(this.currentAnimationTime >= animation[this.currentAnimationFrame][2]){
            this.currentAnimationTime = 0;
            this.currentAnimationFrame = (this.currentAnimationFrame + 1) % animation.length;
        }
        this.animationFrame = animation[this.currentAnimationFrame];
    }
}

interface SpeechHandler {
    words: (string | typeof _)[];
    fn: (speaker: Character, listener: Character, words: string[]) => Promise<void>;
}
const handlers = new Array<SpeechHandler>();
function reg(
    words: (string | typeof _)[],
    fn: (speaker: Character, listener: Character, words: string[]) => Promise<void>,
){
    handlers.push({words: words, fn: fn});
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Implement handlers for MayaLang

// What is the name of __?
// NAME <WHAT> <NAME>
reg(['NAME', _, 'QUERY'], async(speaker, listener, words) => {
    if(words[1] === 'YOU'){
        await listener.talk(speaker, ['NAME', 'SELF', listener.name]);
    }
});

// Where is the location of __?
// LOCATION <WHAT> <NAME>
reg(['LOCATION', _, 'QUERY'], async(speaker, listener, words) => {

});

// Translate all of the handlers words
handlers.forEach((handler) => handler.words = translate(handler.words, devToMaya));

function parse(speaker: Character, listener: Character, speech: string){
    // Break it into words
    // Use the user dictionary to translate
    const words = translate(speech.split(/ /g), devToMaya);

    // Find any matches in the speech handlers
    const matches = handlers.filter(entry => {
        if(entry.words.length > words.length){
            return false;
        }

        for(let i = 0; i < words.length; i++){
            if(entry.words[i] !== words[i] && entry.words[i] !== _){
                return false;
            }
        }

        return true;
    });

    if(matches.length === 0){
        // I don't understand
        return;
    }

    // Select the one with the least placeholders
    let leastV = matches[0].words.filter(x => x === _).length;
    let least  = matches[0];
    for(let i = 1; i < matches.length; i++){
        let l = matches[i].words.filter(x => x === _).length;
        if(l < leastV){
            leastV = l;
            least = matches[i];
        }
    }

    // Execute it
    least.fn(speaker, listener, translate(words, mayaToDev));
}

export class Simulation {
    public readonly maya = new Character(this, devToMaya, CharacterAnimations.female);
    public readonly player = new Character(this, mayaToPlayer, CharacterAnimations.male);

    public readonly people = new Array<Character>();
    public readonly inputHandler = new InputHandler();
    public readonly map = new TmxEngine();

    public enableTranslation = false;
    public enableMovement = false;
    public enableDictionary = false;

    public LRUwords = new Array<string>();

    public fullscreenText: FullscreenText | undefined;

    public showFullscreenText(text: string) {
        this.fullscreenText = new FullscreenText(text);

        return new Promise<void>((resolve) => {
            this.fullscreenText!.completed = () => {
                resolve();
                this.fullscreenText = undefined;
            };
        });
    }

    public async start(){
        const player = this.player;
        const maya = this.maya;

        this.people.push(maya);
        this.people.push(player);
        this.maya.textColor = '255,200,255';
        this.player.textColor = '200,200,255';

        maya.name = 'maya';

        await tutorial(this, maya, player);
    }
}