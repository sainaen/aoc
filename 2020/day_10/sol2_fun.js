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

input.sort((a, b) => a - b);
input = input.slice(0, 60)
input.unshift(0);

async function countPaths(pos) {
	if (pos == input.length - 1) {
		return 1;
	}
	let promises = [];
	for (let i = pos + 1; i < input.length; i++) {
		if (input[i] - input[pos] <= 3) {
			promises.push(countPaths(i));
		}
	}
	return (await Promise.all(promises)).reduce((a,b) => a+b);
}

(async function () {
	console.log(`Result: ${await countPaths(0)}`);
})();

