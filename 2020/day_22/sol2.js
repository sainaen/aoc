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
		cards.reverse();
		return cards.map((c) => parseInt(c, 10));
	});

console.log(`read in ${input.length} records...`);
console.log(input);

let [p1, p2] = input;

function key(p1, p2) {
	return p1.join(",") + "|" + p2.join(",");
}

function n(n) {
	return (1 + n).toString().padStart(5, " ");
}

function p(p) {
	return p.map((c) => c.toString().padStart(2, " ")).join(", ");
}

let debug = 0;
function d(...m) {
	debug && console.log(...m);
}

const p1Won = 1;
const p2Won = -1;

let game = 0;

let cache = new Map();
function playCached(p1, p2) {
	let k = key(p1, p2);
	let result;
	if (cache.has(k)) {
		result = cache.get(k);
		d(`Avoided playing game ${game++}`);
	} else {
		result = play(p1, p2);
		cache.set(k, result);
	}
	return result;
}

function play(p1, p2) {
	let gameId = game++;
	d(`Playing game ${1 + gameId}`);
	let seen = new Set();
	let limit = 10_000_000;
	for (let i = 0; i < limit; i++) {
		let t = `${n(gameId)}|${n(i)}:`;
		if (i == limit - 1) {
			console.error(`${t} Out of loops!`);
		}
		d(`${t} p1: ${p(p1)}`);
		d(`${t} p2: ${p(p2)}`);
		let k = key(p1, p2);
		if (seen.has(k)) {
			d(`${t} Configuration ${k} already seen, p1 wins`);
			// p1 won automatically
			return p1Won;
		}
		seen.add(k);

		let p1c = p1.pop();
		let p2c = p2.pop();

		d(`${t} p1c: `, p1c);
		d(`${t} p2c: `, p2c);

		let roundResult;
		if (p1c <= p1.length && p2c <= p2.length) {
			roundResult = playCached(
				p1.slice(p1.length - p1c, p1.length),
				p2.slice(p2.length - p2c, p2.length)
			);
		} else if (p1c > p2c) {
			roundResult = p1Won;
		} else {
			roundResult = p2Won;
		}

		if (roundResult == p1Won) {
			d(`${t} p1 won`);
			p1.unshift(p1c);
			p1.unshift(p2c);
		} else {
			d(`${t} p2 won`);
			p2.unshift(p2c);
			p2.unshift(p1c);
		}

		if (p1.length == 0) {
			d(`${t} p2 won the game`);
			return p2Won;
		}
		if (p2.length == 0) {
			d(`${t} p1 won the game`);
			return p1Won;
		}
		d("");
	}
	console.error(
		`${t} No winner determined in ${limit} rounds`
	);
	return 0;
}

let winner = play(p1, p2) == p1Won ? p1 : p2;
let result = winner.reduce((res, c, pos) => res + c * (pos + 1), 0);

console.log(`Result: ${result}`);
