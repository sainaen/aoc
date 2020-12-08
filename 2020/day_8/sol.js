#!/usr/bin/env node

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		let [op, arg] = v.split(" ");
		return {op, arg: parseInt(arg, 10)}
	});

console.log(`read in ${input.length} records...`);
console.log(input.slice(0, 10));

let pc = 0;
let visited = input.map(v => false);
let r1 = 0;
while (pc < input.length) {
	if (visited[pc]) {
		console.log(`Result: ${r1}`);
		break;
	}
	visited[pc] = true;
	let {op, arg} = input[pc];
	if (op == 'nop') {
		// do nothing
		pc += 1;
	} else if (op == 'acc') {
		r1 += arg;
		pc += 1;
	} else if (op == 'jmp') {
		pc += arg;
	}
}