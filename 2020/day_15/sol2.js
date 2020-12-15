#!/usr/bin/env node

let fs = require("fs");
let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		return v.split(",");
	})
	.flat()
	.map((v) => parseInt(v, 10));

console.log(`read in ${input.length} records...`);
console.log(input.slice(0, 10));

let result = input.slice(0, input.length - 1).reduce((r, v, i) => {
	r[v] = i + 1;
	return r;
}, {});
let n = 30_000_000;


let next = input[input.length - 1];
for (let i = input.length; i < n; i++) {
	if (i % 1_000_000 == 0) {
		console.log(i, next);
	}
	let idx = result[next];
	result[next] = i;
	if (idx != null) {
		next = i - idx;
	} else {
		next = 0;
	}
}
console.log(next)
