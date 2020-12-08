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

let fixes = input.map((c, i) => ({op: c.op, i})).filter(c => c.op != 'acc')

let result = 0;
outer: for (let fix of fixes) {
	let fixed_input = [...input];
	fixed_input[fix.i] = {
		op: fix.op == 'nop' ? 'jmp' : 'nop',
		arg: input[fix.i].arg
	};
	let pc = 0;
	let visited = fixed_input.map(v => false);
	let r1 = 0;
	while (pc < fixed_input.length) {
		if (visited[pc]) {
			continue outer;
		}
		visited[pc] = true;
		let {op, arg} = fixed_input[pc];
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
	result = r1;
	break;
}

console.log(`Result: ${result}`);