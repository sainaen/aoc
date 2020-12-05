#!/usr/bin/env node

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => v.split(""));

console.log(`read in ${input.length} records...`);
console.log(input.slice(0, 10));

let result = input
	.map((c) => {
		let row = 0;
		for (let b of c.slice(0, 7)) {
			row = row << 1;
			if (b == "B") {
				row += 1;
			}
		}
		let col = 0;
		for (let b of c.slice(7)) {
			col = col << 1;
			if (b == "R") {
				col += 1;
			}
		}
		console.log(c.join(""), row, col);
		return (row * 8) + col;
	})
	.reduce((a, b) => Math.max(a, b));

console.log(result);
