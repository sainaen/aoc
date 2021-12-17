#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
 17   00:33:13  2183      0   00:44:00  2023      0
 */

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.day(17);
    let sample1 = utils.sample(`
    target area: x=20..30, y=-10..-5
    `);

    let expected1_1 = 45;
    console.log(`Sample: ${part1(sample1)} (expected: ${expected1_1})`);
    console.log(`Result: ${part1(input)}`);

    console.log("---")

    let expected1_2 = 112;
    console.log(`Sample: ${part2(sample1)} (expected: ${expected1_2})`);
    console.log(`Result: ${part2(input)}`);
}

function parse(s) {
    let coords = s.substring('target area: '.length);
    let [x, y] = coords.split(', ');
    let p = v => v.substring('x='.length).split('..').map(p => parseInt(p, 10));

    return {x: p(x), y: p(y)};
}

function overshot(pos, targetArea) {
    return pos.x > targetArea.x[1] || pos.y < targetArea.y[0];
}

function inArea(pos, targetArea) {
    return targetArea.x[0] <= pos.x && pos.x <= targetArea.x[1] &&
           targetArea.y[0] <= pos.y && pos.y <= targetArea.y[1];
}

function step(pos, v) {
    pos.x += v.x;
    pos.y += v.y;
    if (v.x !== 0) {
        v.x += v.x > 0 ? -1 : 1;
    }
    v.y += -1;
}

function simulate(v, targetArea) {
    let pos = {x: 0, y: 0};
    let maxY = 0;
    while (!overshot(pos, targetArea)) {
        step(pos, v);
        maxY = Math.max(pos.y, maxY);
        if (inArea(pos, targetArea)) {
            return [true, maxY];
        }
    }
    return [false, null];
}

function search(targetArea) {
    let vs = new Set();
    let maxY = -Infinity;
    for (let vy = targetArea.y[0]; vy <= 1_000; vy++) {
        let sawHit = false;
        for (let vx = 0; vx <= targetArea.x[1]; vx++) {
            let v = {x: vx, y: vy};
            let [hit, stepMaxY] = simulate({...v}, targetArea);
            if (hit) {
                vs.add(JSON.stringify(v));
                sawHit = true;
                maxY = Math.max(maxY, stepMaxY);
            } else if (sawHit) {
                break;
            }
        }
    }
    return [maxY, vs];
}

function part1(strings) {
    let targetArea = parse(strings[0]);

    let [result, _] = search(targetArea);

    return result;
}

function part2(strings) {
    let targetArea = parse(strings[0]);

    let [_, vs] = search(targetArea);

    return vs.size;
}

main();
