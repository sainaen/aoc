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

function evalMulLHS(inp, start, end) {
	let val = 0;
	for (let pos = start; pos < end; pos++) {
		if (inp[pos] == '*') {
			return [val, pos];
		}
		if (inp[pos] == '(') {
			let endPos = findMatchingParen(inp, pos + 1);
			let [subVal, _] = evalExp(inp, pos + 1, endPos);
			val += subVal;
			pos = endPos;
			continue;
		}
		if (inp[pos] == '+') {
			continue;
		}
		let [subVal,_] = evalExp(inp, pos, pos + 1)
		val += subVal;
	}
	return [val, end + 1];
}

function evalExp(inp, start, end) {
	// console.log(`eval: ${inp.slice(start, end)}`)
	if (end - start == 1) {
		return [parseInt(inp[start], 10), end];
	}
	let [lhs, lhsEnd] = evalMulLHS(inp, start, end);
	let pos = lhsEnd;
	let result = lhs;
	while (pos < end && inp[pos] == '*') {
		let [subVal, subEnd] = evalExp(inp, pos + 1, end)
		result *= subVal;
		pos = subEnd;
	}
	return [result, pos];
}

let result = input.map(exp => evalExp(exp, 0, exp.length)[0]).reduce((a,b) => a+b);
console.log(`Result: ${result}`);
