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

let [_, buses] = input;

function check(bs, t) {
	return bs.filter((b,i) => b == 'x' || (t + i) % b == 0).length == bs.length;
}

let limit = 1_000_000_000;
let t = buses[0];
let step = buses[0];
let iters = 0;
for (let i = 1; i < buses.length; i++) {
	let b = buses[i];
	if (b == 'x') {
		continue;
	}
	for(let j = 1; j < limit; j++) {
		iters += 1;
		if (j == limit -1) {
			console.log(`Out of loops!`)
		}
		if (check(buses.slice(0, i + 1), t + step*j)) {
			t = t + step*j
			step *= b;
			break;
		}
	}
}
console.log(`Result: ${t} (in ${iters} steps)`)