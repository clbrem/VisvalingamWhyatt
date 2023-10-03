export class Vertex<T> {        
    readonly neighbors: [Vertex<T> | undefined, Vertex<T> | undefined ]        
    public readonly id: string = this.stringify();
    constructor(public readonly coordinates: [number, number], public readonly value: T) {                
        this.neighbors = [undefined, undefined];        
    }
    stringify(): string {
        return `(${this.coordinates[0]},${this.coordinates[1]})`
    }
    previous(neighbor?: Vertex<T>) {
        return neighbor ? this.neighbors[0] = neighbor : this.neighbors[0];
    }
    next(neighbor?: Vertex<T>) {
        return neighbor? this.neighbors[1] = neighbor : this.neighbors[1];
    }
    isMinimal(): boolean {
        return this.previous() && this.next() && this.previous()?.previous() === this.next() ? true : false;
    }
    trace(): Vertex<T>[] {        
        let out = [this as Vertex<T>]
        let id = this.id
        let curr = this.next()
        while (curr && curr?.id !== this.id ) {
            out.push(curr)
            curr = curr?.next()
        }
        return out
    }
    coefficient(): number 
    {
        if (this.isMinimal()) {return Infinity}
        let [xprev,yprev] = this.previous()?.coordinates || [0,0];
        let [xnext,ynext] = this.next()?.coordinates || [0,0];
        let [x,y] = this.coordinates;
        return Math.abs (xprev * y + x * ynext + xnext * yprev - xprev * ynext - x * yprev - xnext * y) / 2;
    }
    remove() {
        let previous = this.previous();
        let next = this.next();
        previous && previous.next(next);
        next && next.previous(previous);
    }

    static ofList = <T>(mapping: (item:T) => [number,number]) => (list: T[]) => {
        let first = list[0] && mapping(list[0])        
        let reduced = 
         list.reduce(
            (accumulator: {acc: Vertex<T> [], prev: Vertex<T> | undefined }, curr: T) => {
                let vertex = new Vertex(mapping(curr), curr)
                accumulator.prev && accumulator.prev.next(vertex);
                vertex.previous(accumulator.prev);
                return {
                    acc: [...accumulator.acc, vertex], prev: vertex
                }
            }, { acc: [],  prev: undefined}
            )        
        
        if (reduced.prev && reduced.prev.coordinates[0] === first[0] && reduced.prev.coordinates[1] === first[1]) {
            let prev = reduced.prev.previous()
            reduced.prev.remove()
            reduced = {
                acc: reduced.acc.slice(0, -1),
                prev
            }
        }
        // Handle first and last vertex        
        if (reduced.prev) {
            reduced.prev.next(reduced.acc[0]);
            reduced.acc[0].previous(reduced.prev);
        }

        return reduced.acc;
        }

} 

export class Point<T> {
    public readonly id: string = this.stringify();
    constructor (public readonly coordinates: [number,number], public readonly vertices: Vertex<T>[]){}
    
    private static Combine<T>(point: Point<T>| undefined, sndPoint: Point<T>) {
        return typeof point == 'undefined' 
               ? sndPoint                
               : point.stringify() === sndPoint.stringify() ? new Point(point.coordinates, [...point.vertices, ...sndPoint.vertices])
               : sndPoint;
    }

    neighbors(): Vertex<T> [] {
        return this.vertices.flatMap(vertex => [vertex.previous(), vertex.next()]).filter(vertex => typeof vertex !== 'undefined') as Vertex<T>[];
    }

    isMinimal(): boolean {
        return !!this.vertices.find(vertex => vertex.isMinimal()) ;
    }
    remove(): void { 
        this.vertices.forEach(vertex => vertex.remove());    
    }
    coefficient(): number {
        return this.vertices.map(vertex => vertex.coefficient()).reduce((a,b) => a + b, 0);
    }
    stringify() {
        let coords = this.coordinates; 
        return  `(${coords[0]},${coords[1]})`
    }
    
    static ofPolygon = <T>(map: Map<string, Point<T>>) => (vertices: Vertex<T>[]) => 
        vertices.reduce(
            (prev, curr: Vertex<T>) => {                
                let pt = curr.stringify()
                let newPoint = new Point(curr.coordinates, [curr])
                return prev.set(pt, Point.Combine(prev.get(pt), newPoint))                
            }, map
            )
    static ofPolygons = <T>(map: Map<string, Point<T>>) => (polygons: Vertex<T>[] []) => 
        polygons.reduce((prev, curr) => Point.ofPolygon<T>(prev)(curr), new Map<string,Point<T>>())

    
}

