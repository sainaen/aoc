#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
 19   08:58:37  3745      0   09:43:07  3750      0
 */

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.dayGroup(19);
    let sample1 = utils.sampleGroup(19);

    let expected1_1 = 79;
    let [result1_sample1, forP2_sample1] = part1(sample1);
    console.log(`Sample: ${result1_sample1} (expected: ${expected1_1})`);
    let [result1, forP2] = part1(input);
    console.log(`Result: ${result1}`);

    console.log("---")

    let expected1_2 = 3621;
    console.log(`Sample: ${part2(forP2_sample1)} (expected: ${expected1_2})`);
    console.log(`Result: ${part2(forP2)}`);
}

function parse(groups) {
    let input = [];
    for (let group of groups) {
        input.push(utils.longs(group.slice(1), {lsplit: ','}));
    }
    return input;
}

let rotations = [
    ([x, y, z]) => [x * -1, y * -1, z * -1],
    ([x, y, z]) => [x * -1, y * -1, z *  1],
    ([x, y, z]) => [x * -1, y *  1, z * -1],
    ([x, y, z]) => [x * -1, y *  1, z *  1],
    ([x, y, z]) => [x *  1, y * -1, z * -1],
    ([x, y, z]) => [x *  1, y * -1, z *  1],
    ([x, y, z]) => [x *  1, y *  1, z * -1],
    ([x, y, z]) => [x *  1, y *  1, z *  1],
].flatMap(rot => {
    return [
        ([x, y, z]) => rot([x, y, z]),
        ([x, z, y]) => rot([x, y, z]),
        ([y, x, z]) => rot([x, y, z]),
        ([y, z, x]) => rot([x, y, z]),
        ([z, x, y]) => rot([x, y, z]),
        ([z, y, x]) => rot([x, y, z]),
    ];
});

function rotateBeacon(b, rot) {
    return rotations[rot](b);
}

function rotateScanner(scanner, rot) {
    return scanner.map(b => rotateBeacon(b, rot));
}

function shiftBeacon([x, y, z], [dx, dy, dz]) {
    return [x+dx, y+dy, z+dz];
}

function shiftScanner(scanner, shift) {
    return scanner.map(b => shiftBeacon(b, shift));
}

function arrayEquals(a1, a2, len) {
    if (len == null) {
        len = a1.length;
    }
    for (let i = 0; i < len; i++) {
        if (a1[i] !== a2[i]) {
            return false;
        }
    }
    return true;
}

function overlapScanners(s1, s2, len) {
    return s1.filter(b1 => {
        return s2.find(b2 => arrayEquals(b1, b2, len)) != null;
    });
}

function joinBeacons(s1, s2) {
    let result = [...s1];
    let set = new Set(result.map(b => JSON.stringify(b)));
    for (let i = 0; i < s2.length; i++) {
        let b = s2[i];
        let bKey = JSON.stringify(b);
        if (set.has(bKey)) {
            continue;
        }
        set.add(bKey);
        result.push(b);
    }
    return result;
}

function ds(s1, s2, pos, f = () => true) {
    let counts = {};
    for (let b2 of s2) {
        for (let b1 of s1) {
            if (!f(b1, b2)) {
                continue;
            }
            let d = b1[pos] - b2[pos];
            counts[d] = (counts[d] || 0) + 1;
        }
    }
    return Object.entries(counts)
                 .map(([d, count]) => count >= 12 ? parseInt(d) : null)
                 .filter(v => v !== null);
}

function placeScanner(s1, s2) {
    for (let rot in rotations) {
        let rotatedS2 = rotateScanner(s2, rot);
        let dxs = ds(s1, rotatedS2, 0);
        let dys = ds(s1, rotatedS2, 1, (b1, b2) => dxs.indexOf(b1[0] - b2[0]) > -1);
        let dzs = ds(s1, rotatedS2, 2, (b1, b2) => dys.indexOf(b1[1] - b2[1]) > -1);
        for (let dx of dxs) {
            for (let dy of dys) {
                for (let dz of dzs) {
                    let shift = [dx, dy, dz];
                    let rotatedAndShiftedS2 = shiftScanner(rotatedS2, shift);
                    let curOverlap = overlapScanners(s1, rotatedAndShiftedS2);
                    if (curOverlap.length >= 12) {
                        return [rotatedAndShiftedS2, rot, shift];
                    }
                }
            }
        }
    }
    return null;
}

function part1(groups) {
    let scanners = parse(groups);
    let map = scanners[0];
    let seen = new Map();
    seen.set(0, b => b);
    let exhaustedSet = new Set();
    outer: while (true) {
        for (let [j, prevMove] of seen) {
            if (exhaustedSet.has(j)) { continue; }
            let prevScanner = scanners[j];
            for (let i = 0; i < scanners.length; i++) {
                if (seen.has(i)) {
                    continue;
                }
                let placed = placeScanner(prevScanner, scanners[i]);
                if (placed == null) {
                    continue;
                }
                let [rotatedAndShifted, rot, shift] = placed;
                map = joinBeacons(map, rotatedAndShifted.map(b => prevMove(b)));
                seen.set(i, b => prevMove(shiftBeacon(rotateBeacon(b, rot), shift)));
                continue outer;
            }
            exhaustedSet.add(j);
        }
        if (seen.size === scanners.length) {
            break;
        }
        console.log('seen', Array.from(seen.keys()).sort((a, b) => a - b));
        throw `Could not place a single scanner`;
    }
    // console.log(map.map(b => b.join(',')).join('\n'));

    return [map.length, Array.from(seen.values())];
}

function dist(b1, b2) {
    let result = 0;
    for (let i = 0; i < b1.length; i++) {
        result += Math.abs(b1[i] - b2[i]);
    }
    return result;
}

function part2(seen) {
    let coords = seen.map(m => m([0, 0, 0]));
    let maxDist = -Infinity;
    for (let i = 0; i < coords.length - 1; i++) {
        for (let j = i + 1; j < coords.length; j++) {
            maxDist = Math.max(maxDist, dist(coords[i], coords[j]));
        }
    }
    return maxDist;
}

main();
