#!/usr/bin/env node

let fs = require("fs");

let splitter = new RegExp("s+", "s");
let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n\n")
	.filter((v) => v)
	.map((v) =>
		v
			.split(/\s+/)
			.map((s) =>
				s.split("\n").map((f) => {
					let [n, v] = f.split(":");
					return { n, v };
				})
			)
			.flat()
			.reduce((r, { n, v }) => {
				r[n] = v;
				return r;
			}, {})
	);

console.log(`read in ${input.length} records...`);

let eclValues = new Set(["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]);

let mandatoryFields = [
	{
		n: "byr",
		check: (v) => {
			return (
				/^\d{4}$/.test(v) &&
				parseInt(v, 10) >= 1920 &&
				parseInt(v, 10) <= 2002
			);
		},
	},
	{
		n: "iyr",
		check: (v) => {
			return (
				/^\d{4}$/.test(v) &&
				parseInt(v, 10) >= 2010 &&
				parseInt(v, 10) <= 2020
			);
		},
	},
	{
		n: "eyr",
		check: (v) => {
			return (
				/^\d{4}$/.test(v) &&
				parseInt(v, 10) >= 2020 &&
				parseInt(v, 10) <= 2030
			);
		},
	},
	{
		n: "hgt",
		check: (v) => {
			let m = v.match(/^\d+(cm|in)$/);
			if (!m) {
				return false;
			}
			let n = parseInt(v, 10);
			if (m[1] == "cm") {
				return 150 <= n && n <= 193;
			}
			if (m[1] == "in") {
				return 59 <= n && n <= 76;
			}
			return false;
		},
	},
	{
		n: "hcl",
		check: (v) => {
			return /^\#[0-9a-f]{6}$/.test(v);
		},
	},
	{
		n: "ecl",
		check: (v) => {
			return eclValues.has(v);
		},
	},
	{
		n: "pid",
		check: (v) => {
			return /^\d{9}$/.test(v);
		},
	},
];

let optionalFields = new Set(["cid"]);

let count = 0;

outer: for (let p of input) {
	for (let f of mandatoryFields) {
		let v = p[f.n];
		if (v == null || !f.check(v)) {
			continue outer;
		}
	}
	count += 1;
}

console.log(count);
