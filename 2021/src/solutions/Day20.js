#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
 20   02:53:51  4759      0   02:55:20  4493      0
 */

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.dayGroup(20);
    let sample1 = utils.sampleGroup(`
    ..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

    #..#.
    #....
    ##..#
    ..#..
    ..###
    `);

    let expected1_1 = 35;
    console.log(`Sample: ${part1(sample1)} (expected: ${expected1_1})`);
    console.log(`Result: ${part1(input)}`);

    console.log("---")

    let expected1_2 = 3351;
    console.log(`Sample: ${part2(sample1)} (expected: ${expected1_2})`);
    console.log(`Result: ${part2(input)}`);
}

function toKey(coord) {
    if (typeof coord === "string") {
        return coord;
    }
    return JSON.stringify(coord);
}

function fromKey(k) {
    if (typeof k === "string") {
        return JSON.parse(k);
    }
    return k;
}

function lookup(image, coord) {
    return image[toKey(coord)] || 0;
}

function set(image, coord, v = 1) {
    let k = toKey(coord);
    if (v === 0) {
        if (k in image) {
            delete image[coord]
        }
    } else {
        image[k] = v;
    }
}

function square(k, n = 1) {
    let [i, j] = fromKey(k);
    let result = [];
    for (let di = -n; di <= n; di++) {
        for (let dj = -n; dj <= n; dj++) {
            result.push(toKey([i + di, j + dj]));
        }
    }
    return result;
}

function newValue(lookup, k, enhAlg) {
    let i = parseInt(square(k).map(sk => lookup(sk)).join(''), 2);
    if (enhAlg[i] === '#') {
        return 1;
    }
    if (enhAlg[i] === '.') {
        return 0;
    }
    throw `unexpected i=${i}`;
}

function isVoid(image, k) {
    return square(k).map(sk => lookup(image, sk)).every(v => v === 0);
}

function apply2Step(image, enhAlg) {
    let interimImage = {};
    let saw = new Set();
    for (let k in image) {
        for (let sk of square(k, 2)) {
            if (saw.has(sk)) { continue; }
            saw.add(sk);

            set(interimImage, sk, newValue(c => lookup(image, c), sk, enhAlg));
        }
    }

    let newImage = {};
    let voidAwareLookup = c => lookup(interimImage, c);
    if (enhAlg[0] === '#' && last(enhAlg) === '.') {
        let directLookup = voidAwareLookup;
        voidAwareLookup = c => isVoid(image, c) ? 1 : directLookup(c);
    }

    saw = new Set();
    for (let k in interimImage) {
        for (let sk of square(k, 2)) {
            if (saw.has(sk)) { continue; }
            saw.add(sk);

            set(newImage, sk, newValue(voidAwareLookup, sk, enhAlg));
        }
    }
    return newImage;
}

function box(image) {
    let minI = Infinity, maxI =-Infinity;
    let minJ = Infinity, maxJ =-Infinity;
    for (let k of Object.keys(image)) {
        let [i, j] = fromKey(k);
        minI = Math.min(minI, i);
        maxI = Math.max(maxI, i);
        minJ = Math.min(minJ, j);
        maxJ = Math.max(maxJ, j);
    }
    return [[minI, maxI], [minJ, maxJ]];
}

function print(image) {
    let [[minI, maxI], [minJ, maxJ]] = box(image);
    for (let i = minI - 1; i <= maxI  + 1; i++) {
        let row = [];
        for (let j = minJ - 1; j <= maxJ + 1; j++) {
            let v = lookup(image, [i, j]);
            if (v === 0) {
                row.push('.');
            } else if (v === -1) {
                row.push('?');
            }
             else {
                row.push('#');
            }
        }
        console.log(row.join(''));
    }
}

function part1([[enhAlg], imageArray]) {
    let image = {};
    for (let i = 0; i < imageArray.length; i++) {
        for (let j = 0; j < imageArray[i].length; j++) {
            if (imageArray[i][j] === '#') {
                set(image, [i, j]);
            }
        }
    }
    // console.log('before');
    // print(image);

    image = apply2Step(image, enhAlg);

    // console.log('after')
    // print(image);

    return Object.keys(image).length;
}

function part2([[enhAlg], imageArray]) {
    let image = {};
    for (let i = 0; i < imageArray.length; i++) {
        for (let j = 0; j < imageArray[i].length; j++) {
            if (imageArray[i][j] === '#') {
                set(image, [i, j]);
            }
        }
    }

    // console.log('before');
    // print(image);

    for (let i = 0; i < 50/2; i++) {
        image = apply2Step(image, enhAlg);
    }

    // console.log('after')
    // print(image);

    return Object.keys(image).length;
}

main();
