#!/usr/bin/env node

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		let [policyStr, pwd] = v.split(": ");
		let policy = {
			min: parseInt(policyStr.split("-")[0], 10),
			max: parseInt(policyStr.split("-")[1].split(" ")[0], 10),
			char: policyStr.split(" ")[1],
		};
		return { policy, pwd };
	});
console.log(`read in ${input.length} values...`);

function isValid({ min, max, char }, pwd) {
	return pwd.match(`^([^${char}]*${char}[^${char}]*){${min},${max}}$`);
}

let validCount = 0;
for (let { policy, pwd } of input) {
	if (isValid(policy, pwd)) {
		validCount += 1;
	}
}
console.log(`Total of valid passwords: ${validCount}`);
