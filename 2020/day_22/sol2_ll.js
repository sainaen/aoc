#!/usr/bin/env node

let fs = require("fs");
let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n\n")
	.filter((v) => v)
	.map((v) => {
		let [player, ...cards] = v
			.split("\n")
			.map((l) => l.trim())
			.filter((l) => l);
		return cards
			.map((c) => parseInt(c, 10))
			.reduce((ll, c) => push(ll, c), null);
	});

// console.log(`read in ${input.length} records...`);
// console.log(input);

function size(head) {
	return head ? head.size : 0;
}

function head(head) {
	return head.val;
}

function shift(head) {
	let next = head.next;
	if (next) {
		next.tail = head.tail;
		next.size = head.size - 1;
	}
	return next;
}

function push(head, val) {
	let t = { val: val };
	if (!head) {
		t.size = 1;
		t.tail = t;
		return t;
	} else {
		head.tail.next = t;
		head.tail = t;
		head.size += 1;
		return head;
	}
}

function take(head, n) {
	let result = null;
	let cur = head;
	while (!result || size(result) < n) {
		result = push(result, cur.val);
		cur = cur.next;
	}
	return result;
}

function reduce(head, fn, start) {
	let res = start;
	let cur = head;
	for (let i = 0; cur; i++) {
		res = fn(res, cur.val, i, start);
		cur = cur.next;
	}
	return res;
}

let [p1, p2] = input;

function join(head, sep) {
	return reduce(
		head,
		(res, val, i) => {
			if (i != 0) {
				res += sep;
			}
			res += String(val);
			return res;
		},
		""
	);
}

function key(p1, p2) {
	return join(p1, ",") + "|" + join(p2, ",");
}

function p(p) {
	return reduce(
		p,
		(res, c, i) => {
			if (i > 0) {
				res += ", ";
			}
			res += c.toString().padStart(2, " ");
			return res;
		},
		""
	);
}

const p1Won = 1;
const p2Won = -1;

let cache = new Map();
function playCached(p1, p2) {
	let k = key(p1, p2);
	if (!cache.has(k)) {
		cache.set(k, play(p1, p2));
	}
	return cache.get(k);
}

function play(p1, p2) {
	let seen = new Set();
	let limit = 10_000_000;
	for (let i = 0; i < limit; i++) {
		if (i == limit - 1) {
			console.error(`${t} Out of loops!`);
		}
		let k = key(p1, p2);
		if (seen.has(k)) {
			return [p1Won, p1];
		}
		seen.add(k);

		let p1c = head(p1), p2c = head(p2);
		p1 = shift(p1);
		p2 = shift(p2);

		let roundResult, winner;
		if (p1c <= size(p1) && p2c <= size(p2)) {
			[roundResult, winner] = playCached(take(p1, p1c), take(p2, p2c));
		} else if (p1c > p2c) {
			roundResult = p1Won;
		} else {
			roundResult = p2Won;
		}

		if (roundResult == p1Won) {
			p1 = push(p1, p1c);
			p1 = push(p1, p2c);
		} else {
			p2 = push(p2, p2c);
			p2 = push(p2, p1c);
		}

		if (size(p1) == 0) {
			return [p2Won, p2];
		}
		if (size(p2) == 0) {
			return [p1Won, p1];
		}
	}
	console.error(`${t} No winner determined in ${limit} rounds`);
	return [0, null];
}

let [_, winner] = play(p1, p2);
let result = reduce(winner, (res, c, pos) => res + c * (size(winner) - pos), 0);

console.log(`Result: ${result}`);
