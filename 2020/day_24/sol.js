#!/usr/bin/env node

let fs = require("fs");
let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		let res = [];
		for (let i = 0; i < v.length; i++) {
			if (v[i] == "e" || v[i] == "w") {
				res.push(v[i]);
			} else {
				res.push(v.substring(i, i + 2));
				i += 1;
			}
		}
		return res;
	});

console.log(`read in ${input.length} records...`);
console.log(input.slice(0, 10));

let tiles = {};
for (let tilePath of input) {
	let x = 0,
		y = 0;
	for (let step of tilePath) {
		if (step == "e") {
			y += 2;
		} else if (step == "w") {
			y -= 2;
		} else if (step == "se") {
			x -= 1;
			y += 1;
		} else if (step == "sw") {
			x -= 1;
			y -= 1;
		} else if (step == "ne") {
			x += 1;
			y += 1;
		} else if (step == "nw") {
			x += 1;
			y -= 1;
		}
	}
	tiles[x] = tiles[x] || {};
	tiles[x][y] = !tiles[x][y];
}

// console.log(tiles);
let result = Object.values(tiles)
	.map((row) => Object.values(row))
	.flat()
	.filter((v) => v).length;

console.log(`Result: ${result}`);
