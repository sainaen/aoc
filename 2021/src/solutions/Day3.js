#!/usr/bin/env node

let utils = require("../utils/utils");

function main() {
    let input = utils.day(3);
    let sample1 = utils.sample(`
                00100
                11110
                10110
                10111
                10101
                01111
                00111
                11100
                10000
                11001
                00010
                01010
    `)

    console.log(`Sample: ${part1(sample1)}`)
    console.log(`Result: ${part1(input)}`)

    console.log("---")

    console.log(`Sample: ${part2(sample1)}`)
    console.log(`Result: ${part2(input)}`)
}

function countBits(strings, pos) {
    return strings.reduce((res, s) => {
        if (s[pos] === '0') {
            res[0]+=1;
        } else {
            res[1]+=1;
        }
        return res;
    }, {0: 0, 1: 0});
}

function part1(strings) {
    let len = strings[0].length;

    let gamma = 0;
    let epsilon = 0;
    for (let i = 0; i < len; i++) {
        let bits = countBits(strings, i);
        let mpb = bits[0] >= bits[1] ? 0 : 1;
        let lpb = mpb === 1 ? 0 : 1;

        gamma = (gamma << 1) + mpb;
        epsilon = (epsilon << 1) + lpb;
    }

    return gamma * epsilon;
}

function part2(strings) {
    let len = strings[0].length;

    let oxy = strings;
    for (let i = 0; i < len; i++) {
        if (oxy.length === 1) {
            break;
        }
        let bits = countBits(oxy, i);
        let mpb = bits[0] > bits[1] ? '0' : '1';

        oxy = oxy.filter(s => s[i] === mpb);
    }
    let co2 = strings;
    for (let i = 0; i < len; i++) {
        if (co2.length === 1) {
            break;
        }
        let bits = countBits(co2, i);
        let lpb = bits[0] <= bits[1] ? '0' : '1';

        co2 = co2.filter(s => s[i] === lpb);
    }

    return parseInt(oxy[0], 2) * parseInt(co2[0], 2);
}

main();

