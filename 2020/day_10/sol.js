#!/usr/bin/env node

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		return parseInt(v, 10);
	});

console.log(`read in ${input.length} records...`);
console.log(input.slice(0, 10));

let result = [0, 0];

input.sort((a,b) => a-b)

let prevAdapter = 0;
for (let adapter of input) {
	if (adapter - 3 > prevAdapter) {
		console.error(`Cannot find adapter to continue the chain, prev=${prevAdapter}, next=${adapter}`)
		break;
	}
	let diff = adapter - prevAdapter;
	if (diff == 1) {
		result[0] += 1
	} else if (diff == 3) {
		result[1] += 1
	}
	prevAdapter = adapter
}
// internal
result[1] += 1

console.log(`Result: ${result[0] * result[1]}`);
