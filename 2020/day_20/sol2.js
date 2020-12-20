#!/usr/bin/env node

let fs = require("fs");
let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n\n")
	.filter((v) => v)
	.map((v) => {
		let lines = v.split('\n');
		let n = parseInt(lines.shift().match(/^Tile (\d+):$/)[1], 10);
		let tile = lines.map(l => l.split(''));
		let top = tile[0].join('');
		let bottom = tile[tile.length - 1].join('');
		let left = tile.map(r => r[0]).join('');
		let right = tile.map(r => r[r.length - 1]).join('');
		return {
			n,
			tile,
			borders: { top, bottom, left, right },
		}
	});

console.log(`read in ${input.length} records...`);
// console.log(input.slice(0, 10));


function revS(s) {
	return s.split('').reverse().join('');
}

let corners = input.filter(t => {
	let borders = new Set(input.filter(ot => t.n != ot.n).reduce((r, t) => r.concat(Object.values(t.borders)), []))
	let count = 0;
	t.hasNeighbor = {};
	for (let side in t.borders) {
		let border = t.borders[side]
		if (borders.has(border) || borders.has(revS(border))) {
			t.hasNeighbor[side] = true;
			count += 1;
		}
	}
	return count == 2;
});

let map = [[]];

function flip(map) {
	return [...map].reverse();
}

function flipTile(t) {
	// flip borders
	[t.borders.top, t.borders.bottom] = [t.borders.bottom, t.borders.top];
	t.borders.left = revS(t.borders.left);
	t.borders.right = revS(t.borders.right);
	// flip neighbors
	[t.hasNeighbor.top, t.hasNeighbor.bottom] = [t.hasNeighbor.bottom, t.hasNeighbor.top];
	// flip the tile itself
	t.tile = flip(t.tile);
	return t;
}

function rotateCW(map) {
	let result = [];
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			result[j] = result[j] || [];
			result[j][i] = map[i][j];
		}
	}
	result.forEach(r => r.reverse());
	return result;
}

function rotateTileCW(t) {
	// rotate borders
	[t.borders.top, t.borders.right, t.borders.bottom, t.borders.left] = [revS(t.borders.left), t.borders.top, revS(t.borders.right), t.borders.bottom];
	// rotate neighbors
	[t.hasNeighbor.top, t.hasNeighbor.right, t.hasNeighbor.bottom, t.hasNeighbor.left] = [t.hasNeighbor.left, t.hasNeighbor.top, t.hasNeighbor.right, t.hasNeighbor.bottom];
	// rotate the tile itself
	t.tile = rotateCW(t.tile);
	return t;
}

// make first corner top left
let corner = flipTile(corners[0]);
while (!corner.hasNeighbor.bottom || !corner.hasNeighbor.right) {
	corner = rotateTileCW(corner);
}
// console.log(corner);

map[0][0] = corner;
let pile = input.filter(t => t.n != corner.n).reduce((r, t) => {
	for (let side in t.borders) {
		let border = t.borders[side];
		r[border] = r[border] || []
		r[border].push(t);
		border = revS(border);
		r[border] = r[border] || [];
		r[border].push(t);
	}
	return r;
}, {});


function oSide(side) {
	let c = {
		'top': 'bottom',
		'bottom': 'top',
		'left': 'right',
		'right': 'left',
	};
	return c[side];
}

console.log('')
console.log(new Date())
console.log(`---------------------------------------------------------------`)

function removeFromPile(t, pile) {
	for (let side in t.borders) {
		let border = t.borders[side];
		if (border in pile) {
			if (pile[border].length > 1) {
				pile[border] = pile[border].filter(ot => t.n != ot.n);
			} else {
				delete pile[border];
			}
		}
		border = revS(border);
		if (border in pile) {
			if (pile[border].length > 1) {
				pile[border] = pile[border].filter(ot => t.n != ot.n);
			} else {
				delete pile[border];
			}
		}
	}
}

