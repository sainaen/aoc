#!/usr/bin/env node

let fs = require("fs");
let input = [
	fs
		.readFileSync("./input", "utf-8")
		.split("\n")
		.filter((v) => v)
		.map((v) => {
			return v.split("");
		}),
];

console.log(`read in ${input.length} records...`);
console.log(input);

let active = "#";
let inactive = ".";

function display(world) {
	for (let plane = 0; plane < world.length; plane++) {
		console.log(`plane=${plane}`);
		console.log(world[plane].map((row) => row.join("")).join("\n"));
	}
}

function getState(world, plane, row, col) {
	if (plane == -1 || row == -1 || col == -1) {
		return inactive;
	}
	if (plane == world.length) {
		return inactive;
	}
	let p = world[plane];
	if (row == p.length) {
		return inactive;
	}
	let r = p[row];
	if (col == r.length) {
		return inactive;
	}
	return r[col];
}

function countNeighbors(world, plane, row, col) {
	let count = 0;
	for (let i = plane - 1; i <= plane + 1; i++) {
		for (let j = row - 1; j <= row + 1; j++) {
			for (let k = col - 1; k <= col + 1; k++) {
				if (i == plane && j == row && k == col) {
					// this is us
					continue;
				}
				count += getState(world, i, j, k) == active ? 1 : 0;
			}
		}
	}
	return count;
}

function getNextState(world, plane, row, col) {
	let state = getState(world, plane, row, col);
	let activeNeighbors = countNeighbors(world, plane, row, col);
	// console.log(`[${plane}][${row}][${col}]: n=${activeNeighbors}`);
	if (state == active && (activeNeighbors == 2 || activeNeighbors == 3)) {
		return active;
	}
	if (state == inactive && activeNeighbors == 3) {
		return active;
	}
	return inactive;
}

function expandCol(col) {
	return [inactive, ...col, inactive];
}

function expandRow(row) {
	return [
		Array(row[0].length + 2).fill(inactive),
		...row.map(expandCol),
		Array(row[0].length + 2).fill(inactive),
	];
}

function expandWorld(world) {
	return [
		Array(world[0].length + 2).fill(null).map(_ => Array(world[0][0].length + 2).fill(inactive)),
		...world.map(expandRow),
		Array(world[0].length + 2).fill(null).map(_ => Array(world[0][0].length + 2).fill(inactive)),
	];
}

display(input);

let current = input;
let next;
for (let step = 0; step < 6; step++) {
	// console.log(`Count: ${current.map(plane => plane.map(row => row.filter(cell => cell == active).length)).flat().reduce((a,b) => a+b)}`)
	// display(current)
	current = expandWorld(current);
	// display(current);
	next = current.map(row => row.map(col => col.slice(0)));
	for (let plane = 0; plane < current.length; plane++) {
		for (let row = 0; row < current[plane].length; row++) {
			for (let col = 0; col < current[plane][row].length; col++) {
				next[plane][row][col] = getNextState(current, plane, row, col);
			}
		}
	}
	// display(next);
	current = next;
}

let result = current.map(plane => plane.map(row => row.filter(cell => cell == active).length)).flat().reduce((a,b) => a+b)

console.log(`Result: ${result}`)

// display(next);

// console.log(next)
