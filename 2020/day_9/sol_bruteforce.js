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

let preamble = 25;
let result = 0;

let validOptions = input.slice(0, preamble);
outer: for (let i = preamble; i < input.length; i++) {
	let found = false;
	search: for (let j = 0; j < preamble - 1 ; j++) {
		for (let k = j + 1; k < preamble ; k++) {
			if ((validOptions[j] + validOptions[k]) == input[i]) {
				found = true;
				break search;
			}
		}
	}
	if (!found) {
		result = input[i]
		break;
	}
	validOptions.shift()
	validOptions.push(input[i])
}

console.log(`Result: ${result}`);
