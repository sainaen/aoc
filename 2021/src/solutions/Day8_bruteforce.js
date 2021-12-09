#!/usr/bin/env node

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.day(8);
    let sample1 = utils.sample(`
    be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
    edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
    fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
    fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
    aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
    fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
    dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
    bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
    egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
    gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
    `);

    let sample2 = utils.sample(`
    acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf
    `);

    let expected2_1 = 61229;
    let expected2_2 = 5353;
    console.log(`Sample: ${part2(sample1)} (expected: ${expected2_1})`);
    console.log(`Sample: ${part2(sample2)} (expected: ${expected2_2})`);
    console.log(`Result: ${part2(input)}`);
}

let digitRules = [
    s => t(s.t, s.tr, s.br, s.b, s.bl, s.tl),
    s => t(s.tr, s.br),
    s => t(s.t, s.tr, s.m, s.bl, s.b),
    s => t(s.t, s.tr, s.m, s.br, s.b),
    s => t(s.tl, s.tr, s.m, s.br),
    s => t(s.t, s.tl, s.m, s.br, s.b),
    s => t(s.t, s.tl, s.bl, s.b, s.br, s.m),
    s => t(s.t, s.tr, s.br),
    s => t(s.t, s.tr, s.m, s.br, s.b, s.bl, s.tl),
    s => t(s.t, s.tr, s.m, s.br, s.b, s.tl),
];

function t(...s) {
    return s.sort().join('');
}

function c(s) {
    return t(...s.split(''));
}

let segments = ['t', 'tr', 'br', 'b', 'bl', 'tl', 'm'];
let alphabet = Array.from({length: 7}).map((_,i) => String.fromCharCode('a'.charCodeAt(0) + i));

function findMatch(allDigits, currentGuess={}) {
    if (Object.keys(currentGuess).length === segments.length) {
        for (let rule of digitRules) {
            if (!allDigits.has(rule(currentGuess))) {
                return null;
            }
        }
        return currentGuess;
    }
    let usedCharacters = new Set(Object.values(currentGuess));
    let segment = segments.find(s => !(s in currentGuess));
    for (let c of alphabet) {
        if (usedCharacters.has(c)) {
            continue;
        }
        let result = findMatch(allDigits, {...currentGuess, [segment]: c});
        if (result != null) {
            return result;
        }
    }
    return null;
}

function placeTop(allDigits) {
    let one = allDigits.find(v => v.length === 2).split('');
    let seven = allDigits.find(v => v.length === 3).split('');
    return {t: seven.find(v => one.indexOf(v) === -1)};
}

function part2(strings) {
    let result = 0;
    for (let line of strings) {
        let [allDigits, number] = line.split(' | ').map(v => v.split(' ').map(c));
        let segmentPlacement = findMatch(new Set(allDigits), placeTop(allDigits));
        let digits = Object.fromEntries(digitRules.map((f, i) => [f(segmentPlacement), i]));
        let n = number.reduce((res, d) => res * 10 + digits[d], 0);
        result += n;
    }
    return result;
}

main();
