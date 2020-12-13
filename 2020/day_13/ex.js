#!/usr/bin/env node

function asCells(vs, sep=' | ') {
	return vs.map(v => v.toString(10).padStart(3, ' ')).join(sep)
}

function check(bs, t) {
	return bs.filter((b,i) => b == 'x' || (t + i) % b == 0).length == bs.length;
}

// let bs = [3,'x',5,7,'x',11]
let bs = [7,'x',13,19]

let n = 1_000;

let is = Array(n).fill(null).map((_, i) => i)
console.log(asCells(is))
console.log(asCells(Array(n).fill('-')))

bs.forEach((b, j) => {
	if (b != 'x') {
		console.log(asCells(is.map(i => (i % b == 0) ? b : '')))
	}
})

console.log(asCells(is.map(i => {
	if (check(bs, i)) {
		return '^^^'
	}
	return ''
}), '   '))