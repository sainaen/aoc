#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
  4   00:19:38  1171      0   00:45:06  3017      0
 */

let utils = require("../utils/utils");

function main() {
    let input = utils.day(4, false);
    let sample1 = utils.sample(`
    7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

    22 13 17 11  0
     8  2 23  4 24
    21  9 14 16  7
     6 10  3 18  5
     1 12 20 15 19

     3 15  0  2 22
     9 18 13 17  5
    19  8  7 25 23
    20 11 10 24  4
    14 21 16 12  6

    14 21 17 24  4
    10 16 15  9 19
    18  8 23 26 20
    22 11 13  6  5
     2  0 12  3  7
    `, false);

    console.log(`Sample: ${part1(sample1)}`)
    console.log(`Result: ${part1(input)}`)

    console.log("---")

    console.log(`Sample: ${part2(sample1)}`)
    console.log(`Result: ${part2(input)}`)
}

function isWinning(board, numbers) {
    for (let row = 0; row < board.length; row++) {
        let rowWinning = board[row].filter(n => numbers.indexOf(n) > -1).length === board[row].length;
        if (rowWinning) {
            return true;
        }
    }
    for (let col = 0; col < board[0].length; col++) {
        let colWinning = board.filter(r => numbers.indexOf(r[col]) > -1).length === board.length;
        if (colWinning) {
            return true;
        }
    }
    return false;
}

function part1(strings) {
    let parts = strings.join('\n').split('\n\n');

    let numbers = parts.shift().split(',').map(v => parseInt(v, 10));

    let boards = parts.filter(v => v).map(block => {
        return block.split('\n').map(l => l.split(/\s+/).filter(v => v).map(v => parseInt(v.trim(), 10))).filter(v => v.length);
    })

    let winner;
    let roundNums;
    for (let i = 1; i < numbers.length; i++) {
        roundNums = numbers.slice(0, i);
        winner = boards.filter(b => isWinning(b, roundNums))
        if (winner.length === 1) {
            winner = winner[0]
            break;
        }
    }

    let result = findUnmarked(winner, roundNums).reduce((a,b) => a + b);
    result *= roundNums[roundNums.length - 1];

    return result;
}

function findUnmarked(board, numbers) {
    let result = [];
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (numbers.indexOf(board[row][col]) === -1) {
                result.push(board[row][col]);
            }
        }
    }
    return result;
}

function part2(strings) {
    let parts = strings.join('\n').split('\n\n');

    let numbers = parts.shift().split(',').map(v => parseInt(v, 10));

    let boards = parts.filter(v => v).map(block => {
        return block.split('\n').map(l => l.split(/\s+/).filter(v => v).map(v => parseInt(v.trim(), 10))).filter(v => v.length);
    })

    let lastWinner;
    let lastWinningNumbers;
    let roundNums;
    for (let i = 1; i < numbers.length; i++) {
        if (boards.length === 0) {
            break;
        }
        roundNums = numbers.slice(0, i);
        let winner = boards.findIndex(b => isWinning(b, roundNums));
        while (winner > -1) {
            lastWinner = boards[winner];
            lastWinningNumbers = roundNums;
            boards.splice(winner, 1)
            winner = boards.findIndex(b => isWinning(b, roundNums));
        }
    }

    let result = findUnmarked(lastWinner, lastWinningNumbers).reduce((a,b) => a + b, 0);
    result *= lastWinningNumbers[lastWinningNumbers.length - 1];

    return result;
}

main();

