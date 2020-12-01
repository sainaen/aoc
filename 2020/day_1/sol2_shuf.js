#!/usr/bin/env node

/**
 * O(?) solution for part 2 using shuffle
 */


let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => parseInt(v, 10));
console.log(`read in ${input.length} values...`);

let sortCmp = (a, b) => a - b;

while (true) {
	for (let i = input.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i);
		const temp = input[i];
		input[i] = input[j];
		input[j] = temp;
	}
	let target = 2020;
	if (input[0] + input[1] + input[2] == target) {
		console.log(`Found ${input[0]} and ${input[1]}`);
		console.log(`Product: ${input[0] * input[1] * input[2]}`);
		break;
	}
}
