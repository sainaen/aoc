#!/usr/bin/env node

let fs = require("fs");
let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n\n")
	.filter((v) => v)
	.map((v) => {
		let lines = v.split('\n');
		let n = parseInt(lines.shift().match(/^Tile (\d+):$/)[1], 10);
		let tile = lines.map(l => l.split(''));
		let top = tile[0].join('');
		let bottom = tile[tile.length - 1].join('');
		let left = tile.map(r => r[0]).join('');
		let right = tile.map(r => r[r.length - 1]).join('');
		return {
			n,
			tile,
			borders: { top, bottom, left, right },
		}
	});

console.log(`read in ${input.length} records...`);
// console.log(input.slice(0, 10));


let corners = input.filter(t => {
	let borders = new Set(input.filter(ot => t.n != ot.n).reduce((r, t) => r.concat(Object.values(t.borders)), []))
	let count = 0;
	for (let border in t.borders) {
		if (borders.has(t.borders[border]) || borders.has(t.borders[border].split('').reverse().join(''))) {
			count += 1;
		}
	}
	return count == 2;
});
// console.log(corners)
let result = corners.map(t => t.n).reduce((r, n) => r*n);

console.log(`Result: ${result}`);
