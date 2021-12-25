#!/usr/bin/env node

let utils = require("../utils/utils");
let {last, longs, remove, swap} = utils;

function main() {
    let input = utils.day(24);

    console.log(`Result: ${part1(input)}`);

    console.log("---")

    console.log(`Result: ${part2(input)}`);
}

function stateToKey(s) {
    return s.z + "|" + s.w;
}

let ops = {
    'eql': (a, b) => a === b ? 1n : 0n,
    'mul': (a, b) => a * b,
    'add': (a, b) => a + b,
    'div': (a, b) => a / b,
    'mod': (a, b) => a % b,
};

let debug = false;
let maxReasonableZ = 26n * 26n * 26n;

function compute(program, isFirstInputBetter) {
    let states = [
        {x: 0n, y: 0n, z: 0n, w: 0n, input: 0n}
    ];

    for (let pc = 0; pc < program.length; pc++) {
        let instruction = program[pc];
        let originalStatesLen = states.length;
        debug && console.log(`@${pc + 1}/${program.length}: ${instruction}  \t| states.length=${originalStatesLen}`);
        let [op, lhs, rhs] = instruction.split(' ');
        if (op === "inp") {
            let nextStates = new Map();
            for (let state of states) {
                if (state.z > maxReasonableZ) {
                    continue;
                }
                for (let input = 9n; input >= 1n; input--) {
                    let newState = {x: 0n, y: 0n, z: state.z, w: input, input: state.input * 10n + input};
                    let k = stateToKey(newState);
                    if (!nextStates.has(k)) {
                        nextStates.set(k, newState);
                        continue;
                    }
                    let prevState = nextStates.get(k);
                    if (isFirstInputBetter(newState.input, prevState.input)) {
                        nextStates.set(k, newState);
                    }
                }
            }
            states = Array.from(nextStates.values());
            debug && console.log(`a${pc + 1}/${program.length}: ${instruction}  \t| states.length=${states.length} (trimmed ${originalStatesLen * 9 - states.length})`);
            continue;
        }
        let rhsVal = null;
        if (rhs !== "x" && rhs !== "y" && rhs !== "z" && rhs !== "w") {
            rhsVal = BigInt(parseInt(rhs, 10));
        }
        for (let state of states) {
            let stateRhs = rhsVal !== null ? rhsVal : state[rhs];
            try {
                state[lhs] = ops[op](state[lhs], stateRhs);
            } catch (e) {
                console.log(pc, instruction, op, lhs, stateRhs, state);
                throw e;
            }
        }
    }

    let best = null;
    for (let state of states) {
        if (state.z !== 0n) {
            continue;
        }
        debug && console.log(state);
        best = isFirstInputBetter(best, state.input) ? best : state.input;
    }
    return best;
}

function part1(program) {
    return compute(program, (prev, v) => prev != null && prev > v);
}

function part2(program) {
    return compute(program, (prev, v) => prev != null && prev < v);
}

main();
