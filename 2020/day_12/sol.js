#!/usr/bin/env node

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		let action = v[0];
		return { action, amount: parseInt(v.substring(1), 10) };
	});

console.log(`read in ${input.length} records...`);
console.log(input.slice(0, 10));

let result = [0, 0];
let dirs = ["E", "S", "W", "N"];
let dir = 0;

function turn(turnDir, angle) {
	let turns = angle / 90;
	if (turnDir == "L") {
		turns = -turns;
	}
	let nextDir = dir + turns;
	if (nextDir < 0) {
		nextDir += dirs.length;
	}
	if (nextDir >= dirs.length) {
		nextDir -= dirs.length;
	}
	dir = nextDir;
}

function move(action, amount) {
	if (action == "N") {
		result[1] += amount;
	} else if (action == "S") {
		result[1] -= amount;
	} else if (action == "E") {
		result[0] += amount;
	} else if (action == "W") {
		result[0] -= amount;
	} else {
		console.error(`Unknown action ${action}`);
	}
}

for (let { action, amount } of input) {
	if (["N", "S", "E", "W"].indexOf(action) >= 0) {
		move(action, amount);
	} else if (["L", "R"].indexOf(action) >= 0) {
		turn(action, amount);
	} else if (action == "F") {
		move(dirs[dir], amount);
	}
}

console.log(
	`Result: ${result.map((v) => Math.abs(v)).reduce((a, b) => a + b)}`
);
