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
        let [patterns, output] = line.split('|').map(v => v.trim());
        for (let o of output.split(' ').map(v => v.trim())) {
            if ([2,3,4,7].indexOf(o.length) > -1) {
                result += 1;
            }
        }
    }

    return result;
}

function fix(s) {
    return s.split('').sort();
}

function setOrFilter(a, els) {
    if (a.length === 0) {
        return els;
    }
    return a.filter(v => els.indexOf(v) > -1)
}

function part2(strings) {
    let input = strings.map(line => {
        let [patterns, output] = line.split('|').map(v => v.trim());
        return {patterns: patterns.split(' ').map(v => v.trim()).filter(v => v), output: output.split(' ').map(v => v.trim()).filter(v => v)};
    });
    let result = 0;
    for (let {patterns, output} of input) {
        let segments = {
            t: [],
            tl: [],
            tr: [],
            m: [],
            bl: [],
            br: [],
            b: [],
        };
        let digits = [];
        let badDigits = [];
        for (let pattern of patterns) {
            pattern = fix(pattern);
            let d = pattern;
            if (pattern.length === 2) {
                digits[1] = d;
                segments.tr = setOrFilter(segments.tr, pattern);
                segments.br = setOrFilter(segments.br, pattern);
            } else if (pattern.length === 3) {
                digits[7] = d;
                segments.t = setOrFilter(segments.t, pattern);
                segments.tr = setOrFilter(segments.tr, pattern);
                segments.br = setOrFilter(segments.br, pattern);
            } else if (pattern.length === 4) {
                digits[4] = d;
                segments.tl = setOrFilter(segments.tl, pattern);
                segments.tr = setOrFilter(segments.tr, pattern);
                segments.m = setOrFilter(segments.m, pattern);
                segments.br = setOrFilter(segments.br, pattern);
            } else if (pattern.length === 7) {
                digits[8] = d;
                segments.t = setOrFilter(segments.t, pattern);
                segments.tl = setOrFilter(segments.tl, pattern);
                segments.tr = setOrFilter(segments.tr, pattern);
                segments.m = setOrFilter(segments.m, pattern);
                segments.br = setOrFilter(segments.br, pattern);
                segments.bl = setOrFilter(segments.bl, pattern);
                segments.b = setOrFilter(segments.b, pattern);
            } else if (pattern.length === 6) {
                // 0, 6, 9
                badDigits[0] = badDigits[0] || [];
                badDigits[0].push(d)
                badDigits[6] = badDigits[6] || [];
                badDigits[6].push(d)
                badDigits[9] = badDigits[9] || [];
                badDigits[9].push(d)
                segments.t = setOrFilter(segments.t, pattern);
                segments.tl = setOrFilter(segments.tl, pattern);
                segments.b = setOrFilter(segments.b, pattern);
            } else if (pattern.length === 5) {
                // 2, 3, 5
                badDigits[2] = badDigits[2] || [];
                badDigits[2].push(d)
                badDigits[3] = badDigits[3] || [];
                badDigits[3].push(d)
                badDigits[5] = badDigits[5] || [];
                badDigits[5].push(d)
                segments.t = setOrFilter(segments.t, pattern);
                segments.m = setOrFilter(segments.m, pattern);
                segments.b = setOrFilter(segments.b, pattern);
            }
        }
        outer: while (true) {
            // console.log('1', segments)
            for (let pos in segments) {
                if (segments[pos].length === 1) {
                    let segmentElement = segments[pos][0];
                    for (let other in segments) {
                        if (other !== pos && segments[other].indexOf(segmentElement) > -1) {
                            segments[other] = segments[other].filter(v => v !== segmentElement);
                            // console.log('found unique: ', segmentElement)
                            continue outer;
                        }
                    }
                }
            }
            // console.log('2', segments)
            let map = {};
            for (let pos in segments) {
                for (let el of segments[pos]) {
                    if (!map[el]) {
                        map[el] = [];
                    }
                    map[el].push(pos);
                }
            }
            // console.log('2', map)
            for (let el in map) {
                if (map[el].length === 1 && segments[map[el][0]].length > 1) {
                    segments[map[el][0]] = [ el ];
                    // console.log('found unique2 :', el)
                    continue outer;
                }
            }
            if (digits[4] && segments.m.length === 1 && segments.tl.length > 1) {
                let m = segments.m[0];
                segments.tl = digits[4].filter(v4 => digits[1].indexOf(v4) === -1).filter(v => v !== m);
                // console.log('4', segments)
                continue outer;
            }
            if (segments.br.length > 1 && segments.t.length === 1 && segments.tl.length === 1 && segments.m.length === 1 && segments.bl.length === 1 && segments.b.length === 1) {
                let expectedIn6 = [segments.t[0], segments.tl[0], segments.m[0], segments.bl[0], segments.b[0]];
                let sixes = badDigits[6].filter(possible6 => {
                    return expectedIn6.every(v => possible6.indexOf(v) > -1);
                });
                if (sixes.length > 1) {
                    console.log(sixes)
                    throw `unexpected sixes length: ${sixes.length}`;
                }
                segments.br = sixes[0].filter(v => expectedIn6.indexOf(v) === -1);
                // console.log('6', segments)
                continue outer;
            }
            if (segments.br.length > 1 && segments.t.length === 1 && segments.tl.length === 1 && segments.m.length === 1 && segments.br.length === 1 && segments.b.length === 1) {
                let expectedIn9 = [segments.t[0], segments.tl[0], segments.m[0], segments.br[0], segments.b[0]];
                let nines = badDigits[9].filter(possible9 => {
                    return expectedIn9.every(v => possible9.indexOf(v) > -1);
                });
                if (nines.length > 1) {
                    console.log(nines)
                    throw `unexpected nines length: ${nines.length}`;
                }
                segments.bl = nines[0].filter(v => expectedIn9.indexOf(v) === -1);
                // console.log('9', segments)
                continue outer;
            }
            if (segments.m.length > 1 && segments.t.length === 1 && segments.tl.length === 1 && segments.tr.length === 1 && segments.bl.length === 1 && segments.br.length === 1 && segments.b.length === 1) {
                let expectedIn0 = [segments.t[0], segments.tl[0], segments.tr[0], segments.bl[0], segments.br[0], segments.b[0]];
                segments.bl = digits[8].filter(v => expectedIn0.indexOf(v) === -1);
                // console.log('0-8', segments)
                continue outer;
            }
            break;
        }
        // console.log(segments)
        for (let pos in segments) {
            if (segments[pos].length !== 1) {
                console.log('unexpected segment length', segments[pos])
                throw `unexpected segments[${pos}] length: ${segments[pos].length}`;
            }
            segments[pos] = segments[pos][0];
        }
        // console.log(segments);
        digits[0] = [segments.t, segments.tl, segments.tr, segments.bl, segments.br, segments.b];
        digits[1] = [segments.tr, segments.br];
        digits[2] = [segments.t, segments.tr, segments.m, segments.bl, segments.b];
        digits[3] = [segments.t, segments.tr, segments.m, segments.br, segments.b];
        digits[4] = [segments.tl, segments.tr, segments.m, segments.br];
        digits[5] = [segments.t, segments.tl, segments.m, segments.br, segments.b];
        digits[6] = [segments.t, segments.tl, segments.m, segments.bl, segments.br, segments.b];
        digits[7] = [segments.t, segments.tr, segments.br];
        digits[8] = [segments.t, segments.tl, segments.tr, segments.m, segments.bl, segments.br, segments.b];
        digits[9] = [segments.t, segments.tl, segments.tr, segments.m, segments.br, segments.b];
        for (let i = 0; i < digits.length; i++) {
            digits[i] = digits[i].sort().join('');
        }
        // console.log(digits)
        let outputNumber = output.map(v => {
            let seq = fix(v).join('');
            let result = digits.indexOf(seq);
                if (result === -1) {
                    console.log('not found digit', v, seq, digits)
                    throw seq;
                }
                return result;
            })
            .reduce((r, d) => {
                return r*10 + d;
            }, 0)
        // console.log(outputNumber)
        result += outputNumber
    }

    return result;
}
main();
