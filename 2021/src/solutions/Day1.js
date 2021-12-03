#!/usr/bin/env node

let utils = require("../utils/utils");

function main() {
    let input = utils.day(1);
    let sample1 = utils.sample(`
        199
        200
        208
        210
        200
        207
        240
        269
        260
        263
    `)

    console.log(`Sample1: ${part1(sample1)}`)
    console.log(`Result: ${part1(input)}`)

    console.log("---")

    console.log(`Sample1: ${part2(sample1)}`)
    console.log(`Result: ${part2(input)}`)
}

function part1(strings) {
    let longs = utils.longs(strings);

    let result = 0;
    let prev = longs[0];
    for (let i = 1; i < longs.length; i++) {
        if (longs[i] > prev) {
            result++;
        }
        prev = longs[i];
    }

    return result;
}

function part2(strings) {
    let longs = utils.longs(strings);

    let windows = [];
    for (let i = 0; i < longs.length; i++) {
        windows.push(longs[i] + longs[i+1] + longs[i+2]);
    }
    let result = 0;
    let prev = windows[0];
    for (let i = 1; i < windows.length; i++) {
        if (windows[i] > prev) {
            result++;
        }
        prev = windows[i];
    }

    return result;
}

main();

