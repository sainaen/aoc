#!/usr/bin/env node

let fs = require("fs");
let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		return v.split("").map(v => v.trim()).filter(v => v);
	});

console.log(`read in ${input.length} records...`);
console.log(input.slice(0, 10));

function findMatchingParen(inp, start) {
	let parenCount = 1;
	for (let i = start; i < inp.length; i++) {
		if (inp[i] == ')') {
			parenCount -= 1;
		} else if (inp[i] == '(') {
			parenCount += 1;
		}
		if (parenCount == 0) {
			return i;
		}
	}
	console.error(`Couldn't find matching paren in ${inp} starting at ${start}`)
}

function evalExp(inp, start, end) {
	let val = 0;
	pos = start;
	let op = (a,b) => parseInt(a, 10) + parseInt(b, 10);
	for (let pos = start; pos < end; pos++) {
		if (inp[pos] == '(') {
			let endPos = findMatchingParen(inp, pos + 1)
			val = op(val, evalExp(inp, pos + 1, endPos))
			pos = endPos;
			continue;
		}
		if (inp[pos] == '+') {
			op = (a,b) => parseInt(a,10) + parseInt(b,10);
			continue;
		}
		if (inp[pos] == '*') {
			op = (a,b) => parseInt(a,10) * parseInt(b,10);
			continue;
		}
		console.log(val, inp[pos]);
		console.log(op.toString())
		val = op(val, inp[pos]);
		console.log(val);
	}
	return val;
}

let result = input.map(exp => evalExp(exp, 0, exp.length)).reduce((a,b) => a+b);
console.log(`Result: ${result}`);
