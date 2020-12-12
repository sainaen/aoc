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

let ship = [0, 0];
let waypoint = [10, 1];
let dirs = ["E", "S", "W", "N"];
let dir = 0;

function turn(turnDir, angle) {
	if (angle == 180) {
		waypoint = [-waypoint[0], -waypoint[1]];
	} else if (angle == 360 || angle == 0) {
		waypoint = waypoint;
	} else if (angle > 360) {
		console.error(`Large angle: ${angle}`);
	} else if (angle == 90) {
		if (turnDir == "L") {
			waypoint = [-waypoint[1], waypoint[0]];
		} else if (turnDir == "R") {
			waypoint = [waypoint[1], -waypoint[0]];
		} else {
			console.error(`Unknown direction: ${turnDir}`);
		}
	} else if (angle == 270) {
		turn(turnDir == "L" ? "R" : "L", 90);
	} else {
		console.error(`Angle is weird: ${angle}`);
	}
}

function move(action, amount) {
	if (action == "N") {
		waypoint[1] += amount;
	} else if (action == "S") {
		waypoint[1] -= amount;
	} else if (action == "E") {
		waypoint[0] += amount;
	} else if (action == "W") {
		waypoint[0] -= amount;
	} else {
		console.error(`Unknown action ${action}`);
	}
}

for (let { action, amount } of input) {
	if (dirs.indexOf(action) >= 0) {
		move(action, amount);
	} else if (["L", "R"].indexOf(action) >= 0) {
		turn(action, amount);
	} else if (action == "F") {
		ship[0] += waypoint[0] * amount;
		ship[1] += waypoint[1] * amount;
	}
	// console.log(action, amount)
	// console.log(waypoint)
	// console.log(ship)
}

console.log(`Result: ${ship.map((v) => Math.abs(v)).reduce((a, b) => a + b)}`);
