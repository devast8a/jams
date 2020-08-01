export class FullscreenText {
    public readonly message: string;
    public completed: (() => void) | undefined;
    public fadeIn = 500;
    public fadeOut = 500;
    public duration = 3000;

    private time = 0;

    public constructor(message: string){
        this.message = message;
    }

    public update(delta: number){
        this.time += delta;

        if(this.time >= this.fadeIn + this.duration + this.fadeOut){
            if(this.completed !== undefined){
                this.completed();
            }
        }
    }

    public display(ctx: CanvasRenderingContext2D){
        let alpha = 1;

        if(this.time < this.fadeIn){
            alpha = this.time / this.fadeIn;
        } else if(this.time >= this.fadeIn + this.duration){
            alpha = 1 - (this.time - this.fadeIn - this.duration) / this.fadeOut;
        }

        ctx.save();

        ctx.fillStyle = `rgba(0,0,0,${alpha * 0.5})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.font = '64 PixelFontRegular';

        const x = ctx.canvas.width/2 - ctx.measureText(this.message).width/2;
        const y = ctx.canvas.height/2;

        ctx.fillText(this.message, x, y);
        ctx.strokeText(this.message, x, y);

        ctx.restore();
    }
}