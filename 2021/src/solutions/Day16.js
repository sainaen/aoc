#!/usr/bin/env node

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
 16   00:56:48  1603      0   01:10:02  1433      0
*/

let utils = require("../utils/utils");

let bits = {
   "0": '0000',
   "1": '0001',
   "2": '0010',
   "3": '0011',
   "4": '0100',
   "5": '0101',
   "6": '0110',
   "7": '0111',
   "8": '1000',
   "9": '1001',
   "A": '1010',
   "B": '1011',
   "C": '1100',
   "D": '1101',
   "E": '1110',
   "F": '1111'
};

function main() {
    let input = utils.day(16);

    console.log(`Result: ${part1(input)}`);

    console.log("---")

    console.log(`Result: ${part2(input)}`);
}

let debug = false;

function toBits(str) {
    let result = [];
    for (let i = 0; i < str.length; i++) {
        let c = str[i];
        if (!(c in bits)) {
            throw `unexpected c: ${c}`;
        }
        result.push.apply(result, [...bits[c]]);
    }
    return result;
}

function take(a, n, start=0) {
    return a.slice(start, start + n);
}

function parseBits(bits) {
    return parseInt(bits.join(''), 2);
}

function decode(bits, pos, n) {
    return parseBits(take(bits, n, pos));
}

function decodeLiteral(bits, pos) {
    debug && console.log(bits, pos)
    let result = [];
    let start = pos;
    while (bits[pos] === '1') {
        debug && console.log(result, pos, bits[pos])
        pos += 1;
        result.push.apply(result, [...take(bits, 4, pos)])
        pos += 4;
    }
    // advance past the last part
    pos += 1;
    result.push.apply(result, [...take(bits, 4, pos)])
    pos += 4;
    return [parseBits(result), pos - start];
}

function parseOperator(bits, pos) {
    let start = pos;
    let lenBit = bits[pos++];
    if (lenBit === '0') {
        let subLen = parseBits(take(bits, 15, pos));
        pos += 15;
        debug && console.log(`lenBit=0, parsing len=${subLen}`);
        let [subPackets, _] = parse(bits, pos, pos + subLen);
        pos += subLen; // skip sub-packets
        return [{subPackets}, pos - start];
    } else {
        let subNum = parseBits(take(bits, 11, pos));
        pos += 11;
        debug && console.log(`lenBit=1, parsing n=${subNum}`);
        let [subPackets, subLen] = parseN(bits, pos, subNum);
        pos += subLen;
        return [{subPackets}, pos - start];
    }
}

function parsePacket(bits, pos) {
    debug && console.log(`decoding packet at ${pos}`, bits.slice(pos));
    let start = pos;
    let version = decode(bits, pos, 3);
    pos += 3;
    let type = decode(bits, pos, 3);
    pos += 3;
    debug && console.log(`found version=${version}, type=${type}`)
    if (type === 4) {
        let [literal, len] = decodeLiteral(bits, pos);
        debug && console.log(`found literal at ${pos} (until ${pos + len}): ${literal}`);
        pos += len;
        return [{version, type, literal}, pos - start];
    } else {
        let [operator, len] = parseOperator(bits, pos);
        debug && console.log(`found operator at ${pos} (until ${pos + len}):`, operator);
        pos += len;
        return [{version, type, operator}, pos - start];
    }
}

function reachedEnd(bits, pos, end) {
    return bits.slice(pos, end).every(b => b === '0');
}

function parseN(bits, start, n) {
    let packets = [];
    let pos = start;
    for (let count = 0; count < n; count++) {
        let [res, len] = parsePacket(bits, pos);
        pos += len;
        packets.push(res);
    }
    return [packets, pos - start];
}

function parse(bits, start, end) {
    let packets = [];
    for (let pos = start; pos < end;) {
        let [res, len] = parsePacket(bits, pos);
        pos += len;
        packets.push(res);
        if (reachedEnd(bits, pos)) {
            debug && console.log(`only tail remains at ${pos}, skipping`, bits.slice(pos));
            pos = end;
            break;
        }
    }
    return [packets, end - start];
}

function part1(strings) {
    let bits = toBits(strings[0]);
    let [packets, len] = parse(bits, 0, bits.length);
    // console.log(JSON.stringify(packets, null, 2));
    let queue = [...packets];
    let result = 0;
    while (queue.length > 0) {
        let packet = queue.pop();
        result += packet.version;
        if (packet.operator && packet.operator.subPackets) {
            queue.push.apply(queue, [...packet.operator.subPackets]);
        }
    }
    return result;
}

function processSubPackets(subPackets, combine, initial) {
    let result = initial;
    for (let subPacket of subPackets) {
        let v = interpretPacket(subPacket);
        result = combine(result, v);
    }
    return result;
}

let packetTypes = {
    0: p => processSubPackets(p.operator.subPackets, (res, v) => res + v, 0),
    1: p => processSubPackets(p.operator.subPackets, (res, v) => res * v, 1),
    2: p => processSubPackets(p.operator.subPackets, (res, v) => Math.min(res, v), Infinity),
    3: p => processSubPackets(p.operator.subPackets, (res, v) => Math.max(res, v), -Infinity),
    4: p => p.literal,
    5: p => {
        let [lhs, rhs] = p.operator.subPackets.map(subPacket => interpretPacket(subPacket));
        return lhs > rhs ? 1 : 0
    },
    6: p => {
        let [lhs, rhs] = p.operator.subPackets.map(subPacket => interpretPacket(subPacket));
        return lhs < rhs ? 1 : 0
    },
    7: p => {
        let [lhs, rhs] = p.operator.subPackets.map(subPacket => interpretPacket(subPacket));
        return lhs === rhs ? 1 : 0
    },
};


function interpretPacket(packet) {
    let packetOp = packetTypes[packet.type];
    if (!packetOp) {
        throw `unexpected packet type: ${packet.type}`;
    }
    return packetOp(packet);
}

function part2(strings) {
    let bits = toBits(strings[0]);
    let [packets, len] = parse(bits, 0, bits.length);
    // console.log(JSON.stringify(packets, null, 2));
    return interpretPacket(packets[0]);
}

main();
