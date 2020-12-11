#!/usr/bin/env node

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		return v.split("");
	});

function printState(s) {
	console.log(s.map((row) => row.join("")).join("\n"));
	console.log("");
}

console.log(`read in ${input.length} records...`);
printState(input);

let EMPTY = "L";
let FLOOR = ".";
let OCCUPIED = "#";

function countN(s, rowi, coli, state) {
	let count = 0;
	// top
	if (rowi > 0 && s[rowi - 1][coli] == state) {
		count += 1;
	}
	// top left
	if (rowi > 0 && coli > 0 && s[rowi - 1][coli - 1] == state) {
		count += 1;
	}
	// top right
	if (rowi > 0 && coli < s[0].length - 1 && s[rowi - 1][coli + 1] == state) {
		count += 1;
	}
	// left
	if (coli > 0 && s[rowi][coli - 1] == state) {
		count += 1;
	}
	// right
	if (coli < s[0].length - 1 && s[rowi][coli + 1] == state) {
		count += 1;
	}
	// bottom
	if (rowi < s.length - 1 && s[rowi + 1][coli] == state) {
		count += 1;
	}
	// bottom left
	if (rowi < s.length - 1 && coli > 0 && s[rowi + 1][coli - 1] == state) {
		count += 1;
	}
	// bottom right
	if (
		rowi < s.length - 1 &&
		coli < s[0].length - 1 &&
		s[rowi + 1][coli + 1] == state
	) {
		count += 1;
	}
	return count;
}

function nextCellState(s, cell, rowi, coli) {
	if (cell == EMPTY && countN(s, rowi, coli, OCCUPIED) == 0) {
		return OCCUPIED;
	}
	if (cell == OCCUPIED && countN(s, rowi, coli, OCCUPIED) >= 4) {
		return EMPTY;
	}
	return cell;
}

let state = input;
for (let i = 1000; i >= 0; i--) {
	if (i == 0) {
		console.error("Out of rounds");
		break;
	}
	let moved = false;
	state = state.map((row, rowi) => {
		return row.map((cell, coli) => {
			let next = nextCellState(state, cell, rowi, coli);
			if (next != cell) {
				moved = true;
			}
			return next;
		});
	});
	if (!moved) {
		printState(state);
		break;
	}
}

let result = state
	.map((row) => row.filter((v) => v == OCCUPIED).length)
	.reduce((a, b) => a + b);

console.log(`Result: ${result}`);
