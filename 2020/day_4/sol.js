#!/usr/bin/env node

let fs = require("fs");

let splitter = new RegExp("s+", "s");
let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n\n")
	.filter((v) => v)
	.map((v) =>
		v
			.split(/\s+/)
			.map((s) =>
				s.split("\n").map((f) => {
					let [n, v] = f.split(":");
					return { n, v };
				})
			)
			.flat()
			.reduce((r, { n, v }) => {
				r[n] = v;
				return r;
			}, {})
	);

console.log(`read in ${input.length} records...`);
console.log(input.slice(0, 10))

let mandatoryFields = new Set(["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]);

let optionalFields = new Set(["cid"]);

let count = 0;

outer: for (let p of input) {
	for (let f of mandatoryFields) {
		if (!(f in p)) {
			continue outer;
		}
	}
	count += 1
}

console.log(count)
