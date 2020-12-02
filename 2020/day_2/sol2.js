#!/usr/bin/env node

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		let [policyStr, pwd] = v.split(": ");
		let policy = {
			pos1: parseInt(policyStr.split("-")[0], 10),
			pos2: parseInt(policyStr.split("-")[1].split(" ")[0], 10),
			char: policyStr.split(" ")[1],
		};
		return { policy, pwd };
	});
console.log(`read in ${input.length} values...`);

function isValid(policy, pwd) {
	// passwords are non-zero indexed
	let c1 = pwd[policy.pos1 - 1];
	let c2 = pwd[policy.pos2 - 1];
	let result = (
		(c1 === policy.char && c2 !== policy.char) ||
		(c1 !== policy.char && c2 === policy.char)
	);
	console.log(policy, JSON.stringify(pwd.split('').map((c,i) => ({[i]: c})), null, ''), c1, c2, result)
	return result;
}

let validCount = 0;
for (let { policy, pwd } of input) {
	if (isValid(policy, pwd)) {
		validCount += 1;
	}
}
console.log(`Total of valid passwords: ${validCount}`);
