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

let [cardPub, doorPub] = input;

function transformStep(s, n) {
	return (s * n) % 20201227;
}

function findLoops(pub) {
	let val = 1;
	let limit = 10_000_000;
	for (let i = 0; i < limit; i++) {
		if (i == limit - 1) {
			console.error(`Out of loops!`);
		}
		val = transformStep(7, val);
		if (val == pub) {
			return i + 1;
		}
	}
	return -1;
}

function transform(s, n, loops) {
	let val = n;
	for (let i = 0; i < loops - 1; i++) {
		val = transformStep(s, val);
	}
	return val;
}

let result = transform(cardPub, cardPub, findLoops(doorPub));

console.log(`Result: ${result}`);
