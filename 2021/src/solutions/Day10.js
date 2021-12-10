#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
 10   00:05:18   289      0   00:12:49   545      0
 */

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.day(10);
    let sample1 = utils.sample(`
    [({(<(())[]>[[{[]{<()<>>
    [(()[<>])]({[<{<<[]>>(
    {([(<{}[<>[]}>{[]{[(<()>
    (((({<>}<{<{<>}{[]{[]{}
    [[<[([]))<([[{}[[()]]]
    [{[{({}]{}}([{[{{{}}([]
    {<[[]]>}<{[{[{[]{()[[[]
    [<(<(<(<{}))><([]([]()
    <{([([[(<>()){}]>(<<{{
    <{([{{}}[<[[[<>{}]]]>[]]
    `);

    let expected1_1 = 26397;
    console.log(`Sample: ${part1(sample1)} (expected: ${expected1_1})`);
    console.log(`Result: ${part1(input)}`);

    console.log("---")

    let expected1_2 = 288957;
    console.log(`Sample: ${part2(sample1)} (expected: ${expected1_2})`);
    console.log(`Result: ${part2(input)}`);
}

let parens = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
};

let points1 = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
};

function part1(strings) {
    let result = 0;

    outer: for (let line of strings) {
        let chars = line.split('');
        let stack = [];
        for (let c of chars) {
            if (c === '(' || c === '[' || c === '{' || c === '<' ) {
                stack.push(c);
            } else {
                if (parens[stack.pop()] !== c) {
                    result += points1[c];
                    continue outer;
                }
            }
        }
    }

    return result;
}

let points2 = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
};

function part2(strings) {
    let scores = [];
    outer: for (let line of strings) {
        let chars = line.split('');
        let stack = [];
        for (let c of chars) {
            if (c === '(' || c === '[' || c === '{' || c === '<' ) {
                stack.push(c);
            } else {
                if (parens[stack.pop()] !== c) {
                    continue outer;
                }
            }
        }
        scores.push(stack.reverse().map(c => points2[parens[c]]).reduce((a, b) => a * 5 + b, 0));
    }

    return scores.sort((a, b) => b - a)[Math.floor(scores.length / 2)];
}

main();
