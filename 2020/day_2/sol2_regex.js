#!/usr/bin/env node

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		let [policyStr, pwd] = v.split(": ");
		// passwords are non-zero indexed
		let policy = {
			pos1: parseInt(policyStr.split("-")[0], 10) - 1,
			pos2: parseInt(policyStr.split("-")[1].split(" ")[0], 10) - 1,
			char: policyStr.split(" ")[1],
		};
		return { policy, pwd };
	});
console.log(`read in ${input.length} values...`);

function isValid({ pos1, pos2, char }, pwd) {
	if (pos1 >= pwd.length) {
		return false;
	}
	let dist = pos2 - pos1 - 1;
	let matcher =
		pos2 >= pwd.length
			? `^.{${pos1}}${char}.*$`
			: `^.{${pos1}}(${char}.{${dist}}[^${char}]|[^${char}].{${dist}}${char}).*$`;
	return pwd.match(matcher) != null;
}

let validCount = 0;
for (let { policy, pwd } of input) {
	if (isValid(policy, pwd)) {
		validCount += 1;
	}
}
console.log(`Total of valid passwords: ${validCount}`);
