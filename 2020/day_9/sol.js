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

let validSums = [];
for (let i = 0; i < preamble - 1; i++) {
	let v1 = input[i];
	validSums[i] = [];
	for (let j = i + 1; j < preamble; j++) {
		let v2 = input[j];
		validSums[i].push(v1 + v2);
	}
}
for (let i = preamble; i < input.length; i++) {
	let v = input[i];
	if (!new Set(validSums.flat()).has(v)) {
		result = v;
		break;
	}

	for (let j = 1; j < preamble; j++) {
		let v1 = input[i - preamble + j];
		validSums[j] = validSums[j] || [];
		validSums[j].push(v1 + v);
	}
	validSums.shift();
}

console.log(`Result: ${result}`);
