#!/usr/bin/env node

/**
 * INCOMPLETE solution for part2 using sorting + binary search
 */

let fs = require("fs");

let input = fs
	.readFileSync("./input", "utf-8")
	.split("\n")
	.filter((v) => v)
	.map((v) => parseInt(v, 10));
console.log(`read in ${input.length} values...`);

let sortCmp = (a, b) => a - b;

input.sort(sortCmp);

let binarySearch = function (haystack, needle, comparator, low, high) {
	var mid, cmp;

	if (low === undefined) low = 0;
	else {
		low = low | 0;
		if (low < 0 || low >= haystack.length)
			throw new RangeError("invalid lower bound");
	}

	if (high === undefined) high = haystack.length - 1;
	else {
		high = high | 0;
		if (high < low || high >= haystack.length) {
			throw new RangeError("invalid upper bound");
		}
	}

	while (low <= high) {
		// The naive `low + high >>> 1` could fail for array lengths > 2**31
		// because `>>>` converts its operands to int32. `low + (high - low >>> 1)`
		// works for array lengths <= 2**32-1 which is also Javascript's max array
		// length.
		mid = low + ((high - low) >>> 1);
		cmp = +comparator(haystack[mid], needle, mid, haystack);

		// Too low.
		if (cmp < 0.0) low = mid + 1;
		// Too high.
		else if (cmp > 0.0) high = mid - 1;
		// Key found.
		else return mid;
	}

	// Key not found.
	return ~low;
};

let target = 2020;
for (let i = 0, j = input.length - 1; i < j - 1; ) {
	let lo = input[i];
	let hi = input[j];
	let mi = target - (lo + hi);
	if (mi <= 0) {
		console.log(
			`Looking for ${mi}, which means we overshot (lo=${lo} @${i}, hi=${hi} @${j}), reducing j`
		);
		j -= 1;
		continue;
	}
	let k = binarySearch(input, mi, sortCmp, i + 1, j - 1);
	if (k > 0) {
		console.log(`Found ${lo} (@${i}), ${mi} (@${k}) and ${hi} (@${j})`);
		console.log(`Product: ${lo * mi * hi}`);
		break;
	} else {
		console.log(
			`Observing ${lo} (@${i}), ${hi} (@${j}); looking for ${mi} found ${k} (${
				input[~k]
			} @${~k})`
		);
		let found = input[~k];
		if (found < mi || ~k == j) {
			i += 1;
		} else if (found > mi || ~k == i) {
			j -= 1;
		}
	}
}
