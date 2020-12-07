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

function countInside(rules) {
	let count = 1;
	for (let r of rules) {
		console.log(r)
		if (r.num > 0 && input[r.type]) {
			count += (r.num * countInside(input[r.type]));
		}
	}
	return count;
}

let target = "shiny gold";
let result = countInside(input[target]);
console.log(result - 1);
