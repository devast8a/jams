import { Character, Simulation } from './test.js';
import { playerToMaya, mayaToDev, devToMaya } from './data/dictionary.js';

type LanguageRuleHandler = (simulation: Simulation, speaker: Character, listener: Character, words: Word[]) => Promise<void>;

interface LanguageRule {
    words: Word[];
    handler: LanguageRuleHandler;
}

export function textToWords(text: string){
    return text.split(' ').filter(x => x.length > 0);
}

export function translate(words: any[], dictionary: Map<string, string>){
    return words.map(word => word === _ ? _ : dictionary.get(word) || "???");
}

export const _ = Symbol('Placeholder');
const rules = new Array<LanguageRule>();

export function reg(words: Word[], handler: LanguageRuleHandler){
    rules.push({words: translate(words, devToMaya), handler: handler});
}

export type Word = string | typeof _;

export async function parse(simulation: Simulation, speaker: Character, listener: Character, speech: string){
    // Break it into words
    // Use the user dictionary to translate
    const words = translate(textToWords(speech), playerToMaya);

    // Find any matches in the speech handlers
    const matches = rules.filter(entry => {
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
        await listener.talk(speaker, ['NO', 'UNDERSTAND']);
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
    await least.handler(simulation, speaker, listener, translate(words, mayaToDev));
}

