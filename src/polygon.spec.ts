import { Vertex, Point } from "./polygon";
import { MinPriorityQueue, IGetCompareValue } from "@datastructures-js/priority-queue";
import { PolygonQueue } from "./polygon-queue";
test("Inf", () => {expect(Infinity).toBeGreaterThan(1)});

test ("Polygon operations", () => {
    let myEmptyList = Vertex.ofList(([a,b]: [number,number]) => [a,b]) ([])
    expect(myEmptyList).toEqual([])

    let myTriangle = Vertex.ofList(([a,b]: [number,number]) => [a,b]) ([[0,0],[0,1],[1,1]] )
    expect(myTriangle.length).toEqual(3)
    expect(myTriangle.every(vertex => vertex.isMinimal())).toBe(true)
    let mySquare = Vertex.ofList(([a,b]: [number,number]) => [a,b]) ([[0,0],[0,1],[1,1], [1,0], [0,0]] )
    expect(mySquare.length).toEqual(4)
    expect (mySquare.every(vertex => !vertex.isMinimal())).toBe(true)
    expect (mySquare.map(v => v.coefficient())).toEqual([0.5,0.5,0.5,0.5])
    mySquare[0].remove();
    expect(mySquare.slice(1).every(vertex => vertex.isMinimal())).toBe(true)    
})

test("Multigon Operations", () => {
    let mySquare = Vertex.ofList(([a,b]: [number,number]) => [a,b]) ([[0,0],[1,0],[1,1], [0,1]] )
    let friendSquare = Vertex.ofList(([a,b]: [number,number]) => [a,b]) ([[1,0],[2,0],[2,1], [1,1]] )
    let myMultigon = [mySquare, friendSquare]
    let points = Point.ofPolygons<[number,number]>(new Map())(myMultigon)
    expect([...points.values()].length).toEqual(6)

})

test("MapTests", () => {
    let mySquare = Vertex.ofList(([a,b]: [number,number]) => [a,b]) ([[0,0],[1,0],[1,1], [0,1]] )
    let friendSquare = Vertex.ofList(([a,b]: [number,number]) => [a,b]) ([[1,0],[2,0],[2,1], [1,1]] )
    let myMultigon = [mySquare, friendSquare]
    let pointMap = Point.ofPolygons<[number,number]>(new Map())(myMultigon)
    let myQueue = MinPriorityQueue.fromArray<Point<[number,number]>>([...pointMap.values()], p => p.coefficient())

    let first = myQueue.dequeue()

    first.remove()

})

test("QueueTests", () => {
    let myPolys: [number,number][][] = [[[0,0],[1,0],[1,1], [0,1]],[[1,0],[2,0],[2,1], [1,1]]]
    let myQueue = PolygonQueue.fromPolygons(myPolys)
    myQueue.dequeue()
    myQueue.dequeue()
    let unraveled = myQueue.unravel()
    console.log(unraveled)

})
