#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
 15   00:08:06   260      0   00:51:09  1575      0
 */

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.day(15);
    let sample1 = utils.sample(`
    1163751742
    1381373672
    2136511328
    3694931569
    7463417111
    1319128137
    1359912421
    3125421639
    1293138521
    2311944581
    `);

    let expected1_1 = 40;
    console.log(`Sample: ${part1(sample1)} (expected: ${expected1_1})`);
    console.log(`Result: ${part1(input)}`);

    console.log("---")

    let expected1_2 = 315;
    console.log(`Sample: ${part2(sample1)} (expected: ${expected1_2})`);
    console.log(`Result: ${part2(input)}`);
}

function part1(strings) {
    let longs = utils.longs(strings, {lsplit: ''});

    let field = longs.map(row => row.map(v => Infinity));
    field[0][0] = 0;
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            let v = field[i][j];
            for (let [ni, nj] of utils.neighbors(field, i, j)) {
                let nv = longs[ni][nj];
                field[ni][nj] = Math.min(field[ni][nj], nv + v);
            }
        }
    }
    return last(last(field));
}

function part2(strings) {
    let longs = utils.longs(strings, {lsplit: ''});

    let fullLongs = [];
    for (let xi = 0; xi < 5; xi++) {
        for (let xj = 0; xj < 5; xj++) {
            for (let i = 0; i < longs.length; i++) {
                for (let j = 0; j < longs[i].length; j++) {
                    let row = i + xi * longs.length;
                    if (!fullLongs[row]) {
                        fullLongs[row] = [];
                    }
                    let col = j + xj * longs[i].length;
                    fullLongs[row][col] = longs[i][j] + xi + xj;
                    while (fullLongs[row][col] > 9) {
                        fullLongs[row][col] -= 9;
                    }
                }
            }
        }
    }

    let field = fullLongs.map(row => row.map(v => Infinity));
    field[0][0] = 0;
    let queue = [];
    queue.push([0, 0]);
    while (queue.length > 0) {
        let [i, j] = queue.shift();
        let v = field[i][j];
        for (let [ni, nj] of utils.neighbors(field, i, j)) {
            let nv = fullLongs[ni][nj];
            let prev = field[ni][nj];
            field[ni][nj] = Math.min(prev, nv + v);
            if (prev > field[ni][nj]) {
                queue.push([ni, nj]);
            }
        }
    }

    return last(last(field));
}

main();
