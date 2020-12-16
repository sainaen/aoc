#!/usr/bin/env node

let fs = require("fs");
let ruleR = /^([^:]+):\s+(\d+)-(\d+) or (\d+)-(\d+)$/
let [rules, myTicket, otherTickets] = fs
	.readFileSync("./input", "utf-8")
	.split("\n\n")
	.filter((v) => v)
	.map((v, i) => {
		if (i == 0) {
			// rules
			return v.split('\n').filter((v) => v).map(r => {
				let match = r.match(ruleR);
				if (!match) {
					console.log(`Something is wrong with the rule: ${r}`);
					throw "error"
				}
				let [_, name, r1_low, r1_high, r2_low, r2_high] = match
				return {name, r1: [parseInt(r1_low, 10), parseInt(r1_high, 10)], r2: [parseInt(r2_low, 10), parseInt(r2_high, 10)]};
			})
		}
		if (i == 1) {
			// my ticket
			return v.split('\n')[1].split(',').map(n => parseInt(n, 10));
		}
		if (i == 2) {
			return v.split('\n').filter((v) => v).slice(1).map(t => t.split(',').map(n => parseInt(n, 10)));
		}
	});

console.log(`read in ${otherTickets.length} records...`);
console.log(rules, myTicket, otherTickets.slice(0, 10));

let result = 0;

outer: for (let otherTicket of otherTickets) {
	for (let field of otherTicket) {
		let isValid = rules.reduce((res, r) => {
			return res || (r.r1[0] <= field && field <= r.r1[1]) || (r.r2[0] <= field && field <= r.r2[1])
		}, false);
		if (!isValid) {
			result += field;
		}
	}
}
console.log(result)
