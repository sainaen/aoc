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

function walk(s, rowi, coli, dir) {
	for (
		let i = 1;
		rowi + i * dir[0] >= 0 &&
		rowi + i * dir[0] < s.length &&
		coli + i * dir[1] >= 0 &&
		coli + i * dir[1] < s[0].length;
		i++
	) {
		let cell = s[rowi + i * dir[0]][coli + i * dir[1]];
		if (cell != FLOOR) {
			return cell;
		}
	}
	return null;
}

function countN_correct(s, rowi, coli, state) {
	let count = 0;
	// top
	if (walk(s, rowi, coli, [-1, 0]) == state) {
		count += 1;
	}
	// top left
	if (walk(s, rowi, coli, [-1, -1]) == state) {
		count += 1;
	}
	// top right
	if (walk(s, rowi, coli, [-1, 1]) == state) {
		count += 1;
	}
	// left
	if (walk(s, rowi, coli, [0, -1]) == state) {
		count += 1;
	}
	// right
	if (walk(s, rowi, coli, [0, 1]) == state) {
		count += 1;
	}
	// bottom
	if (walk(s, rowi, coli, [1, 0]) == state) {
		count += 1;
	}
	// bottom left
	if (walk(s, rowi, coli, [1, -1]) == state) {
		count += 1;
	}
	// bottom right
	if (walk(s, rowi, coli, [1, 1]) == state) {
		count += 1;
	}
	return count;
}

function countN(s, rowi, coli, state) {
	let count = 0;
	let ns = [];
	// top
	for (let i = 1; rowi - i >= 0; i++) {
		let cell = s[rowi - i][coli];
		if (cell == state) {
			count += 1;
			ns.push(1);
		}
		if (cell != FLOOR) {
			break;
		}
	}
	// top left
	for (let i = 1; rowi - i >= 0 && coli - i >= 0; i++) {
		let cell = s[rowi - i][coli - i];
		if (cell == state) {
			count += 1;
			ns.push(0);
		}
		if (cell != FLOOR) {
			break;
		}
	}
	// top right
	for (let i = 1; rowi - i >= 0 && coli + i < s[0].length; i++) {
		let cell = s[rowi - i][coli + i];
		if (cell == state) {
			count += 1;
			ns.push(2);
		}
		if (cell != FLOOR) {
			break;
		}
	}
	// left
	for (let i = 1; coli - i >= 0; i++) {
		let cell = s[rowi][coli - i];
		if (cell == state) {
			count += 1;
			ns.push(3);
		}
		if (cell != FLOOR) {
			break;
		}
	}
	// right
	for (let i = 1; coli + i < s[0].length; i++) {
		let cell = s[rowi][coli + i];
		if (cell == state) {
			count += 1;
			ns.push(4);
		}
		if (cell != FLOOR) {
			break;
		}
	}
	// bottom
	for (let i = 1; rowi + i < s.length; i++) {
		let cell = s[rowi + i][coli];
		if (cell == state) {
			count += 1;
			ns.push(6);
		}
		if (cell != FLOOR) {
			break;
		}
	}
	// bottom left
	for (let i = 1; rowi + i < s.length && coli - i >= 0; i++) {
		let cell = s[rowi + i][coli - i];
		if (cell == state) {
			count += 1;
			ns.push(5);
		}
		if (cell != FLOOR) {
			break;
		}
	}
	// bottom right
	for (let i = 1; rowi + i < s.length && coli + i < s[0].length; i++) {
		let cell = s[rowi + i][coli + i];
		if (cell == state) {
			count += 1;
			ns.push(7);
		}
		if (cell != FLOOR) {
			break;
		}
	}
	return [count, ns];
}

let halt = -1;

function nextCellState(s, cell, rowi, coli) {
	if (cell == EMPTY) {
		let [c1, ns] = countN(s, rowi, coli, OCCUPIED);
		let c2 = countN_correct(s, rowi, coli, OCCUPIED);
		if (c1 != c2) {
			if (!mustHalt) {
				console.error(cell, rowi, coli, c1, c2, ns);
				printState(s);
			}
			return halt;
		}
		if (c1 == 0) {
			return OCCUPIED;
		}
	}
	if (cell == OCCUPIED) {
		let [c1, ns] = countN(s, rowi, coli, OCCUPIED);
		let c2 = countN_correct(s, rowi, coli, OCCUPIED);
		if (c1 != c2) {
			if (!mustHalt) {
				console.error(cell, rowi, coli, c1, c2, ns);
				printState(s);
			}
			return halt;
		}
		if (c1 >= 5) {
			return EMPTY;
		}
	}
	return cell;
}

let mustHalt = false;
let state = input;
for (let i = 10000; !mustHalt && i >= 0; i--) {
	if (i == 0) {
		console.error("Out of rounds");
		break;
	}
	let moved = false;

	state = state.map((row, rowi) => {
		return row.map((cell, coli) => {
			let next = nextCellState(state, cell, rowi, coli);
			if (next == halt) {
				mustHalt = true;
			}
			if (next != cell) {
				moved = true;
			}
			return next;
		});
	});
	if (mustHalt) {
		break;
	}
	if (!moved) {
		printState(state);
		break;
	}
}

let result = state
	.map((row) => row.filter((v) => v == OCCUPIED).length)
	.reduce((a, b) => a + b);

console.log(`Result: ${result}`);
