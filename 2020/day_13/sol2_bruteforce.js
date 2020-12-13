#!/usr/bin/env node

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		if (v.indexOf(",") >= 0) {
			return v.split(",").map((b) => (b == "x" ? b : parseInt(b, 10)));
		}
		return parseInt(v, 10);
	});

console.log(`read in ${input.length} records...`);
console.log(input.slice(0, 10));

let [, buses] = input;

let tmp = [...buses].map((b, i) => ({b,i})).filter(b => b.b != 'x')
tmp.sort((a,b) => a.b-b.b)
let rarestBus = tmp[tmp.length - 1]
console.log(rarestBus)

let result = 0;

outer: for (let i = 9_999_999_999; i < 896_915_841_102_983; i++) {
	if (i == 49_999_999_999) {
		console.error(`Out of loops!`);
	} 
	let tRarest = rarestBus.b*i
	let posRarest = rarestBus.i
	// console.log(tRarest, posRarest)

	for (let j = 1; posRarest - j >= 0; j++) {
		if (buses[posRarest - j] == 'x') {
			continue;
		}
		// console.log('-', j, (tRarest - j), buses[posRarest - j])
		if ((tRarest - j) % buses[posRarest - j] != 0) {
			continue outer;
		}
	}
	for (let j = 1; posRarest + j < buses.length; j++) {
		if (buses[posRarest + j] == 'x') {
			continue;
		}
		// console.log('+', j, (tRarest + j), buses[posRarest + j])
		if ((tRarest + j) % buses[posRarest + j] != 0) {
			continue outer;
		}
	}
	result = tRarest - posRarest;
	break;
}

console.log(`Result: ${result}`);
