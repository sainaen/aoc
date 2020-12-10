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

input.sort((a,b) => a-b)

input.push(input[input.length - 1] + 3)

let result = input.map(v => 0);
for (let i = 0; i < input.length && input[i] <= 3; i++) {
	result[i] = 1;
}

let prevAdapter = 0;
for (let i = 0; i < input.length; i++) {
	for (let j = i + 1; j < input.length; j++) {
		if ((input[j] - input[i]) <= 3) {
			result[j] += result[i]
		} else {
			break;
		}
	}
	// console.log(result);
}

console.log(`Result: ${result[result.length - 1]}`);