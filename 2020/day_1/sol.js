#!/usr/bin/env node

/**
 * O(n*log(n)) solution for part 1 using sorting
 */

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => parseInt(v, 10));
console.log(`read in ${input.length} values...`);

input.sort((a,b) => a - b);

let target = 2020;
for (let i = 0, j = input.length - 1; i < j; ) {
	let lo = input[i];
	let hi = input[j];
	let sum = hi + lo;
	// console.log(`Observing ${lo} (@${i}) + ${hi} (@${j}) = ${sum}`)
	if (sum < target) {
		i += 1;
	} else if (sum > target) {
		j -= 1;
	} else {
		console.log(`Found ${lo} (@${i}) and ${hi} (@${j})`);
		console.log(`Product: ${lo * hi}`);
		break;
	}
}
