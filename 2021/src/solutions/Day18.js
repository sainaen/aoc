#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
 18   01:47:35  1346      0   01:57:36  1352      0
 */

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.day(18);
    let sample1 = utils.sample(`
    [[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
    [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
    [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
    [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
    [7,[5,[[3,8],[1,4]]]]
    [[2,[2,2]],[8,[8,1]]]
    [2,9]
    [1,[[[9,3],9],[[9,0],[0,7]]]]
    [[[5,[7,4]],7],1]
    [[[[4,2],2],6],[8,7]]
    `);

    let expected1_1 = 3488;
    console.log(`Sample: ${part1(sample1)} (expected: ${expected1_1})`);
    console.log(`Result: ${part1(input)}`);

    console.log("---")

    let sample2 = utils.sample(`
    [[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
    [[[5,[2,8]],4],[5,[[9,9],0]]]
    [6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
    [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
    [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
    [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
    [[[[5,4],[7,7]],8],[[8,3],8]]
    [[9,3],[[9,9],[6,[4,9]]]]
    [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
    [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
    `);
    let expected2_2 = 3993;
    console.log(`Sample: ${part2(sample2)} (expected: ${expected2_2})`);
    console.log(`Result: ${part2(input)}`);
}

function parse(s) {
    return JSON.parse(s);
}

function reduceRegularNumber(n) {
    if (n < 10) {
        return [false, n];
    }
    let left = Math.floor(n / 2);
    let right = n - left;
    return [true, [left, right]];
}

function get(n, path) {
    let result = n;
    for (let i of path) {
        result = result[i];
    }
    return result;
}

function set(n, path, v) {
    let cur = n;
    for (let i of path.slice(0, path.length - 1)) {
        cur = cur[i];
    }
    cur[last(path)] = v;
}

function findFirstRegular(n, path, dir) {
    function _traverse(p) {
        let cur = get(n, p);
        if (cur == null) {
            if (p.length > 1) {
                return _traverse(p.slice(0, p.length - 1));
            } else {
                return null;
            }
        }
        if (!Array.isArray(cur)) {
            return [p, cur];
        }
        let result = null;
        for (let i = 0; i < cur.length; i++) {
            result = _traverse([...p, i]);
            if (result != null && returnOnFirstTraverseFind) {
                return result;
            }
        }
        return result;
    }

    let curPath = [...path];
    let returnOnFirstTraverseFind = dir === 'right';
    let d = dir === 'left' ? -1 : 1;
    while (curPath.length > 0) {
        let l = curPath.length - 1;
        curPath[l] += d;
        if (get(n, curPath) == null) {
            curPath = curPath.slice(0, l);
            continue;
        }
        let result = _traverse(curPath);
        if (result != null) {
            return result;
        }
    }
    return null;
}

function reduceExplode(n, path=[]) {
    let cur = get(n, path);
    if (!Array.isArray(cur)) {
        return false;
    }
    if (path.length === 4) {
        let left = findFirstRegular(n, path, 'left');
        if (left) {
            set(n, left[0], left[1] + cur[0]);
        }
        let right = findFirstRegular(n, path, 'right');
        if (right) {
            set(n, right[0], right[1] + cur[1]);
        }
        set(n, path, 0);
        return true;
    }
    for (let i = 0; i < cur.length; i++) {
        if (reduceExplode(n, [...path, i])) {
            return true;
        }
    }
    return false;
}

function reduceSplit(n, path=[]) {
    let cur = get(n, path);
    if (!Array.isArray(cur)) {
        if (cur < 10) {
            return false;
        }
        let left = Math.floor(cur / 2);
        set(n, path, [left, cur - left]);
        return true;
    }
    for (let i = 0; i < cur.length; i++) {
        if (reduceSplit(n, [...path, i])) {
            return true;
        }
    }
    return false;
}

function reduce(n) {
    while (reduceExplode(n) || reduceSplit(n)) {
        // brrr
    }
    return n;
}

function add(a, b) {
    if (a == null) {
        return b;
    }
    return reduce([reduce(a), b]);
}

function magnitude(n, path=[]) {
    let cur = get(n, path);
    if (!Array.isArray(cur)) {
        return cur;
    }
    return magnitude(n, [...path, 0]) * 3 + magnitude(n, [...path, 1]) * 2;
}

function part1(strings) {
    let input = null;
    for (let s of strings) {
        input = add(input, parse(s));
    }
    return magnitude(input);
}


function maxMagnitudeOfSum(a, b) {
    function deepClone(n) {
        return JSON.parse(JSON.stringify(n));
    }

    let m1 = magnitude(add(deepClone(a), deepClone(b)));
    let m2 = magnitude(add(deepClone(b), deepClone(a)));
    return Math.max(m1, m2);
}

function part2(strings) {
    let numbers = strings.map(s => parse(s));
    let result = -Infinity;
    for (let i = 0; i < numbers.length - 1; i++) {
        let a = numbers[i]
        for (let j = i + 1; j < numbers.length; j++) {
            let b = numbers[j];
            result = Math.max(result, maxMagnitudeOfSum(a, b));
        }
    }
    return result;
}

main();
