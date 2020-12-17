#!/usr/bin/env node

let fs = require("fs");
let input = [[
	fs
		.readFileSync("./input", "utf-8")
		.split("\n")
		.filter((v) => v)
		.map((v) => {
			return v.split("");
		}),
]];

console.log(`read in ${input.length} records...`);
console.log(input);

let active = "#";
let inactive = ".";

function display(world) {
	for (let plane = 0; plane < world.length; plane++) {
		for (let row = 0; row < world[plane].length; row++) {
			console.log(`plane=${plane}, row=${row}`);
			console.log(world[plane][row].map((col) => col.join("")).join("\n"));
		}
	}
}

function getState(world, plane, row, col, w) {
	if (plane == -1 || row == -1 || col == -1 || w == -1) {
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
	let ww = r[col];
	if (w == ww.length) {
		return inactive;
	}
	return ww[w];
}

function countNeighbors(world, plane, row, col, w) {
	let count = 0;
	for (let i = plane - 1; i <= plane + 1; i++) {
		for (let j = row - 1; j <= row + 1; j++) {
			for (let k = col - 1; k <= col + 1; k++) {
				for (let l = w - 1; l <= w + 1; l++) {
					if (i == plane && j == row && k == col && l == w) {
						// this is us
						continue;
					}
					count += getState(world, i, j, k, l) == active ? 1 : 0;
				}
			}
		}
	}
	return count;
}

function getNextState(world, plane, row, col, w) {
	let state = getState(world, plane, row, col, w);
	let activeNeighbors = countNeighbors(world, plane, row, col, w);
	// console.log(`[${plane}][${row}][${col}]: n=${activeNeighbors}`);
	if (state == active && (activeNeighbors == 2 || activeNeighbors == 3)) {
		return active;
	}
	if (state == inactive && activeNeighbors == 3) {
		return active;
	}
	return inactive;
}

function emptyW(len) {
	return Array(len).fill(inactive);
}

function expandW(w) {
	return [inactive, ...w, inactive];
}

function emptyCol(colLen, wLen) {
	return Array(colLen)
		.fill(null)
		.map((_) => emptyW(wLen));
}

function expandCol(col) {
	return [
		emptyW(col[0].length + 2),
		...col.map(expandW),
		emptyW(col[0].length + 2),
	];
}

function emptyRow(rowLen, colLen, wLen) {
	return Array(rowLen)
		.fill(null)
		.map((_) => emptyCol(colLen, wLen));
}

function expandRow(row) {
	return [
		emptyCol(row[0].length + 2, row[0][0].length + 2),
		...row.map(expandCol),
		emptyCol(row[0].length + 2, row[0][0].length + 2),
	];
}

function expandWorld(world) {
	return [
		emptyRow(
			world[0].length + 2,
			world[0][0].length + 2,
			world[0][0][0].length + 2
		),
		...world.map(expandRow),
		emptyRow(
			world[0].length + 2,
			world[0][0].length + 2,
			world[0][0][0].length + 2
		),
	];
}

let current = input;
let next;
for (let step = 0; step < 6; step++) {
	current = expandWorld(current);
	next = current.map((row) => row.map((col) => col.map((w) => w.slice(0))));
	for (let plane = 0; plane < current.length; plane++) {
		for (let row = 0; row < current[plane].length; row++) {
			for (let col = 0; col < current[plane][row].length; col++) {
				for (let w = 0; w < current[plane][row][col].length; w++) {
					next[plane][row][col][w] = getNextState(
						current,
						plane,
						row,
						col,
						w
					);
				}
			}
		}
	}
	// display(current)
	current = next;
	// console.log(`step:${step}-------------------------------`)
	// display(current);
}

let result = current.flat(5).filter((cell) => cell == active).length;
console.log(`Result: ${result}`);
