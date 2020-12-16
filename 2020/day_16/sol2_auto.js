#!/usr/bin/env node

let fs = require("fs");
let ruleR = /^([^:]+):\s+(\d+)-(\d+) or (\d+)-(\d+)$/;
let [rules, myTicket, otherTickets] = fs
	.readFileSync("./input", "utf-8")
	.split("\n\n")
	.filter((v) => v)
	.map((v, i) => {
		if (i == 0) {
			// rules
			return v
				.split("\n")
				.filter((v) => v)
				.map((r) => {
					let match = r.match(ruleR);
					if (!match) {
						console.log(`Something is wrong with the rule: ${r}`);
						throw "error";
					}
					let [_, name, r1_low, r1_high, r2_low, r2_high] = match;
					return {
						name,
						r1: [parseInt(r1_low, 10), parseInt(r1_high, 10)],
						r2: [parseInt(r2_low, 10), parseInt(r2_high, 10)],
					};
				});
		}
		if (i == 1) {
			// my ticket
			return v
				.split("\n")[1]
				.split(",")
				.map((n) => parseInt(n, 10));
		}
		if (i == 2) {
			return v
				.split("\n")
				.filter((v) => v)
				.slice(1)
				.map((t) => t.split(",").map((n) => parseInt(n, 10)));
		}
	});

console.log(`read in ${otherTickets.length} records...`);
console.log(rules, myTicket, otherTickets.slice(0, 10));

let validOtherTickets = [];
outer: for (let otherTicket of otherTickets) {
	for (let field of otherTicket) {
		let isValid = rules.reduce((res, r) => {
			return (
				res ||
				(r.r1[0] <= field && field <= r.r1[1]) ||
				(r.r2[0] <= field && field <= r.r2[1])
			);
		}, false);
		if (!isValid) {
			continue outer;
		}
	}
	validOtherTickets.push(otherTicket);
}

let fields = [];
for (let i = 0; i < validOtherTickets[0].length; i++) {
	fields[i] = [];
	for (let ticket of validOtherTickets) {
		fields[i].push(ticket[i]);
	}
}
let rulesByFields = [];
for (let j = 0; j < fields.length; j++) {
	console.log(j, fields[j]);
	let matchingRules = rules.filter((r) => {
		return (
			fields[j].length ===
			fields[j].filter(
				(field) =>
					(r.r1[0] <= field && field <= r.r1[1]) ||
					(r.r2[0] <= field && field <= r.r2[1])
			).length
		);
	});
	if (matchingRules.length != 1) {
		console.error(`Field ${j} matched more than one rule!`);
		console.error(matchingRules);
	}
	rulesByFields.push(matchingRules);
}

let knownPoses = {};
let limit = 10_000;
for (let i = 0; i < limit; i++) {
	if (i == limit - 1) {
		console.error(`Out of loops!`);
		console.error(knownPoses);
	}
	let shouldContinue = false;
	let discoveredRules = rulesByFields
		.map((posRules, pos) => {
			return posRules.filter((rule) => {
				return (
					knownPoses[rule.name] == null ||
					knownPoses[rule.name] == pos
				);
			});
		})
		.map((posRules, pos) => [posRules, pos])
		.filter(
			([posRules, _]) =>
				posRules.length == 1 && knownPoses[posRules[0].name] == null
		)
		.forEach(([[posRule], pos]) => {
			shouldContinue = true;
			knownPoses[posRule.name] = pos;
		});
	if (!shouldContinue) {
		break;
	}
}

// let knownPoses = {
// 	class: 0,
// 	row: 1,
// 	"departure time": 2,
// 	type: 3,
// 	price: 4,
// 	"departure track": 5,
// 	zone: 6,
// 	wagon: 7,
// 	"departure station": 8,
// 	"arrival location": 9,
// 	"departure location": 10,
// 	"arrival station": 11,
// 	route: 12,
// 	"arrival track": 13,
// 	"departure date": 14,
// 	duration: 15,
// 	train: 16,
// 	"arrival platform": 17,
// 	"departure platform": 18,
// 	seat: 19,
// };

let result = 1;
for (let r in knownPoses) {
	let pos = knownPoses[r];
	if (r.indexOf("departure") == 0) {
		result *= myTicket[pos];
	}
}
console.log(`Result: ${result}`);
