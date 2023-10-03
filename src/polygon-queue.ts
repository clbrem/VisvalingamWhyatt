import {MinPriorityQueue}  from '@datastructures-js/priority-queue'
import { Point, Vertex } from './polygon';

export class QueueError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "QueueError"
    }
}

export class PolygonQueue<T>{    
    private _size: number
    private constructor(
        private readonly queue: MinPriorityQueue<Point<T>>
        ){
            this._size = queue.size()
        }
    get size() {
        return this._size
    }
    static fromPolygons(poly:[number,number] [] []): PolygonQueue<[number,number]> {
        let identity = <A>(a: A) => a
        let lookup = 
            Point.ofPolygons<[number,number]>(new Map()) (
                poly.map(
                    Vertex.ofList (identity)
                    )
                )
        let queue = MinPriorityQueue.fromArray<Point<[number,number]>>( 
            [...lookup.values()], b => b.coefficient()
            )
        return new PolygonQueue(queue)
    }
    dequeue()  {
        let pt = this.queue.dequeue()        
        if (pt.isMinimal()){
            throw new QueueError("Cannot remove any more points")
        }
        let nbs = pt.neighbors()
        let nbIds = nbs.map(nb => nb.id)
        let pts = this.queue.remove(v => nbIds.includes(v.id))
        pt.remove()
        pts.forEach(nb => this.queue.enqueue(nb))
        this._size -= 1
        return pt.coordinates
    }
    enqueue(pt: Point<T>) {
        this.queue.enqueue(pt)
        this._size += 1
        return this
    }
    unravel() {
        let polys: T[][] = []
        while (this.queue.size() > 0) {
            let pt = this.queue.dequeue()
            let items = 
                pt.vertices.map(
                    v => v.trace()
                )
            items.forEach(p => polys.push(p.map(v => v.value)))
            let ids = items.flatMap(p => p.map(v => v.id))
            this.queue.remove(v => ids.includes(v.id))
        }
        return polys;
        
    }
    
}





