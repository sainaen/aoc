#!/usr/bin/env node

let fs = require("fs");

function maskToFun(mask) {
	let setBits = mask.split("").map((b, i) => {
		if (b == "1") {
			return (v) => {
				v[i] = 1;
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
		let addrs = [v];
		mask.split('').forEach((b, i) => {
			if (b != 'X') {
				return;
			}
			let result = [];
			for (let j = 0; j < addrs.length; j++) {
				let addr = addrs[j];
				let c0 = addr.slice(0)
				c0[i] = 0;
				result.push(c0)
				let c1 = addr.slice(0)
				c1[i] = 1;
				result.push(c1)
			}
			addrs = result;
		});
		return addrs;
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
				addr: parseInt(match[1], 10).toString(2).padStart(36, "0").split("").map(s => parseInt(s, 10)),
				val: parseInt(match[2], 10),
			};
		} else if (v.indexOf("mask = ") == 0) {
			let m = v.substring("mask = ".length);
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
		mask = maskToFun(a.val);
	} else if (a.op == "write") {
		for (let addr of mask(a.addr)) {
			// console.log(`writting to ${addr} = ${a.val}`)
			mem[addr.join('')] = a.val
		}
	}
}

console.log(`In memory ${Object.keys(mem).length} values`)

let result = 0;
for (let k in mem) {
	result += mem[k];
}

console.log(`Result: ${result}`);
