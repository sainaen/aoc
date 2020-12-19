#!/usr/bin/env node

let fs = require("fs");
let [rules, msgs] = fs
	.readFileSync("./input", "utf-8")
	.split("\n\n")
	.filter((v) => v);

console.log(`read in ${rules.length} records...`);
console.log(rules.substring(0, 10));

rules = rules.split("\n").map(r => {
	let [name, val] = r.split(':').map(v => v.trim()).filter(v => v);
	let opts = val.split('|').map(v => v.trim()).filter(v => v).map(o => {
		return o.split(' ').map(ov => {
			if (ov[0] == '"') {
				return {val: ov.substring(1,2)};
			}
			return {rule: ov};
		});
	})
	return {name, opts}
}).reduce((res, r) => {
	res[r.name] = r;
	return res;
}, {});

msgs = msgs.split('\n').filter((v) => v)

console.log(JSON.stringify(rules, null, '  '));
// console.log(msgs)

function matches(rule, msg, pos) {
	if (rule.opts[0][0].val) {
		return [rule.opts[0][0].val == msg[pos], pos+1];
	}
	for (let opt of rule.opts) {
		let optResult = true;
		let optPos = pos;
		for (let o of opt) {
			let [oResult, oPos] = matches(rules[o.rule], msg, optPos);
			if (!oResult) {
				optResult = false;
				break;
			}
			optResult &= oResult;
			optPos = oPos;
		}
		if (optResult) {
			return [true, optPos]
		}
	}
	return [false, pos];
}

let result = msgs.filter(msg => {
	let [match,pos] = matches(rules["0"], msg, 0)
	return match && pos == msg.length;
}).length

console.log(`Result: ${result}`);