function placeNext(map, pile) {
	// console.log('pile')
	// console.log(Object.keys(pile).map(b => `${b}: ${pile[b].map(t => t.n).join(', ')}`).sort())
	// console.log('map')
	// displayMap(map);

	for (let row = 0 ; row < map.length; row++) {
		for (let col = 0; col < map[row].length; col++) {
			let t = map[row][col];
			for (let side in t.borders) {
				let border = t.borders[side];
				if (!(border in pile)) {
					continue;
				}
				if (pile[border].length != 1) {
					console.error(`Unexpected more than one match for border: ${border}, matches: `, pile[border]);
				}
				let [ot] = pile[border];
				removeFromPile(ot, pile);
				for (let i = 0; i < 4; i++) {
					if (ot.borders[oSide(side)] == border) {
						break;
					}
					ot = rotateTileCW(ot);
				}
				if (ot.borders[oSide(side)] != border) {
					ot = flipTile(ot);
					for (let i = 0; i < 4; i++) {
						if (ot.borders[oSide(side)] == border) {
							break;
						}
						ot = rotateTileCW(ot);
					}
				}
				if (ot.borders[oSide(side)] != border) {
					console.error(`Something is weird, can't match sides of`)
					console.error(t)
					console.error(ot)
					throw new Error();
				}
				if (side == 'top') {
					if (map[row - 1] && map[row - 1][col]) {
						console.error(`Two tile match coords [${row-1},${col}]!`)
						throw new Error();
					}
					if (row == 0) {
						console.log(t.n);
						console.log(t.tile.map(r => r.join('')).join('\n'))
						console.log(ot.n);
						console.log(ot.tile.map(r => r.join('')).join('\n'))
						console.log(side, oSide(side));
						throw new Error(`trying to place out of range`)
					}
					map[row - 1] = map[row - 1] || [];
					map[row - 1][col] = ot;
				} else if (side == 'bottom') {
					if (map[row + 1] && map[row + 1][col]) {
						console.error(`Two tile match coords [${row+1},${col}]!`)
						throw new Error();
					}
					map[row + 1] = map[row + 1] || [];
					map[row + 1][col] = ot;
				} else if (side == 'right') {
					if (map[row][col + 1]) {
						console.error(`Two tile match coords [${row},${col + 1}]!`)
						throw new Error();
					}
					map[row][col + 1] = ot;
				} else if (side == 'left') {
					console.error(`Weirdly matched on the left!`, t, ot)
					throw new Error();
				}
				// console.log(`Placed: ${ot.n} at ${side} of ${t.n}`);
				return true;
			}
		}
	}
	return false;
}

function displayMap(map) {
	for (let i = 0; i < map.length; i++) {
		let row = map[i];
		for (let j = 0; j < row[0].tile.length; j++) {
			let mline = [];
			for (let t of row) {
				mline.push(t.tile[j].join(''));
			}
			console.log(mline.join(' '));
		}
		console.log('')
	}
}

let limit = 100_000;
for (let i = 0; i < limit && Object.keys(pile).length > 0; i++) {
	if (i == limit - 1) {
		console.error(`Out of loops!`);
	}
	if (!placeNext(map, pile)) {
		console.error(pile);
		displayMap(map);
		break;
	}
}

// displayMap(map);

function assembleMap(map) {
	let tiles = map.map(r => {
		return r.map(t => {
			return t.tile.slice(1, t.tile.length - 1).map(tr => tr.slice(1, tr.length - 1).join(''));
		})
	});

	let result = [];
	for (let i = 0; i<tiles.length; i++) {
		let row = tiles[i];
		for (let j = 0; j < row[0].length; j++) {
			let rowResult = [];
			for (let t of row) {
				rowResult.push(t[j]);
			}
			result.push(rowResult.join('').split(''));
		}
	}
	return result;
}

map = assembleMap(map);

const monster =[
		'                  # ',
	    '#    ##    ##    ###',
 	    ' #  #  #  #  #  #   ',
 	].map(v => v.split(''));

function matchMonster(map, i, j, monstersMap) {
 	if (i > map.length - monster.length) {
 		// no vertical space
 		return;
 	}
 	if (j > map[0].length - monster[0].length) {
 		// no horizontal space
 		return;
 	}
 	for (let mi = 0; mi < monster.length; mi++) {
 		for (let mj = 0; mj < monster[0].length; mj++) {
 			if (monster[mi][mj] != '#') {
 				continue;
 			}
 			if (map[i + mi][j + mj] != '#') {
 				return false;
 			}
 		}
 	}
 	// found monster, mark it
 	 for (let mi = 0; mi < monster.length; mi++) {
 		for (let mj = 0; mj < monster[0].length; mj++) {
 			if (monster[mi][mj] == '#') {
 				monstersMap[i + mi][j + mj] = 'O';
 			}
 		}
 	}
 	return true;
}

function findMonsters(map) {
	let monstersMap = [...map.map(r => [...r])];
	let foundMonsters = 0;
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (matchMonster(map, i, j, monstersMap)) {
				foundMonsters += 1;
			}
		}
	}
	return [foundMonsters, monstersMap];
}

function findMostMonsters(map) {
	let maxMonsters = 0, maxMonstersMap;
	for (let i = 0; i < 8; i++) {
		let [foundMonsters, monstersMap] = findMonsters(map);
		if (foundMonsters > maxMonsters) {
			maxMonstersMap = monstersMap;
		}
		if (i == 3) {
			map = flip(rotateCW(map));
		} else {
			map = rotateCW(map);
		}
	}
	return maxMonstersMap;
}

let monstersMap = findMostMonsters(map);
console.log(monstersMap.map(r => r.join('')).join('\n'));

let result = monstersMap.flat().filter(v => v == '#').length;

console.log(`Result: ${result}`);
