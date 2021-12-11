#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
 11   00:22:32  1582      0   00:24:33  1423      0
 */

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.day(11);
    let sample1 = utils.sample(`
    5483143223
    2745854711
    5264556173
    6141336146
    6357385478
    4167524645
    2176841721
    6882881134
    4846848554
    5283751526
    `);

    let expected1_1 = 1656;
    console.log(`Sample: ${part1(sample1)} (expected: ${expected1_1})`);
    console.log(`Result: ${part1(input)}`);

    console.log("---")

    let expected1_2 = 195;
    console.log(`Sample: ${part2(sample1)} (expected: ${expected1_2})`);
    console.log(`Result: ${part2(input)}`);
}

function step(field) {
    let flashed = field.map(v => v.map(s => false));
    let critical = []
    for (let y = 0; y < field.length; y++) {
        for (let x = 0; x < field[y].length; x++) {
            field[y][x] += 1;
            if (field[y][x] > 9) {
                flashed[y][x] = true;
                critical.push([y, x]);
            }
        }
    }
    while (critical.length > 0) {
        let [y, x] = critical.pop();
        for (let [ny, nx] of utils.neighbors(field, y, x, {diagonals: true})) {
            field[ny][nx] += 1;
            if (!flashed[ny][nx] && field[ny][nx] > 9) {
                flashed[ny][nx] = true;
                critical.push([ny, nx]);
            }
        }
    }
    for (let y = 0; y < field.length; y++) {
        for (let x = 0; x < field[y].length; x++) {
            if (flashed[y][x]) {
                field[y][x] = 0;
            }
        }
    }
    return flashed.flat().filter(v => v).length;
}

function part1(strings) {
    let field = longs(strings, {lsplit: ''});

    let result = 0;
    for (let i = 0; i < 100; i++) {
        result += step(field);
    }

    return result;
}

function part2(strings) {
    let field = longs(strings, {lsplit: ''});
    let len = field.map(row => row.length).reduce((a, b) => a + b, 0);

    let result = 0;
    for (let i = 1; i < 10_000_000; i++) {
        let count = step(field);
        if (count === len) {
            result = i;
            break;
        }
    }

    return result;
}

main();
