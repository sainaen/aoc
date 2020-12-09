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

let lookingFor = 1398413738;
let result = 0;

outer: for (let i = 0; i < input.length - 1; i++) {
	let sum = input[i];
	for (let j = i + 1; j < input.length ; j ++) {
		sum += input[j]
		if (sum == lookingFor) {
			let seq = input.slice(i, j+1)
			seq.sort((a,b) => a - b)
			result = seq[0] + seq[seq.length - 1]
			break outer;
		}
	}
}

console.log(`Result: ${result}`);
