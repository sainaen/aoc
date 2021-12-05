#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
  5   00:15:35  1667      0   00:30:24  2075      0
 */

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.day(5);
    let sample1 = utils.sample(`
    0,9 -> 5,9
    8,0 -> 0,8
    9,4 -> 3,4
    2,2 -> 2,1
    7,0 -> 7,4
    6,4 -> 2,0
    0,9 -> 2,9
    3,4 -> 1,4
    0,0 -> 8,8
    5,5 -> 8,2
    `)

    console.log(`Sample: ${part1(sample1)}`)
    console.log(`Result: ${part1(input)}`)

    console.log("---")

    console.log(`Sample: ${part2(sample1)}`)
    console.log(`Result: ${part2(input)}`)
}

function parse(strings) {
    return strings.map(s => {
        let parts = s.split(' -> ');
        return {start: longs(parts[0], {split: ','}), end: longs(parts[1], {split: ','})};
    });
}

function coverHoriz(field, {start, end}) {
    let y = start[1];
    for (let x = Math.min(start[0], end[0]); x <= Math.max(start[0], end[0]); x++) {
        if (!field[y]) {
            field[y] = [];
        }
        field[y][x] = (field[y][x] || 0) + 1;
    }
}

function coverVert(field, {start, end}) {
    let x = start[0];
    for (let y = Math.min(start[1], end[1]); y <= Math.max(start[1], end[1]); y++) {
        if (!field[y]) {
            field[y] = [];
        }
        field[y][x] = (field[y][x] || 0) + 1;
    }
}

function part1(strings) {
    let field = [];
    for (let line of parse(strings)) {
        if (line.start[0] === line.end[0]) {
            coverVert(field, line)
        } else if (line.start[1] === line.end[1]) {
            coverHoriz(field, line);
        }
    }
    return field.reduce((res, row) => res + row.filter(v => v >= 2).length, 0);
}

function coverDiag(field, {start, end}) {
    let yCheck = start[1] < end[1] ? (v => v <= end[1]) : (v => v >= end[1]);
    let yInc = start[1] > end[1] ? -1 : 1;
    let xInc = start[0] > end[0] ? -1 : 1;

    for (let y = start[1], x = start[0]; yCheck(y); y+=yInc, x+=xInc) {
        if (!field[y]) {
            field[y] = [];
        }
        field[y][x] = (field[y][x] || 0) + 1;
    }
}

function part2(strings) {
    let field = [];
    for (let line of parse(strings)) {
        if (line.start[0] === line.end[0]) {
            coverVert(field, line)
        } else if (line.start[1] === line.end[1]) {
            coverHoriz(field, line);
        } else {
            coverDiag(field, line);
        }
    }
    return field.reduce((res, row) => res + row.filter(v => v >= 2).length, 0);
}

main();
