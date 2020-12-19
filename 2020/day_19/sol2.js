#!/usr/bin/env node

let fs = require("fs");
let [rules, msgs] = fs
	.readFileSync("./input", "utf-8")
	.split("\n\n")
	.filter((v) => v);

console.log(`read in ${rules.length} records...`);
console.log(rules.substring(0, 10));

rules = rules
	.split("\n")
	.map((r) => {
		let [name, val] = r
			.split(":")
			.map((v) => v.trim())
			.filter((v) => v);
		let opts = val
			.split("|")
			.map((v) => v.trim())
			.filter((v) => v)
			.map((o) => {
				return o.split(" ").map((ov) => {
					if (ov[0] == '"') {
						return { val: ov.substring(1, 2) };
					}
					return { rule: ov };
				});
			});
		return { name, opts };
	})
	.reduce((res, r) => {
		res[r.name] = r;
		return res;
	}, {});

msgs = msgs.split("\n").filter((v) => v);

function inlineRules(rules, name) {
	let rule = rules[name];
	if (rule.opts[0][0].val) {
		return rule.opts[0][0].val;
	}
	let lhs = rule.opts[0].map((r) => inlineRules(rules, r.rule)).join("");
	if (rule.opts.length > 1) {
		let rhs = rule.opts[1].map((r) => inlineRules(rules, r.rule)).join("");
		return `(${lhs}|${rhs})`;
	}
	return lhs;
}

let m42 = inlineRules(rules, "42");
let m31 = inlineRules(rules, "31");

function matches(msg) {
	let c31 = 0;
	let r31Matches = false;
	let suffix;
	do {
		suffix = `(${m31}){${c31 + 1}}$`;
		r31Matches = RegExp(suffix).test(msg);
		if (r31Matches) {
			c31 += 1;
		}
	} while (r31Matches);
	if (c31 == 0) {
		return false;
	}
	let matcher = RegExp(`^(${m42})+(${m42}){${c31}}(${m31}){${c31}}$`);
	// console.log(matcher);
	return matcher.test(msg);
}

let result = msgs.filter(matches).length;

console.log(`Result: ${result}`);
