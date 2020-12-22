#!/usr/bin/env node

let fs = require("fs");
let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n\n")
	.filter((v) => v)
	.map((v) => {
		let [player, ...cards] = v.split('\n').map(l => l.trim()).filter(l => l);
		cards.reverse();
		return cards.map(c => parseInt(c, 10));
	});

console.log(`read in ${input.length} records...`);
console.log(input);

let [p1, p2] = input;

let limit = 10_000;
for (let i = 0; i < limit && p1 && p2; i++) {
	if (i == limit - 1) {
		console.error(`Out of loops!`);
	}
	let p1c = p1.pop();
	let p2c = p2.pop();
	if (p1c > p2c) {
		p1.unshift(p1c);
		p1.unshift(p2c);
	} else if (p1c < p2c) {
		p2.unshift(p2c);
		p2.unshift(p1c);
	} else {
		console.error(`A draw on round ${i}? p1c=${p1c}, p2c=${p2c}`);
	}
	if (p1.length == 0) {
		p1 = null;
	}
	if (p2.length == 0) {
		p2 = null;
	}
}

let result = (p1 || p2).reduce((res, c, pos) => res + c * (pos + 1), 0);

console.log(`Result: ${result}`);
