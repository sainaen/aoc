#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
 14   00:13:13  1566      0   01:30:34  4472      0
 */

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.dayGroup(14);
    let sample1 = utils.sampleGroup(`
    NNCB

    CH -> B
    HH -> N
    CB -> H
    NH -> C
    HB -> C
    HC -> B
    HN -> C
    NN -> C
    BH -> H
    NC -> B
    NB -> B
    BN -> B
    BB -> N
    BC -> B
    CC -> N
    CN -> C
    `);

    let expected1_1 = 1588;
    console.log(`Sample: ${part1(sample1)} (expected: ${expected1_1})`);
    console.log(`Result: ${part1(input)}`);

    console.log("---")

    let expected1_2 = 2188189693529;
    console.log(`Sample: ${part2(sample1)} (expected: ${expected1_2})`);
    console.log(`Result: ${part2(input)}`);
}

function parse([tpl, insertionsRaw]) {
    let insertions = {};
    for (let insert of insertionsRaw) {
        let [pair, el] = insert.split(' -> ');
        insertions[pair] = el;
    }
   return {tpl: tpl[0].split(''), insertions};
}

function part1(input) {
    let {tpl, insertions} = parse(input);

    for (let step = 0; step < 10; step++) {
        let newTpl = [];
        for (let i = 0; i < tpl.length - 1; i++) {
            let pair = tpl[i] + tpl[i + 1];
            newTpl.push(tpl[i]);
            if (insertions[pair]) {
                newTpl.push(insertions[pair]);
            }
        }
        newTpl.push(last(tpl));
        tpl = newTpl;
    }
    let els = Object.values(tpl.reduce((res, v) => {
        res[v] = (res[v] || 0) + 1;
        return res;
    }, {})).sort((a, b) => b - a);
    return els[0] - last(els);
}

function add(o, i, v) {
    o[i] = (o[i] || 0n) + BigInt(v);
}

function part2(input) {
    let {tpl, insertions} = parse(input);

    let lastChar = last(tpl);
    let tplPairs = tpl.reduce((res, v) => {
        if (res.prev) {
            let pair = res.prev + v;
            add(res.pairs, pair, 1n);
        }
        res.prev = v;
        return res;
    }, {pairs: {}, prev: ''}).pairs;

    for (let step = 0; step < 40; step++) {
        let nextTplPairs = Object.fromEntries(Object.entries(tplPairs));
        for (let pair in insertions) {
            if (tplPairs[pair]) {
                add(nextTplPairs, pair, -tplPairs[pair]);
                let insert = insertions[pair];
                add(nextTplPairs, pair[0] + insert, tplPairs[pair]);
                add(nextTplPairs, insert + pair[1], tplPairs[pair]);
            }
        }
        tplPairs = Object.fromEntries(Object.entries(nextTplPairs).filter(([pair, count]) => count > 0));
    }
    let counts = {[lastChar]: 1n};
    for (let pair in tplPairs) {
        add(counts, pair[0], tplPairs[pair]);
    }
    let els = Object.values(counts).sort((a, b) => b > a ? 1 : -1);
    return els[0] - last(els);
}

main();
