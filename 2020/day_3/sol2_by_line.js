#!/usr/bin/env node

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v);

console.log(`read in ${input.length} lines...`);

let tree = "#";
let empty = ".";

let slopes = [
	{ right: 1, down: 1 },
	{ right: 3, down: 1 },
	{ right: 5, down: 1 },
	{ right: 7, down: 1 },
	{ right: 1, down: 2 },
];

let slopeStates = slopes.map((s) => ({
	stepsDown: s.down,
	hPos: 0,
	treeCount: 0,
}));
for (let i = 0; i < input.length; i++) {
	let line = input[i];
	for (let j = 0; j < slopes.length; j++) {
		let state = slopeStates[j];
		if (state.stepsDown == 0) {
			let slope = slopes[j];
			state.stepsDown = slope.down;
			state.hPos += slope.right;
			let pos = state.hPos % line.length;
			if (line[pos] == tree) {
				state.treeCount += 1;
			}
		}
		state.stepsDown -= 1;
	}
}

console.log(slopeStates)
let totalTreeCount = slopeStates.reduce((mul, s) => mul * s.treeCount, 1);
console.log(`Counted ${totalTreeCount} trees with slopes`, slopes);
