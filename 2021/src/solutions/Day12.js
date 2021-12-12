#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
 12   00:15:41   941      0   00:21:59   604      0
 */

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.day(12);
    let sample1 = utils.sample(`
    start-A
    start-b
    A-c
    A-b
    b-d
    A-end
    b-end
    `);
    let sample2 = utils.sample(`
    dc-end
    HN-start
    start-kj
    dc-start
    dc-HN
    LN-dc
    HN-end
    kj-sa
    kj-HN
    kj-dc
    `);
    let sample3 = utils.sample(`
    fs-end
    he-DX
    fs-he
    start-DX
    pj-DX
    end-zg
    zg-sl
    zg-pj
    pj-he
    RW-he
    fs-DX
    pj-RW
    zg-RW
    start-pj
    he-WI
    zg-he
    pj-fs
    start-RW
    `);

    let expected1_1 = 10;
    let expected2_1 = 19;
    let expected3_1 = 226;
    console.log(`Sample: ${part1(sample1)} (expected: ${expected1_1})`);
    console.log(`Sample: ${part1(sample2)} (expected: ${expected2_1})`);
    console.log(`Sample: ${part1(sample3)} (expected: ${expected3_1})`);
    console.log(`Result: ${part1(input)}`);

    console.log("---")

    let expected1_2 = 36;
    let expected2_2 = 103;
    let expected3_2 = 3509;
    console.log(`Sample: ${part2(sample1)} (expected: ${expected1_2})`);
    console.log(`Sample: ${part2(sample2)} (expected: ${expected2_2})`);
    console.log(`Sample: ${part2(sample3)} (expected: ${expected3_2})`);
    console.log(`Result: ${part2(input)}`);
}

function buildNodes(strings) {
    let nodes = {};
    for (let [s, e] of strings.map(v => v.split('-').map(s => s.trim()))) {
        if (!nodes[s]) {
            nodes[s] = [];
        }
        nodes[s].push(e);
        if (!nodes[e]) {
            nodes[e] = [];
        }
        nodes[e].push(s);
    }
    return nodes;
}

function part1Recurse(nodes, node = 'start', seen = {}) {
    if (node === 'end') {
        return 1;
    }
    if (node === node.toLowerCase()) {
        seen[node] = true;
    }
    let res = 0;
    if (!nodes[node] || nodes[node].length === 0) {
        return res;
    }
    for (let other of nodes[node]) {
        if (!seen[other]) {
            res += part1Recurse(nodes, other, {...seen});
        }
    }
    return res;
}

function part1(strings) {
    return part1Recurse(buildNodes(strings));
}

function part2Recurse(nodes, node = 'start', seen = {}, usedSecondVisit = false) {
    if (node === 'end') {
        return 1;
    }
    if (!nodes[node] || nodes[node].length === 0) {
        return 0;
    }
    if (node === node.toLowerCase()) {
        seen[node] = true;
    }
    let res = 0;
    for (let other of nodes[node]) {
        if (!seen[other]) {
            res += part2Recurse(nodes, other, {...seen}, usedSecondVisit);
        }
        if (!usedSecondVisit && other !== 'start' && other !== 'end' && seen[other]) {
            res += part2Recurse(nodes, other, {...seen}, true);
        }
    }
    return res;
}

function part2(strings) {
    return part2Recurse(buildNodes(strings));
}

main();
