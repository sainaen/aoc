#!/usr/bin/env node

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.day(7);
    let sample1 = utils.sample(`
    16,1,2,0,4,2,7,1,2,14
    `);

    let expected1_1 = 37;
    console.log(`Sample: ${part1(sample1)} (expected: ${expected1_1})`)
    console.log(`Result: ${part1(input)}`)

    console.log("---")

    let expected1_2 = 168;
    console.log(`Sample: ${part2(sample1)} (expected: ${expected1_2})`)
    console.log(`Result: ${part2(input)}`)
}

function part1(strings) {
    let longs = utils.longs(strings[0], {split: ','});

    let min_pos = Math.min(...longs);
    let max_pos = Math.max(...longs);
    let best_sum = -1;
    for (let i = min_pos; i <= max_pos; i++) {
        let sum = longs.map(v => Math.abs(i - v)).reduce((a, b) => a + b);
        if (best_sum === -1 || sum < best_sum) {
            best_sum = sum;
        }
    }

    let result = best_sum;

    return result;
}

function part2(strings) {
    let longs = utils.longs(strings[0], {split: ','});

    let min_pos = Math.min(...longs);
    let max_pos = Math.max(...longs);
    let best_sum = -1;
    for (let i = min_pos; i <= max_pos; i++) {
        let sum = longs.map(v => {
            let n = Math.abs(i - v) + 1;
            return (n * (n - 1)) / 2;
        }).reduce((a, b) => a + b);
        if (best_sum === -1 || sum < best_sum) {
            best_sum = sum;
        }
    }

    let result = best_sum;

    return result;
}

main();
