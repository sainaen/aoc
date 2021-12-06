#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
  6   00:04:57   589      0   00:14:06  1052      0
 */

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.day(6);
    let sample1 = utils.sample(`
    3,4,3,1,2
    `)

    console.log(`Sample: ${part1(sample1)}`)
    console.log(`Result: ${part1(input)}`)

    console.log("---")

    console.log(`Sample: ${part2(sample1)}`)
    console.log(`Result: ${part2(input)}`)
}

function part1(strings) {
    let longs = utils.longs(strings[0], {split: ','});

    for (let i = 0; i < 80; i++) {
        let next_longs = [];
        for (let fish of longs) {
            if (fish === 0) {
                next_longs.push(6);
                next_longs.push(8);
            } else {
                next_longs.push(fish - 1);
            }
        }
        longs = next_longs;
    }

    let result = longs.length;

    return result;
}

function part2(strings) {
    let longs = utils.longs(strings[0], {split: ','});
    let ttls = longs.reduce((res, fish) => {
        res[fish] = (res[fish] || 0) + 1;
        return res;
    }, [])

    for (let i = 0; i < 256; i++) {
        for (let j = 0; j < 9; j++) {
            ttls[j] = ttls[j] || 0;
        }
        let next_ttls = ttls.slice(1);
        next_ttls[6] = (next_ttls[6] || 0) + ttls[0];
        next_ttls[8] = ttls[0];
        ttls = next_ttls;
    }

    let result = ttls.reduce((a, b) => a+b, 0);
    return result;
}

main();
