#!/usr/bin/env node

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v);

console.log(`read in ${input.length} records...`);
console.log(input.slice(0, 10));

let result = input
	.map((c) => {
		return parseInt(c.replace(/B|R/g, "1").replace(/F|L/g, "0"), 2);
	})
	.reduce((a, b) => Math.max(a, b));

console.log(result);
