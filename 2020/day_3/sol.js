#!/usr/bin/env node

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => v.split(""));

console.log(`read in ${input.length} lines...`);

let tree = "#";
let empty = ".";

let slope = { right: 3, down: 1 };

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

console.log(`Counted ${treeCount} trees with a slope`, slope);
