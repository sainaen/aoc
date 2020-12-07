#!/usr/bin/env node

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		let [type, rule] = v.split("bags contain").map((s) => s.trim());
		if (rule.indexOf("no other bags") > -1) {
			return { type };
		}
		let rules = rule.split(",").map((r) => {
			console.log(r);
			let [_, num, t] = r.trim().match(/^(\d+) (\w+ \w+) bags?/);
			return { type: t, num: parseInt(num, 10) };
		});
		return { type, rules };
	})
	.reduce((res, v) => {
		res[v.type] = v.rules || [];
		return res;
	}, {});

console.log(input);

let target = "shiny gold";

function check(type, rules) {
	console.log(type, rules);
	let count = 0;
	if (type == target) {
		return 1;
	}
	for (let r of rules) {
		console.log(r);
		if (r.num > 0 && input[r.type]) {
			count += check(r.type, input[r.type]);
		}
	}
	console.log(count);
	return count;
}

let result = 0;
for (let type in input) {
	let type_count = check(type, input[type]);
	if (type_count > 0) {
		result += 1
	}
}
console.log(result - 1);
