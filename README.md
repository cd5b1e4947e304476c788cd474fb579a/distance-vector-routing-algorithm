# distance-vector-routing-algorithm

A simple NodeJS implementation of the [Distance-vector routing protocol](https://en.wikipedia.org/wiki/Distance-vector_routing_protocol "Distance-vector routing protocol") which uses the [Bellman-Ford](https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm "Bellman-Ford") algorithm.

### Required dependencies

`npm i cli-table` and `npm i colors`

### Graph input file

Create any file with extension **.bf** and enter graph data accordingly.

(Example pulled from provided Wikipedia article)

[![Graph](https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Networkabcd.svg/300px-Networkabcd.svg.png "Graph")](https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Networkabcd.svg/300px-Networkabcd.svg.png "Graph")

Given graph would be translated as such into **filename.bf**:
```js
1-3 2-23
0-3 2-2
0-23 1-2 3-5
2-5
```

The graph file format for a graph with N vertices is:
```html
A's edges
B's edges
...
N's edges
```
with each edge being defined as TO-COST.
Edge from A (0) to C (2) with cost of 23 would be in line 1 (0) as `2-23`

##  Output

The program will output each step, from the initialization of each vertices table, to the last iteration step where data is being propagated and newer, shorter values are being found.

## Notice

- This program was made to simulate/solve the process for graphs that will correctly terminate after a finite amount of steps and was not made to be robust for other cases.
- Keep in mind that some places (such as the Wikipedia article) have inverted tables compared to this programs output. (to/via <-> via/to)

## How to run

**`node bford filename`**
