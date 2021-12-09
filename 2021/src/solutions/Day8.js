#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
  8   00:08:52  1436      0   02:29:51  7490      0
 */

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

    let expected1_1 = 26;
    console.log(`Sample: ${part1(sample1)} (expected: ${expected1_1})`)
    console.log(`Result: ${part1(input)}`)

    console.log("---")

    let sample2 = utils.sample(`
    acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf
    `)
    let expected2_1 = 61229;
    let expected2_2 = 5353;
    console.log(`Sample: ${part2(sample1)} (expected: ${expected2_1})`)
    console.log(`Sample: ${part2(sample2)} (expected: ${expected2_2})`)
    console.log(`Result: ${part2(input)}`)
}

function part1(strings) {
    let result = 0;
    for (let line of strings) {
        let [_, output] = line.split('|').map(v => v.trim());
        for (let o of output.split(' ').map(v => v.trim())) {
            if ([2, 3, 4, 7].indexOf(o.length) > -1) {
                result += 1;
            }
        }
    }

    return result;
}

function setOrIntersect(a, els) {
    if (!a || a.length === 0) {
        return els.split('');
    }
    return a.filter(v => els.indexOf(v) > -1)
}

function isPlaced(segment) {
    return segment.length === 1;
}

let digits = [
    s => [s.t, s.tl, s.tr, s.bl, s.br, s.b],
    s => [s.tr, s.br],
    s => [s.t, s.tr, s.m, s.bl, s.b],
    s => [s.t, s.tr, s.m, s.br, s.b],
    s => [s.tl, s.tr, s.m, s.br],
    s => [s.t, s.tl, s.m, s.br, s.b],
    s => [s.t, s.tl, s.m, s.bl, s.br, s.b],
    s => [s.t, s.tr, s.br],
    s => [s.t, s.tl, s.tr, s.m, s.bl, s.br, s.b],
    s => [s.t, s.tl, s.tr, s.m, s.br, s.b],
].map(v => s => v(s).sort().join(''));

function buildInitialSegments(patterns) {
    let segments = {};
    let possibleSixes = [];
    for (let pattern of patterns) {
        switch (pattern.length) {
            case 2: // 1
                segments.tr = setOrIntersect(segments.tr, pattern);
                segments.br = setOrIntersect(segments.br, pattern);
                break;
            case 3: // 7
                segments.t = setOrIntersect(segments.t, pattern);
                segments.tr = setOrIntersect(segments.tr, pattern);
                segments.br = setOrIntersect(segments.br, pattern);
                break;
            case 4: // 4
                segments.tl = setOrIntersect(segments.tl, pattern);
                segments.tr = setOrIntersect(segments.tr, pattern);
                segments.m = setOrIntersect(segments.m, pattern);
                segments.br = setOrIntersect(segments.br, pattern);
                break;
            case 7: // 8
                segments.t = setOrIntersect(segments.t, pattern);
                segments.tl = setOrIntersect(segments.tl, pattern);
                segments.tr = setOrIntersect(segments.tr, pattern);
                segments.m = setOrIntersect(segments.m, pattern);
                segments.br = setOrIntersect(segments.br, pattern);
                segments.bl = setOrIntersect(segments.bl, pattern);
                segments.b = setOrIntersect(segments.b, pattern);
                break;
            case 6: // 0, 6, 9
                possibleSixes.push(pattern);
                segments.t = setOrIntersect(segments.t, pattern);
                segments.tl = setOrIntersect(segments.tl, pattern);
                segments.b = setOrIntersect(segments.b, pattern);
                break;
            case 5: // 2, 3, 5
                segments.t = setOrIntersect(segments.t, pattern);
                segments.m = setOrIntersect(segments.m, pattern);
                segments.b = setOrIntersect(segments.b, pattern);
                break;
        }
    }
    return [segments, possibleSixes];
}

function placeUniqueSegmentValues(segments) {
    let map = Object.fromEntries(Object.values(segments).flat().map(c => [c, []]));
    for (let pos in segments) {
        for (let c of segments[pos]) {
            map[c].push(pos);
        }
    }
    let result = false;
    for (let c in map) {
        let positions = map[c];
        if (positions.length > 1) { // not unique
            continue;
        }
        let [pos] = positions;
        if (isPlaced(segments[pos])) {
            continue;
        }
        segments[pos] = [c];
        // remove from other segments
        for (let other in segments) {
            if (other === pos) {
                continue;
            }
            if (segments[other].indexOf(c) > -1) {
                segments[other] = segments[other].filter(v => v !== c);
            }
        }
        result = true;
    }
    return result;
}

function placeBottomRight(possibleSixes, segments) {
    let segmentsInSix = [segments.t, segments.tl, segments.m, segments.bl, segments.b];
    if (isPlaced(segments.br) || segmentsInSix.some(s => !isPlaced(s))) {
        return false;
    }
    let expectedInSix = segmentsInSix.map(v => v[0]);
    let sixes = possibleSixes.filter(possible6 => {
        return expectedInSix.every(v => possible6.indexOf(v) > -1);
    });
    if (sixes.length > 1) {
        console.log(sixes);
        throw `unexpected sixes length: ${sixes.length}`;
    }
    segments.br = sixes[0].split('').filter(v => expectedInSix.indexOf(v) === -1);
    return true;
}

function part2(strings) {
    let result = 0;
    for (let line of strings) {
        let [patterns, output] = line.split(' | ').map(v => v.split(' ').map(s => s.split('').sort().join('')));
        let [segments, possibleSixes] = buildInitialSegments(patterns);
        while (true) {
            if (placeUniqueSegmentValues(segments)) {
                continue;
            }
            if (placeBottomRight(possibleSixes, segments)) {
                continue;
            }
            break;
        }
        let solutionSegments = Object.fromEntries(Object.entries(segments).map(([s, v]) => [s, v[0]]));
        let solutionDigits = Object.fromEntries(digits.map((d, i) => [d(solutionSegments), i]));
        result += output.reduce((r, d) => r * 10 + solutionDigits[d], 0);
    }
    return result;
}

main();
