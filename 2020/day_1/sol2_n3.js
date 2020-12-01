#!/usr/bin/env node

/**
 * O(n^3) solution for part 2
 */

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => parseInt(v, 10));
console.log(`read in ${input.length} values...`);

let sortCmp = (a, b) => a - b;

input.sort(sortCmp);

let target = 2020;
outer: for (let i = 0; i < input.length - 2; i++) {
	let lo = input[i];
	for (let j = i + 1; j < input.length - 1; j++) {
		let mi = input[j];
		for (let k = j + 1; k < input.length; k++) {
			let hi = input[k];
			if (hi + mi + lo == target) {
				console.log(
					`Found ${lo} (@${i}), ${mi} (@${k}) and ${hi} (@${j})`
				);
				console.log(`Product: ${lo * mi * hi}`);
			}
		}
	}
}
