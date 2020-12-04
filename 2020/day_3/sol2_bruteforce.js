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

let totalTreeCount = 0;
for (let slope of slopes) {
	let treeCount = 0;
	for (
		let i = 0, horizontalPos = 0;
		i < input.length;
		i += slope.down, horizontalPos += slope.right
	) {
		let line = input[i];
		let pos = horizontalPos % line.length;
		if (line[pos] == tree) {
			treeCount += 1;
		}
	}
	if (totalTreeCount == 0) {
		totalTreeCount = treeCount;
	} else {
		totalTreeCount *= treeCount;
	}
}

console.log(`Counted ${totalTreeCount} trees with slopes`, slopes);
