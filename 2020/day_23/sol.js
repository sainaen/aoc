#!/usr/bin/env node

let fs = require("fs");
let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		return v.split('').map(c => parseInt(c, 10));
	})
	.flat();

console.log(`read in ${input.length} records...`);
console.log(input);

function cut(a, from, len=3) {
	if (from < a.length - len) {
		return a.splice(from, len);
	}
	let result = a.splice(from, len);
	if (result.length < len) {
		result.push(...a.splice(0, len - result.length));
	}
	return result;
}

function insert3(a, from, vals) {
	a.splice(from, 0, ...vals);
	return a;
}

let current = 0;
let moves = 100;
outer: for (let i = 0; i < moves; i++) {
	console.log('')
	console.log(`at ${i}: ${input.join(', ')}`)
	let currentLabel = input[current];
	console.log(`at ${i}: cur ${currentLabel} @${current}`)
	let nextLabel = currentLabel - 1;
	let selected = cut(input, current+1);
	console.log(`at ${i}: ${selected.join(', ')}`)
	let sorted = [...input].sort((a,b) => a-b);
	let min = sorted[0], max = sorted[sorted.length - 1];
	console.log(`at ${i}: ${min} - ${max}`)
	do {
		if (nextLabel < min) {
			nextLabel = max;
		}
		let next = input.indexOf(nextLabel);
		if (next > -1) {
			console.log(`at ${i}: nxt ${nextLabel} @${next}`)
			insert3(input, next+1, selected);
			current = (input.indexOf(currentLabel) + 1) % input.length;
			continue outer;
		}
		nextLabel -= 1;
	} while (true);
}

let startResult = input.indexOf(1);
let result = cut(input, startResult+1, input.length - 1);

console.log(`Result: ${result.join('')}`);
