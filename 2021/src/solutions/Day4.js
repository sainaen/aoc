#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
  4   00:19:38  1171      0   00:45:06  3017      0
 */

let utils = require("../utils/utils");

function main() {
    let input = utils.day(4, false);
    let sample1 = utils.sample(4, false);

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

