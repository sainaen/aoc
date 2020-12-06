#!/usr/bin/env node

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n\n")
	.filter((v) => v)
	.map((v) => v.split("\n"));

console.log(`read in ${input.length} records...`);
console.log(input.slice(0, 10));

let m = 0;
for (let g of input) {
	let s = {};
	for (let p of g) {
		for (let c of p.split('')) {
			s[c] = (s[c] || 0) + 1;
		}
	}
	m += Object.keys(s).filter(a => s[a] == g.length).length;
}

console.log(m)