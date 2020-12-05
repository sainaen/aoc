#!/usr/bin/env node

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v);

console.log(`read in ${input.length} records...`);
console.log(input.slice(0, 10));

let ids = input.map((c) =>
	parseInt(c.replace(/B|R/g, "1").replace(/F|L/g, "0"), 2)
);

let takenIds = new Set(ids);

for (let i = 1; i < 1023; i++) {
	if (!takenIds.has(i) && takenIds.has(i - 1) && takenIds.has(i + 1)) {
		console.log(i);
	}
}
