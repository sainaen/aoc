#!/usr/bin/env node

let utils = require("../utils/utils");

function main() {
    let input = utils.day(2);
    let sample1 = utils.sample(`
        forward 5
        down 5
        forward 8
        up 3
        down 8
        forward 2
    `)

    console.log(`Sample: ${part1(sample1)}`)
    console.log(`Result: ${part1(input)}`)

    console.log("---")

    console.log(`Sample: ${part2(sample1)}`)
    console.log(`Result: ${part2(input)}`)
}

function part1(strings) {
    let depth = 0;
    let pos = 0;
    for (const l of strings) {
        let parts = l.split(" ");
        let x = parseInt(parts[1], 10);
        switch (parts[0]) {
            case "down":
                depth += x;
                break;
            case "up":
                depth -= x;
                break;
            case "forward":
                pos += x;
                break;
            default:
                throw "Unexpected direction: " + parts[0];
        }
    }

    return depth * pos;
}

function part2(strings) {
    let depth = 0;
    let pos = 0;
    let aim = 0;
    for (const l of strings) {
        let parts = l.split(" ");
        let x = parseInt(parts[1], 10);
        switch (parts[0]) {
            case "down":
                aim += x;
                break;
            case "up":
                aim -= x;
                break;
            case "forward":
                pos += x;
                depth += aim * x;
                break;
            default:
                throw "Unexpected direction: " + parts[0];
        }
    }

    return depth * pos;
}

main();

