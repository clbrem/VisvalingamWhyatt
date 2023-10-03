
import { MinPriorityQueue, IGetCompareValue } from "@datastructures-js/priority-queue";
import { PolygonQueue } from "./polygon-queue";


test("QueueTests", () => {
    let myPolys: [number,number][][] = [[[0,0],[1,0],[1,1], [0,1]],[[1,0],[2,0],[2,1], [1,1]]]
    let myQueue = PolygonQueue.fromPolygons(a => a, myPolys)
    myQueue.dequeue()
    myQueue.dequeue()
    let unraveled = myQueue.unravel()
    console.log(unraveled)
})
