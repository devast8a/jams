export interface Assets {
    [name: string]: HTMLImageElement;
}

interface TmxTileSet {
    first: number;
    width: number;
    count: number;
    image: HTMLImageElement;
}

export class TmxEngine {
    private readonly sets = new Array<TmxTileSet>();
    private readonly chunks = new Map<number, Map<number, Array<Array<number>>>>();

    public parseFromString(str: string, assets: Assets){
        const parser = new DOMParser();
        const dom = parser.parseFromString(str, 'text/xml');

        // Decode sets
        for(const setElement of dom.querySelectorAll('tileset')){
            const imageElement = setElement.querySelector('image')!;

            this.sets.push({
                first: Number.parseInt(setElement.getAttribute('firstgid')!),
                width: Number.parseInt(setElement.getAttribute('columns')!),
                count: Number.parseInt(setElement.getAttribute('tilecount')!),
                image: assets[imageElement.getAttribute('source')!],
            });
        }
        this.sets.sort((a, b) => b.first - a.first);

        // Decode chunks
        for(const layer of dom.querySelectorAll('layer')){
            for(const chunk of layer.querySelectorAll('chunk')){
                const x = Number.parseInt(chunk.getAttribute('x')!);
                const y = Number.parseInt(chunk.getAttribute('y')!);

                const data = chunk.childNodes[0].textContent!.replace(/\n/g,'').split(',').map((x) => parseInt(x));

                this.setChunkData(x, y).push(data);
            }
        }
    }

    public setChunkData(x: number, y: number){
        let xc = this.chunks.get(x);
        if(xc === undefined){
            xc = new Map<number, Array<Array<number>>>();
            this.chunks.set(x, xc);
        }
        let yc = xc.get(y);
        if(yc === undefined){
            yc = new Array<Array<number>>();
            xc.set(y, yc);
        }
        return yc;
    }

    public queryTileXY(x: number, y: number){
        let xc = this.chunks.get(Math.floor(x / 16) * 16);
        if(xc === undefined){ return undefined; }
        let yc = xc.get(Math.floor(y / 16) * 16);
        if(yc === undefined){ return undefined; }
        x = x < 0 ? 16 + (x % 16) : x % 16;
        y = y < 0 ? 16 + (y % 16) : y % 16;

        const tiles = [];
        for(let i = 0; i < yc.length; i++){
            const tile = yc[i][y * 16 + x];
            if(tile !== 0){
                tiles.push(tile);
            }
        }

        return tiles.length > 0 ? tiles : undefined;
    }

    public draw(
        left: number,
        top: number,
        staticTiles: CanvasRenderingContext2D,
        waterTiles: CanvasRenderingContext2D,
    ){
        const scale = 2;
        const width = staticTiles.canvas.width / scale;
        const height = staticTiles.canvas.height / scale;

        for(let x = left; x < width; x += 16){
            const chunks_x = this.chunks.get(x);

            if(chunks_x === undefined){
                continue;
            }

            for(let y = top; y < height; y += 16){
                const chunks_y = chunks_x.get(y);

                if(chunks_y === undefined){
                    continue;
                }

                // Render the chunks
                for(const chunk of chunks_y){
                    // Render tiles
                    for(let i = 0; i < chunk.length; i++){
                        const tile = chunk[i];
                        
                        // What image do we render
                        if(tile === 0){
                            continue;
                        }

                        // Water
                        if(tile === 14){
                            // Draw to water texture
                            const cx = i % 16;
                            const cy = Math.floor(i / 16);
                            waterTiles.drawImage(this.sets[1].image, 5 * 16, 1 * 16, 16, 16, (cx + x - left) * 32, (cy + y - top) * 32, 32, 32);
                            continue;
                        }

                        for(const set of this.sets){
                            if(set.first <= tile){
                                const t = tile - set.first;
                                const cx = i % 16;
                                const cy = Math.floor(i / 16);
                                const tx = t % set.width;
                                const ty = Math.floor(t / set.width);

                                staticTiles.drawImage(set.image, tx * 16, ty * 16, 16, 16, (cx + x - left) * 32, (cy + y - top) * 32, 32, 32);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}