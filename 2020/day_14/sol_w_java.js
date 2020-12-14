#!/usr/bin/env node

let fs = require("fs");

function maskToFun(mask) {
	let setBits = mask.split("").map((b, i) => {
		if (b == "1") {
			return (v) => {
				v[i] = 1;
				return v;
			};
		} else if (b == "0") {
			return (v) => {
				v[i] = 0;
				return v;
			};
		} else {
			return (v) => v;
		}
	});
	return (v) => {
		for (let fn of setBits) {
			v = fn(v);
		}
		return v;
	};
}

let memSetR = /^mem\[(\d+)\]\s*=\s*(\d+)$/;
let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		let match = v.match(memSetR);
		if (match != null) {
			return {
				op: "write",
				addr: match[1],
				val: parseInt(match[2], 10)
					.toString(2)
					.padStart(36, "0")
					.split("")
					.map((s) => parseInt(s, 10)),
			};
		} else if (v.indexOf("mask = ") == 0) {
			let m = maskToFun(v.substring("mask = ".length));
			return { op: "mask", val: m };
		} else {
			console.error(`Unknown op: ${v}`);
		}
		return v;
	});

console.log(`read in ${input.length} records...`);
console.log(input.slice(0, 10));

let mem = {};
let mask = (v) => v;
for (let a of input) {
	if (a.op == "mask") {
		mask = a.val;
	} else if (a.op == "write") {
		mem[a.addr] = mask(a.val);
		// console.log(a.val)
		// console.log(mem[a.addr])
	}
}
let result = [];
for (let k in mem) {
	result.push(`Long.parseLong("${mem[k].join('')}", 2)`);
}

console.log(`Result (paste it in a jshell):\n${result.join(' + \n')}`);
