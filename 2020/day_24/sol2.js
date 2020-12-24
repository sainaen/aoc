#!/usr/bin/env node

let fs = require("fs");
let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		let res = [];
		for (let i = 0; i < v.length; i++) {
			if (v[i] == "e" || v[i] == "w") {
				res.push(v[i]);
			} else {
				res.push(v.substring(i, i + 2));
				i += 1;
			}
		}
		return res;
	});

console.log(`read in ${input.length} records...`);
console.log(input.slice(0, 10));

function stepDestination(dir, x, y) {
	if (dir == "e") {
		y += 2;
	} else if (dir == "w") {
		y -= 2;
	} else if (dir == "se") {
		x -= 1;
		y += 1;
	} else if (dir == "sw") {
		x -= 1;
		y -= 1;
	} else if (dir == "ne") {
		x += 1;
		y += 1;
	} else if (dir == "nw") {
		x += 1;
		y -= 1;
	}
	return [x, y];
}

function getTile(tiles, x, y) {
	if (!(x in tiles)) {
		return false;
	}
	return !!tiles[x][y];
}

function flipTile(tiles, x, y) {
	tiles[x] = tiles[x] || {};
	tiles[x][y] = !getTile(tiles, x, y);
}

let tiles = {};
for (let tilePath of input) {
	let x = 0;
	let y = 0;
	for (let dir of tilePath) {
		[x, y] = stepDestination(dir, x, y);
	}
	flipTile(tiles, x, y);
}

function countBlackTiles(tiles) {
	return Object.values(tiles)
		.map((row) => Object.values(row))
		.flat()
		.filter((v) => v).length;
}

function countSurroundingBlackTiles(tiles, x, y) {
	return ["e", "w", "se", "sw", "ne", "nw"]
		.map((dir) => stepDestination(dir, x, y))
		.map(([nx, ny]) => getTile(tiles, nx, ny))
		.filter((t) => t).length;
}

function copyTiles(tiles) {
	return Object.entries(tiles).reduce((newTiles, [x, row]) => {
		newTiles[x] = Object.assign({}, row);
		return newTiles;
	}, {});
}

let days = 100;
for (let day = 1; day <= days; day++) {
	let newTiles = copyTiles(tiles);
	let xs = Object.keys(newTiles).map((x) => parseInt(x, 10));
	xs.sort((a, b) => a - b);
	let xMin = xs[0] - 1;
	let xMax = xs[xs.length - 1] + 1;
	let ys = Object.values(newTiles)
		.map((row) => Object.keys(row))
		.flat()
		.map((x) => parseInt(x, 10));
	ys.sort((a, b) => a - b);
	let yMin = ys[0] - 2;
	let yMax = ys[ys.length - 1] + 2;
	for (let x = xMin; x <= xMax; x++) {
		for (let y = yMin; y <= yMax; y++) {
			let tile = getTile(tiles, x, y);
			let count = countSurroundingBlackTiles(tiles, x, y);
			if (tile && (count == 0 || count > 2)) {
				flipTile(newTiles, x, y);
			} else if (!tile && count == 2) {
				flipTile(newTiles, x, y);
			}
		}
	}
	tiles = newTiles;
	// console.log(day, countBlackTiles(tiles));
}

let result = countBlackTiles(tiles);

console.log(`Result: ${result}`);
