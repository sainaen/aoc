#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
  9   00:05:37   421      0   00:19:08   644      0
 */

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.day(9);
    let sample1 = utils.sample(`
    2199943210
    3987894921
    9856789892
    8767896789
    9899965678
    `);

    let expected1_1 = 15;
    console.log(`Sample: ${part1(sample1)} (expected: ${expected1_1})`)
    console.log(`Result: ${part1(input)}`)

    console.log("---")

    let expected1_2 = 1134;
    console.log(`Sample: ${part2(sample1)} (expected: ${expected1_2})`)
    console.log(`Result: ${part2(input)}`)
}

function isLowPoint(field, y, x) {
    let v = field[y][x];
    let result = true;
    for (let [ny, nx] of utils.neighbors(field, y, x)) {
        if (field[ny][nx] < v) {
            result = false;
        }
    }
    return result;
}

function part1(strings) {
    let field = longs(strings, {lsplit: ''});

    let result = 0;
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            if (isLowPoint(field, i, j)) {
                result += field[i][j] + 1;
            }
        }
    }

    return result;
}

function isTrue(a, i, j) {
    return a[i] && a[i][j];
}

function setTrue(a, i, j) {
    if (!a[i]) {
        a[i] = [];
    }
    a[i][j] = true;
}

function discoverBasin(field, i, j, visited=[]) {
    setTrue(visited, i, j);
    let result = 1;
    if (i !== 0 && !isTrue(visited, i-1, j) && field[i-1][j] < 9) {
        result += discoverBasin(field, i-1, j, visited);
    }
    if (j !== 0 && !isTrue(visited, i, j-1) && field[i][j-1] < 9) {
        result += discoverBasin(field, i, j-1, visited);
    }
    if (j < field[i].length - 1 && !isTrue(visited, i, j+1) && field[i][j+1] < 9) {
        result += discoverBasin(field, i, j+1, visited);
    }
    if (i < field.length - 1 && !isTrue(visited, i+1, j) && field[i+1][j] < 9) {
        result += discoverBasin(field, i+1, j, visited);
    }
    return result;
}

function part2(strings) {
    let field = longs(strings, {lsplit: ''});

    let basins = [];
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            if (isLowPoint(field, i, j)) {
                basins.push({i, j})
            }
        }
    }

    let result = basins.map(b => discoverBasin(field, b.i, b.j)).sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a * b);

    return result;
}

main();
