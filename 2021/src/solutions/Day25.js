#!/usr/bin/env node

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.day(25);
    let sample1 = utils.sample(`
    v...>>.vv>
    .vv>>.vv..
    >>.>v>...v
    >>v>>.>.v.
    v>v.vv.v..
    >.>>..v...
    .vv..>.>v.
    v.v..>>v.v
    ....v..v.>
    `);

    let expected1_1 = 58;
    console.log(`Sample: ${part1(sample1)} (expected: ${expected1_1})`);
    console.log(`Result: ${part1(input)}`);
}

function step(field) {
    function nextPos(i, j, c) {
        if (c === ">") {
            if (j + 1 < field[i].length) {
                return [i, j + 1];
            } else {
                return [i, 0];
            }
        } else {
            if (i + 1 < field.length) {
                return [i + 1, j];
            } else {
                return [0, j];
            }
        }
    }

    function move(c, field) {
        let result = field.map(r => r.map(v => v === c ? '.' : v));
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[i].length; j++) {
                if (field[i][j] === c) {
                    let [nextI, nextJ] = nextPos(i, j, c);
                    if (field[nextI][nextJ] === '.') {
                        result[nextI][nextJ] = c;
                    } else {
                        result[i][j] = c;
                    }
                }
            }
        }
        return result;
    }

    return move("v", move(">", field));
}

function same(f1, f2) {
    for (let i = 0; i < f1.length; i++) {
        for (let j = 0; j < f1[i].length; j++) {
            if (f1[i][j] !== f2[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function part1(strings) {
    let field = strings.map(r => r.split(''));

    let result = 0;
    for (let i = 1; i < 10_000; i++) {
        let nextField = step(field);
        if (same(field, nextField)) {
            result = i;
            break;
        }
        field = nextField;
    }

    return result;
}

main();
