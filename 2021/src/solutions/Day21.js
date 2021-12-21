#!/usr/bin/env node

/*
      -------Part 1--------   --------Part 2--------
Day       Time  Rank  Score       Time   Rank  Score
 21   00:15:05  1460      0   13:38:39  10172      0
 */

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = {1: 5, 2: 10};
    let sample1 = {1: 4, 2: 8};

    let expected1_1 = 739785;
    console.log(`Sample: ${part1(sample1)} (expected: ${expected1_1})`);
    console.log(`Result: ${part1(input)}`);

    console.log("---")

    let expected1_2 = 444356092776315;
    console.log(`Sample: ${part2(sample1)} (expected: ${expected1_2})`);
    console.log(`Result: ${part2(input)}`);
}

let dieRolls;
let dieValue;

function resetDie() {
    dieValue = 1;
    dieRolls = 0;
}

function rollDie() {
    let result = dieValue;
    if (dieValue === 100) {
        dieValue = 1;
    } else {
        dieValue += 1;
    }
    dieRolls += 1;
    return result;
}

function newPos(curPos, move) {
    let result = curPos + move;
    let mod = result % 10;
    return mod === 0 ? 10 : mod;
}

function part1(startingPositions) {
    resetDie();

    let positions = {...startingPositions};
    let scores = Object.fromEntries(Object.entries(positions).map(([p, _]) => [p, 0]));

    outer: while (true) {
        for (let player in positions) {
            let move = rollDie() + rollDie() + rollDie();
            positions[player] = newPos(positions[player], move);
            scores[player] += positions[player];
            if (Object.values(scores).some(v => v >= 1000)) {
                break outer;
            }
        }
    }

    return dieRolls * Math.min(...Object.values(scores));
}

let diracDieMoves = (() => {
    let result = [];
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            for (let k = 1; k <= 3; k++) {
                result.push(i + j + k);
            }
        }
    }
    return result;
})();

function part2(startingPositions) {
    let positions = Object.values(startingPositions);

    let maxScore = 21;
    let maxPos = 10;

    let universes = [];
    for (let p1Score = maxScore - 1; p1Score >= 0; p1Score--) {
        universes[p1Score] = [];
        for (let p2Score = maxScore - 1; p2Score >= 0; p2Score--) {
            universes[p1Score][p2Score] = [];
            for (let p1Pos = 1; p1Pos <= maxPos; p1Pos++) {
                universes[p1Score][p2Score][p1Pos] = [];
                for (let p2Pos = 1; p2Pos <= maxPos; p2Pos++) {
                    let currentUniverse = {p1: 0, p2: 0};
                    for (let p1Move of diracDieMoves) {
                        let p1NextPos = newPos(p1Pos, p1Move);
                        let p1NextScore = Math.min(maxScore, p1Score + p1NextPos);
                        if (p1NextScore === maxScore) {
                            currentUniverse.p1 += 1;
                            continue;
                        }
                        for (let p2Move of diracDieMoves) {
                            let p2NextPos = newPos(p2Pos, p2Move);
                            let p2NextScore = Math.min(maxScore, p2Score + p2NextPos);
                            if (p2NextScore === maxScore) {
                                currentUniverse.p2 += 1;
                                continue;
                            }
                            let {p1: futureP1, p2: futureP2} = universes[p1NextScore][p2NextScore][p1NextPos][p2NextPos];
                            currentUniverse.p1 += futureP1 || 0;
                            currentUniverse.p2 += futureP2 || 0;
                        }
                    }
                    universes[p1Score][p2Score][p1Pos][p2Pos] = currentUniverse;
                }
            }
        }
    }
    let {p1, p2} = universes[0][0][positions[0]][positions[1]];
    return Math.max(p1, p2);
}

main();
