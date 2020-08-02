export type Animation = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string, time: number) => void;

export const Animations = {
    upDown: (ctx: CanvasRenderingContext2D, x: number, y: number, text: string, time: number) => {
        ctx.strokeText(text, x, y + 2 * Math.sin(time / 500));
        ctx.fillText(text, x, y + 2 * Math.sin(time / 500));
    },
    leftRight: (ctx: CanvasRenderingContext2D, x: number, y: number, text: string, time: number) => {
        ctx.strokeText(text, x + 2 * Math.sin(time / 500), y);
        ctx.fillText(text, x + 2 * Math.sin(time / 500), y);
    },
    shaky: (ctx: CanvasRenderingContext2D, x: number, y: number, text: string, time: number) => {
        ctx.strokeText(text, x + Math.sin(time), y + Math.sin(time));
        ctx.fillText(text, x + Math.sin(time), y + Math.sin(time));
    },
    wavey: (ctx: CanvasRenderingContext2D, x: number, y: number, text: string, time: number) => {
        for(const char of text){
            const width = ctx.measureText(char).width;
            ctx.strokeText(char, x, y + 2 * Math.sin((x/7) + (time / 100)));
            ctx.fillText(char, x, y + 2 * Math.sin((x/7) + (time / 100)));
            x += width;
        }
    },
    none: (ctx: CanvasRenderingContext2D, x: number, y: number, text: string, time: number) => {
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
    }
}

export class TextDisplay {
    public readonly text: string;
    public readonly timeBetweenWords: number;
    public animation: Animation;

    private words = new Array<string>();
    private displayed = '';

    private word = 0;
    public timeToNextWord = 0;
    public timeFadeout = 0;
    public color: string;

    public onTimeout: ((display: TextDisplay) => void) | undefined;

    public constructor(
        text: string,
        options?: {
            timeBetweenWords?: number,
            timeFadeout?: number,
            animation?: Animation,
            color?: string,
        }
    ){
        options = options || {};

        this.text = text.toLocaleLowerCase();
        this.words = this.text.split(/ /g);

        this.timeBetweenWords   = options.timeBetweenWords === undefined ? 500 : options.timeBetweenWords;
        this.timeFadeout        = options.timeFadeout === undefined ? 2500 : options.timeFadeout;
        this.animation          = options.animation === undefined ? Animations.none : options.animation;
        this.color              = options.color === undefined ? '255,255,255' : options.color;
    }

    public display(ctx: CanvasRenderingContext2D, x: number, y: number, time: number){
        x += 16 - ctx.measureText(this.text).width / 2;

        if(this.timeFadeout <= 500){
            ctx.strokeStyle = `rgba(32,32,32,${this.timeFadeout/500*0.5})`;
            ctx.fillStyle = `rgba(${this.color},${this.timeFadeout/500})`;
        } else {
            ctx.strokeStyle = `rgba(32,32,32,0.5)`;
            ctx.fillStyle = `rgba(${this.color},1)`;
        }
        this.animation(ctx, x, y, this.displayed, time);

        if(this.word < this.words.length){
            x += ctx.measureText(this.displayed).width;
            ctx.strokeStyle = `rgba(32,32,32,${this.timeToNextWord/this.timeBetweenWords*0.5})`;
            ctx.fillStyle = `rgba(${this.color},${this.timeToNextWord/this.timeBetweenWords})`;
            this.animation(ctx, x, y, this.words[this.word], time);
        }
    }

    public update(time: number){
        if(this.timeToNextWord >= this.timeBetweenWords){
            if(this.displayed.length < this.text.length){
                this.timeToNextWord = 0;
                this.displayed += this.words[this.word++] + " ";
            } else {
                this.timeFadeout -= time;
            }
        } else {
            this.timeToNextWord += time;
        }

        if(this.timeFadeout <= 0){
            if(this.onTimeout !== undefined){
                this.onTimeout(this);
            }
        }
    }
}
