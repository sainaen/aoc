#!/usr/bin/env node

let fs = require("fs");
let r = /^(?:(\w+) )+\(contains (?:(\w+))\)$/;
let input = fs
	.readFileSync("./sinput", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		let [ings, alls] = v.split("(contains");
		return {
			ings: ings.split(" ").filter((i) => i),
			alls: alls
				.split(" ")
				.map((a) => a.trim().replace(",", "").replace(")", ""))
				.filter((a) => a),
		};
	});

console.log(`read in ${input.length} records...`);
console.log(input.slice(0, 10));

// let ings = new Set(input.map(f => f.ings).flat());

function setIntersect(s1, s2) {
	let result = new Set();
	for (let el of s1.values()) {
		if (s2.has(el)) {
			result.add(el);
		}
	}
	return result;
}

let alls = input.reduce((r, f) => {
	ings = new Set(f.ings);
	for (let all of f.alls) {
		if (!(all in r)) {
			r[all] = ings;
			continue;
		}
		r[all] = setIntersect(r[all], ings);
	}
	return r;
}, {});

let ingsWithAlls = new Set(
	Object.values(alls)
		.map((s) => [...s.values()])
		.flat()
);

let result = input
	.map((f) => f.ings)
	.flat()
	.filter((ing) => !ingsWithAlls.has(ing)).length;

console.log(`Result: ${result}`);
