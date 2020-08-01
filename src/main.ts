import * as text from './text_animations.js';
import { Simulation } from './test.js';
import { TmxEngine } from './tmx.js';

function loadImage(src: string){
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = src;
    });
}

declare var FontFace: any;
async function loadFont(name: string, src: string){
    const loader = new FontFace(name, `url(${src})`);
    const font = await loader.load();
    (document as any).fonts.add(font);
    return name;
}

async function loadFile(src: string){
    const response = await fetch(src)
    return await response.text();
}

function createCanvas(width: number, height: number, z: number): [HTMLCanvasElement, CanvasRenderingContext2D]{
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.zIndex = z.toString();
    canvas.width = document.body.clientWidth + width;
    canvas.height = document.body.clientHeight + height;
    document.body.appendChild(canvas);
    const context = canvas.getContext('2d')!;

    return [canvas, context];
}

window.addEventListener('DOMContentLoaded', async function() {
    const [dictionaryCanvas, dictionaryCtx] = createCanvas(   0,    0, 4);
    const [animatedCanvas, animatedCtx]     = createCanvas(   0,    0, 3);
    const [staticCanvas, staticCtx]         = createCanvas(1024, 1024, 2);
    const [waterAnimCanvas, waterAnimCtx]   = createCanvas(1024, 1024, 1);
    const [waterCanvas, waterCtx]           = createCanvas(1024, 1024, 0);

    staticCtx.fillText("Loading please wait, soz", 100, 100);

    // Load resources
    const tiles1        = await loadImage('assets/basictiles.png');
    const tiles2        = await loadImage('assets/things.png');
    const characters    = await loadImage('assets/characters.png');
    const water1        = await loadImage('assets/water1.png');
    const water2        = await loadImage('assets/water2.png');

    const fontRegular   = await loadFont('PixelFontRegular', 'assets/ChubbyChoo-Regular.woff');

    const simulation = new Simulation();
    simulation.map.parseFromString(await loadFile('assets/map.tmx'), {
        'basictiles.png': tiles1,
        'things.png':     tiles2,
    });

    simulation.start();

    // Update all other tiles
    const mouse = {x: 0, y: 0};

    // Setup the pattern
    const water1Pattern = waterAnimCtx.createPattern(water1, 'repeat')!;
    const water2Pattern = waterAnimCtx.createPattern(water2, 'repeat')!;

    const camera = {x: 0, y: 0};

    const tile_width = 32;
    const tile_height = 32;
    const tile_margin = 16;

    class TmxRenderer {
        private previousX = 0;
        private previousY = 0;

        public redraw(){
            // Render the map again with x and y at the center
            staticCtx.clearRect(0, 0, staticCanvas.width, staticCanvas.height);
            waterCtx.clearRect(0, 0, staticCanvas.width, staticCanvas.height);
            staticCtx.imageSmoothingEnabled = false;
            waterCtx.imageSmoothingEnabled = false;

            simulation.map.draw(this.previousX, this.previousY, staticCtx, waterCtx);
        }

        public update(x: number, y: number){
            x -= animatedCanvas.clientWidth / 64;
            y -= animatedCanvas.clientHeight / 64;

            const uX = Math.floor(x / tile_margin) * tile_margin;
            const uY = Math.floor(y / tile_margin) * tile_margin;
            if(
                Math.abs(uX - this.previousX) >= tile_margin ||
                Math.abs(uY - this.previousY) >= tile_margin
            ){
                this.previousX = uX;
                this.previousY = uY;
                this.redraw();
            }

            const cx = (this.previousX - x) * tile_width - 16;
            const cy = (this.previousY - y) * tile_height - 16;

            staticCanvas.style.left = cx.toString();
            staticCanvas.style.top = cy.toString();
            waterCanvas.style.left = cx.toString();
            waterCanvas.style.top = cy.toString();
            waterAnimCanvas.style.left = cx.toString();
            waterAnimCanvas.style.top = cy.toString();
        }
    }

    const map_renderer = new TmxRenderer();
    let tutorial: TutorialMessage | undefined;
    let dictionaryOpen = false;

    let currentWord = '';
    let selectedWord = '';
    let selectedTranslationText = '';

    let previous = 0;
    function updateAnimatedTiles(time: number){
        const delta = time - previous;
        previous = time;

        if(!focus){
            requestAnimationFrame(updateAnimatedTiles);
            return;
        }

        if(dictionaryOpen){
            dictionaryCtx.clearRect(0, 0, dictionaryCanvas.width, dictionaryCanvas.height);
            dictionaryCtx.fillStyle = 'rgba(0,0,0,0.4)';
            dictionaryCtx.fillRect(0, 0, dictionaryCanvas.width, dictionaryCanvas.height);

            let y = 200;

            dictionaryCtx.fillStyle = 'rgba(200,200,200,1)';
            dictionaryCtx.font = '32px PixelFontRegular';

            dictionaryCtx.fillText("Word", 100, y - 32);
            dictionaryCtx.fillText("Translation", 500, y - 32);

            dictionaryCtx.fillStyle = 'rgba(255,255,255,1)';
            dictionaryCtx.font = '22px PixelFontRegular';

            // Display words
            currentWord = '';
            for(let i = simulation.LRUwords.length - 1; i >= 0; i--){
                const word = simulation.LRUwords[i];
                let translation = simulation.player.dictionary.get(word);

                if(translation === undefined){
                    translation = '???';
                }

                if(selectedWord === word){
                    translation = selectedTranslationText;
                    translation += time % 1000 < 500 ? "|" : "";
                }

                dictionaryCtx.fillStyle = 'rgba(255,255,255,1)';
                dictionaryCtx.fillText(word, 100, y);
                if(mouse.x > 500 && mouse.y >= y - 24 && mouse.y <= y + 8 && mouse.x < 500 + dictionaryCtx.measureText(translation).width){
                    dictionaryCtx.fillStyle = 'rgba(180,180,255,1)';
                    currentWord = word;
                }
                dictionaryCtx.fillText(translation, 500, y);
                y += 32;
            }

            requestAnimationFrame(updateAnimatedTiles);
            return;
        }
        dictionaryCtx.clearRect(0, 0, dictionaryCanvas.width, dictionaryCanvas.height);

        // Update water
        if(Math.floor(time / 500) % 2 === 0){
            if(waterAnimCtx.fillStyle !== water1Pattern){
                waterAnimCtx.globalAlpha = 0.7;
                waterAnimCtx.fillStyle = water1Pattern;
                waterAnimCtx.clearRect(0, 0, waterAnimCanvas.width, waterAnimCanvas.height);
                waterAnimCtx.fillRect(0, 0, waterAnimCanvas.clientWidth, waterAnimCanvas.clientHeight);
            }
        } else {
            if(waterAnimCtx.fillStyle !== water2Pattern){
                waterAnimCtx.globalAlpha = 0.7;
                waterAnimCtx.fillStyle = water2Pattern;
                waterAnimCtx.clearRect(0, 0, waterAnimCanvas.width, waterAnimCanvas.height);
                waterAnimCtx.fillRect(0, 0, waterAnimCanvas.clientWidth, waterAnimCanvas.clientHeight);
            }
        }

        // Update backgrounds
        camera.x = simulation.player.x;
        camera.y = simulation.player.y;
        map_renderer.update(camera.x, camera.y);

        animatedCtx.clearRect(0, 0, animatedCanvas.width, animatedCanvas.height);
        animatedCtx.translate(-(camera.x * 32 - animatedCanvas.width/2 + 16), -(camera.y * 32 - animatedCanvas.height/2 + 16));
        animatedCtx.imageSmoothingEnabled = false;

        const frame = 0; //Math.floor(i/15) % animation.length;

        animatedCtx.font = '22px PixelFontRegular';

        animatedCtx.save();
        animatedCtx.shadowColor = "#000000";
        animatedCtx.shadowOffsetX = 0;
        animatedCtx.shadowOffsetY = 0;
        animatedCtx.shadowBlur = 10;

        animatedCtx.fillStyle = `rgba(${simulation.player.textColor},1)`;
        let text = simulation.inputHandler.current;
        const textWidth = animatedCtx.measureText(text).width;
        if(simulation.inputHandler.returnCurrent){
            if(time % 1500 < 500){
                text += '.';
            } else if(time % 1500 < 1000){
                text += '..';
            } else {
                text += '...';
            }
        }
        animatedCtx.strokeText(text, simulation.player.x * 32 - textWidth / 2 + 16,  simulation.player.y * 32 - 5);
        animatedCtx.fillText(text, simulation.player.x * 32 - textWidth / 2 + 16,  simulation.player.y * 32 - 5);

        for(const person of simulation.people){
            person.update(delta);

            const x = person.x * 32;
            const y = person.y * 32; 

            let line = 0;
            for(const text of person.text){
                text.display(animatedCtx, x, y - 5 + line, time);
                text.update(delta);
                line -= 16;
            }
            person.text = person.text.filter(x => x.timeFadeout > 0);
        }

        animatedCtx.restore();
        for(const person of simulation.people){
            const x = person.x * 32;
            const y = person.y * 32; 
            animatedCtx.drawImage(characters, person.animationFrame[0], person.animationFrame[1], 16, 16, x, y, 32, 32);
        }

        animatedCtx.translate((camera.x * 32 - animatedCanvas.width/2 + 16), (camera.y * 32 - animatedCanvas.height/2 + 16));

        // Draw dictionary in bottom right corner
        const left = animatedCanvas.width - 128;
        const top = animatedCanvas.height - 128;
        if(simulation.enableDictionary){
            animatedCtx.drawImage(tiles1, 16 * 7, 16 * 8, 16, 16, left, top, 64, 64);
            if(left <= mouse.x && mouse.x <= left + 64 && top <= mouse.y && mouse.y <= top + 64){
                animatedCtx.fillStyle = 'rgba(0, 0, 0, 0.0)';
            } else {
                animatedCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            }
            animatedCtx.fillRect(left, top, 64, 64);
        }

        if(simulation.tutorialMessage !== ''){
            tutorial = new TutorialMessage(simulation.tutorialMessage);
            simulation.tutorialMessage = '';
        }
        if(tutorial !== undefined){
            tutorial.display(animatedCtx, delta);
            if(tutorial.time >= 3000){
                tutorial = undefined;
            }
        }

        requestAnimationFrame(updateAnimatedTiles);
    }

    requestAnimationFrame(updateAnimatedTiles);

    let focus = true;
    window.addEventListener('blur', () => focus = false);
    window.addEventListener('focus', () => focus = true);

    window.addEventListener('resize', () => {
        animatedCanvas.width = document.body.clientWidth;
        animatedCanvas.height = document.body.clientHeight;
        staticCanvas.width = document.body.clientWidth + 1024;
        staticCanvas.height = document.body.clientHeight + 1024;
        waterCanvas.width = document.body.clientWidth + 1024;
        waterCanvas.height = document.body.clientHeight + 1024;
        waterAnimCanvas.width = document.body.clientWidth + 1024;
        waterAnimCanvas.height = document.body.clientHeight + 1024;
        staticCanvas.width = document.body.clientWidth + 1024;
        staticCanvas.height = document.body.clientHeight + 1024;

        // Schedule a redraw of static tiles
        requestAnimationFrame(x => map_renderer.redraw());
    });

    window.addEventListener('keydown', (e) => {
        // Close dictionary with escape key
        if(dictionaryOpen){
            switch(e.keyCode){
                case 8:
                    selectedTranslationText = selectedTranslationText.slice(0, -1);
                    break;

                case 9:
                    break;

                case 13:
                    // Commit the translation
                    if(selectedWord !== ''){
                        simulation.player.dictionary.set(selectedWord, selectedTranslationText);
                        selectedWord = '';
                        selectedTranslationText = '';
                    }
                    break;

                case 16:
                case 17:
                case 18:
                    break;

                case 27:
                    if(selectedWord === ''){
                        dictionaryOpen = false;
                    } else {
                        selectedWord = '';
                        selectedTranslationText = '';
                    }
                    break;

                default:
                    selectedTranslationText += e.key.toLocaleLowerCase();
                    break;
            }

            return;
        }

        simulation.inputHandler.onKeyDown(e);

        // Debugging
        //switch(e.keyCode){
        //    case 37: simulation.player.x -= 1; break;
        //    case 38: simulation.player.y -= 1; break;
        //    case 39: simulation.player.x += 1; break;
        //    case 40: simulation.player.y += 1; break;
        //}
    });

    window.addEventListener('mousedown', (e) => {
        if(dictionaryOpen){
            selectedWord = currentWord;
            selectedTranslationText = simulation.player.dictionary.get(currentWord) ?? "";
            return;
        }
        
        if(simulation.enableDictionary){
            const left = animatedCanvas.width - 128;
            const top = animatedCanvas.height - 128;
            if(left <= mouse.x && mouse.x <= left + 64 && top <= mouse.y && mouse.y <= top + 64){
                dictionaryOpen = true;
                return
            }
        }

        if(simulation.enableMovement){
            switch(e.button){
                case 0:
                    const x = Math.floor((e.clientX + 16 - animatedCanvas.clientWidth / 2) / 32);
                    const y = Math.floor((e.clientY + 16 - animatedCanvas.clientHeight / 2) / 32);

                    simulation.player.walk({
                        x: x + camera.x,
                        y: y + camera.y,
                    });
                    break;
            }
        }
    })

    window.addEventListener('mousemove', (e) => {
        const rect = animatedCanvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
});


// This is completely decoupled from the simulator that instantiates these
//  If you change the time, you need to also change the time in Simulation.tutorial
class TutorialMessage {
    public readonly message: string;
    public time = 0;

    public constructor(message: string){
        this.message = message;
    }

    public display(ctx: CanvasRenderingContext2D, delta: number){
        this.time += delta;
        ctx.save();
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        if(this.time < 500){
            // Fade in time
            ctx.fillStyle = `rgba(0,0,0,${this.time/500*0.3})`;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = `rgba(255,255,255,${this.time/500*1.0})`;
            ctx.font = '64 PixelFontRegular';
            ctx.fillText(this.message, ctx.canvas.width/2 - ctx.measureText(this.message).width/2, ctx.canvas.height / 2);
        } else if(this.time < 500 + 3000) {
            // Steady state
            ctx.fillStyle = `rgba(0,0,0,0.3)`;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = `rgba(255,255,255,1)`;
            ctx.font = '64 PixelFontRegular';
            ctx.fillText(this.message, ctx.canvas.width/2 - ctx.measureText(this.message).width/2, ctx.canvas.height / 2);
        } else if(this.time < 500 + 3000 + 500) {
            // Fade out
            ctx.fillStyle = `rgba(0,0,0,${0.3 - (this.time-2500)/500*0.3})`;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = `rgba(255,255,255,${1.0 - (this.time-2500)/500*1.0})`;
            ctx.font = '64 PixelFontRegular';
            ctx.fillText(this.message, ctx.canvas.width/2 - ctx.measureText(this.message).width/2, ctx.canvas.height / 2);
        }

        ctx.restore();
    }
}