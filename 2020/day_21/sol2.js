#!/usr/bin/env node

let fs = require("fs");
let r = /^(?:(\w+) )+\(contains (?:(\w+))\)$/;
let input = fs
	.readFileSync("./input", "utf-8")
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

let limit = 100_000;
for (let i = 0; i < limit; i++) {
	if (i == limit - 1) {
		console.error(`Out of loops!`);
	}
	let changed = false;
	for (let all in alls) {
		let allIngs = alls[all];
		if (allIngs.size != 1) {
			continue;
		}
		let [ing] = allIngs.values();
		for (let oAll in alls) {
			if (oAll == all) {
				continue;
			}
			changed |= alls[oAll].delete(ing);
		}
	}
	if (!changed) {
		console.log(`Mapping has not changed on iteration ${i}`);
		break;
	}
}

let result = Object.entries(alls)
	.sort(([all1], [all2]) => {
		// console.log(all1, all2);
		return all1.localeCompare(all2);
	})
	.map(([_, ing]) => [...ing.values()])
	.flat()
	.join(",");
console.log(`Result: ${result}`);
