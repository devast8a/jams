export class Timer {
    private handle: number;
    private callback: () => void;
    timeout: number;

    public constructor(timeout: number, callback: () => void){
        this.timeout = timeout;
        this.callback = callback;
        this.handle = setTimeout(this.callback, this.timeout);
    }

    public reset() {
        clearTimeout(this.handle);
        this.handle = setTimeout(this.callback, this.timeout);
    }

    public cancel(){
        clearTimeout(this.handle);
    }
}

export class InputHandler {
    public returnCurrent = false;
    protected queue = new Array<string>();

    public current = '';

    public enabled = false;
    public queueEnable = false;

    private timer: Timer | undefined;
    private promiseResolve: ((value: string | undefined) => void) | undefined = undefined;

    public onKeyDown(event: KeyboardEvent){
        if(!this.enabled){
            return;
        }

        if(this.timer !== undefined){
            this.timer.reset();
        }
        this.returnCurrent = false;

        switch(event.keyCode){
            case 8:
                this.current = this.current.slice(0, -1);
                break;

            case 13:
                if(this.promiseResolve){
                    this.resolve(this.current);
                } else if (this.queueEnable) {
                    this.queue.push(this.current);
                    this.current = '';
                } else {
                    this.returnCurrent = true;
                }
                break;

            case 9:
            case 16:
            case 17:
            case 18:
            case 27:
                break;

            default: {
                if(event.key.length === 1){
                    this.current += event.key.toLocaleLowerCase();
                }
                break;
            }
        }
    }

    private resolve(value: string | undefined){
        if(this.promiseResolve !== undefined){
            this.promiseResolve(value);
            this.promiseResolve = undefined;
        }

        if(this.timer !== undefined){
            this.timer.cancel();
            this.timer = undefined;
        }

        this.current = '';
    }

    public getInput(timeout: number = 2000){
        this.enabled = true;

        if(this.returnCurrent){
            const result = this.current;
            this.current = '';
            this.returnCurrent = false;
            return Promise.resolve(result);
        }

        if(this.queue.length > 0){
            return Promise.resolve(this.queue.pop()!);
        }

        this.timer = new Timer(timeout, () => this.resolve(undefined));
        return new Promise<string | undefined>((resolve) => {
            this.promiseResolve = resolve;
        });
    }

    public disable() {
        this.enabled = false;
        this.current = '';
    }
}
