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

let debug = false;

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

function findRegularToLeft(n, path) {
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
            return {path: p, v: cur};
        }
        let result = null;
        for (let i = 0; i < cur.length; i++) {
            result = _traverse([...p, i]);
        }
        return result;
    }

    let curPath = [...path];
    while (curPath.length > 0) {
        debug && console.log('left', JSON.stringify(curPath));
        let l = curPath.length - 1;
        curPath[l] -= 1;
        if (curPath[l] < 0) {
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

function findRegularToRight(n, path) {
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
            return {path: p, v: cur};
        }
        for (let i = 0; i < cur.length; i++) {
            let result = _traverse([...p, i]);
            if (result != null) {
                return result;
            }
        }
        return null;
    }

    let curPath = [...path];
    while (curPath.length > 0) {
        debug && console.log('right', JSON.stringify(curPath));
        let l = curPath.length - 1;
        curPath[l] += 1;
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
        debug && console.log('exploded at', path, JSON.stringify(cur), JSON.stringify(n));
        let left = findRegularToLeft(n, path);
        if (left) {
            debug && console.log('exploding: found l', left, JSON.stringify(n));
            set(n, left.path, left.v + cur[0]);
        }
        let right = findRegularToRight(n, path);
        if (right) {
            debug && console.log('exploding: found r', right, JSON.stringify(n));
            set(n, right.path, right.v + cur[1]);
        }
        set(n, path, 0);
        debug && console.log('after exploding', path, JSON.stringify(n));
        return true;
    }

    for (let i = 0; i < cur.length; i++) {
        let changed = reduceExplode(n, [...path, i]);
        if (changed) {
            return true;
        }
    }

    return false;
}

function reduceSplit(n, path=[]) {
    let cur = get(n, path);
    if (!Array.isArray(cur)) {
        let [changed, newV] = reduceRegularNumber(cur);
        if (changed) {
            set(n, path, newV)
        }
        debug && console.log('reduced number at', path, changed, newV, JSON.stringify(n));
        return changed;
    }

    for (let i = 0; i < cur.length; i++) {
        let changed = reduceSplit(n, [...path, i]);
        if (changed) {
            return true;
        }
    }

    return false;
}

function reduce(n) {
    let reduced = true;
    while (reduced) {
        reduced = false;
        if (reduceExplode(n)) {
            reduced = true;
        } else if (reduceSplit(n)) {
            reduced = true;
        }
    }
    return n;
}

function pair(n, other) {
    if (n == null) {
        return other;
    }
    return [n, other];
}

function add(a, b) {
    if (a == null) {
        return reduce(b);
    }
    return reduce(pair(reduce(a), b));
}

function magnitude(n, path=[]) {
    let cur = get(n, path);
    if (!Array.isArray(cur)) {
        return cur;
    }

    let left = magnitude(n, [...path, 0]);
    let right = magnitude(n, [...path, 1]);

    return left * 3 + right * 2;
}

function part1(strings) {
    let input = null;
    for (let s of strings) {
        input = add(input, parse(s));
    }
    // console.log(JSON.stringify(input))

    return magnitude(input);
}

function deepClone(a) {
    return JSON.parse(JSON.stringify(a));
}

function maxMagnitudeOfSum(a, b) {
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
