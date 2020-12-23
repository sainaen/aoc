#!/usr/bin/env node

let fs = require("fs");
let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => {
		return v.split('').map(c => parseInt(c, 10));
	})
	.flat();

console.log(`read in ${input.length} records...`);
console.log(input);

function cut(a, from, len=3) {
	if (from < a.length - len) {
		return a.splice(from, len);
	}
	let result = a.splice(from, len);
	if (result.length < len) {
		result.push(...a.splice(0, len - result.length));
	}
	return result;
}

function insert(a, from, vals) {
	a.splice(from, 0, ...vals);
	return a;
}

let val = [...input].sort((a,b) => b - a)[0];
let cups = Array(1_000_000).fill(-1).map((_, i) => i < input.length ? input[i] : ++val)
let sortedCups = [...cups].sort((a,b) => a - b);
let min4 = sortedCups.slice(0, 4);
let max4 = sortedCups.slice(sortedCups.length - 4);
console.log(`Cups: ${cups.slice(0, 20).join(', ')}`)

function append(head, val) {
	let t = {val}
	if (!head) {
		t.prev = t;
		t.next = t;
		return t;
	} else {
		let tail = head.prev;
		head.prev = t;
		t.next = head;
		t.prev = tail;
		tail.next = t;
		return head;
	}
}

function find_ll(head, val) {
	// console.log(`find_ll(${head.val}, ${val})`)
	let cur = head;
	do {
		if (cur.val == val) {
			return cur;
		}
		cur = cur.next;
	} while (cur != head);
	return null;
}

function cut_ll(head, len=3) {
	let resultHead = head.next;
	let newNext = head.next;
	for (let i = 0; i < len; i++) {
		newNext = newNext.next;
	}
	let resultTail = newNext.prev;

	head.next = newNext;
	newNext.prev = head;

	resultTail.next = resultHead;
	resultHead.prev = resultTail;
	return resultHead;
}

function insert_ll(head, head2) {
	let next = head.next;
	let tail2 = head2.prev;

	head.next = head2;
	head2.prev = head;

	next.prev = tail2;
	tail2.next = next;

	return head;
}

function toArray(head) {
	let cur = head;
	let res = [];
	do {
		res.push(cur.val);
		cur = cur.next;
	} while (cur != head);
	return res;
}

function print_ll(head) {
	console.log(toArray(head).join(', '));
	let cur = head;
	do {
		console.log({val: cur.val, next: cur.next.val, prev: cur.prev.val});
		cur = cur.next;
	} while (cur != head);
}

let ll = cups.reduce((head, v) => append(head, v), null);
let lookup = Array(cups.length + 1).fill(-1);
let cur = ll;
do {
	lookup[cur.val] = cur;
	cur = cur.next;
} while (cur != ll);
// console.log(lookup.slice(0, 100))

let current = ll;
let moves = 10_000_000;
outer: for (let i = 0; i < moves; i++) {
	if (i % 100_000 == 0) {
		console.log(i, Date.now())
	}
	// console.log(`at ${i}: ${toArray(current).join(', ')}`)
	let currentLabel = current.val;
	// console.log(`at ${i}: cur ${currentLabel}`)
	// print_ll(current);
	let selected = cut_ll(current);
	// console.log(`at ${i}: selected`)
	// print_ll(selected);
	// console.log(`at ${i}: after cut`)
	// print_ll(current);
	// console.log(`at ${i}: looking for min ${toArray(selected).join(', ')}`)
	let min4i = 0;
	while (find_ll(selected, min4[min4i])) {
		min4i += 1;
	}
	let min = min4[min4i];
	// console.log(`at ${i}: looking for max ${toArray(selected).join(', ')}`)
	let max4i = 3;
	while (find_ll(selected, max4[max4i])) {
		// console.log(`found ${max4[max4i]} @${max4i}`)
		max4i -= 1;
	}
	let max = max4[max4i];
	// console.log(`at ${i}: for ${currentLabel}: ${min} - ${max}`)
	let nextLabel = currentLabel;
	do {
		nextLabel -= 1;
		if (nextLabel < min) {
			nextLabel = max;
		}
	} while (find_ll(selected, nextLabel))
	let next = lookup[nextLabel];
	insert_ll(next, selected);
	current = current.next;
}

let startResult = find_ll(ll, 1);
let result = [startResult.next.val, startResult.next.next.val];

console.log(`Result: ${result.join('*')} = ${result[0] * result[1]}`);
