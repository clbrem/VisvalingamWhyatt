export class Vertex {        
    readonly neighbors: [Vertex | undefined, Vertex | undefined ]    
    public removed: boolean;
    constructor(public readonly coordinates: [number, number]) {        
        this.neighbors = [undefined, undefined];
        this.removed = false;
    }
    previous(neighbor?: Vertex) {
        return neighbor ? this.neighbors[0] = neighbor : this.neighbors[0];
    }
    next(neighbor?: Vertex) {
        return neighbor? this.neighbors[1] = neighbor : this.neighbors[1];
    }
    remove() {
        let previous = this.previous();
        let next = this.next();
        previous && previous.next(next);
        next && next.previous(previous);
        this.removed = true;
    }

} 
