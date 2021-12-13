#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
 13   00:34:02  3821      0   00:35:59  2753      0
 */

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.dayGroup(13);
    let sample1 = utils.sampleGroup(`
    6,10
    0,14
    9,10
    0,3
    10,4
    4,11
    6,0
    6,12
    4,1
    0,13
    10,12
    3,4
    3,0
    8,4
    1,10
    2,14
    8,10
    9,0

    fold along y=7
    fold along x=5
    `);

    let expected1_1 = 17;
    console.log(`Sample: ${part1(sample1)} (expected: ${expected1_1})`);
    console.log(`Result: ${part1(input)}`);

    console.log("---")

    console.log(`Result: ${part2(input)}`);
}

function parse([lines, rawFolds]) {
    let coords = lines.map(v => v.split(',')).map(v => ({x: parseInt(v[0], 10), y: parseInt(v[1], 10)}));
    let folds = rawFolds.map(v => {
        let [axis, n] = v.split(' ').pop().split('=');
        return {axis, n: parseInt(n, 10)};
    });
    return {coords, folds};
}

function fold(coords, {axis, n}) {
    let present = new Set();
    let result = [];
    for (let c of coords) {
        let newC = {...c};
        if (newC[axis] === n) {
            continue;
        }
        if (newC[axis] > n) {
            newC[axis] = newC[axis] - (newC[axis] - n) * 2;
        }
        let k = JSON.stringify(newC);
        if (!present.has(k)) {
            result.push(newC);
            present.add(k);
        }
    }
    return result;
}

function print(coords) {
    let maxX = coords.map(v => v.x).reduce((a, b) => a < b ? b : a);
    let maxY = coords.map(v => v.y).reduce((a, b) => a < b ? b : a);
    let field = [];
    for (let c of coords) {
        if (!field[c.y]) {
            field[c.y] = [];
        }
        field[c.y][c.x] = '#';
    }
    for (let i = 0; i <= maxY; i++) {
        if (!field[i]) {
            field[i] = [];
        }
        console.log(Array.from({length: maxX + 1}).fill(' ').map((v, j) => field[i][j] || v).join(''));
    }
}

function part1(input) {
    let {coords, folds} = parse(input);
    coords = fold(coords, folds[0]);
    return coords.length;
}

function part2(input) {
    let {coords, folds} = parse(input);
    for (let f of folds) {
        coords = fold(coords, f);
    }
    print(coords)

    return "see the output obove";
}

main();
