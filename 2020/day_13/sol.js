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

let [earliestDepart, buses] = input;

let result = 0;

for (let i = 0; ; i++) {
	let bs = buses.filter((b) => (earliestDepart + i) % b == 0);
	if (bs.length > 0) {
		result = i * bs[0];
		break;
	}
}

console.log(`Result: ${result}`);
