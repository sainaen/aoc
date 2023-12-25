#!/usr/bin/sh
set -eu

key="$HOME/.config/aoc/input-key.txt"

encrypt() {
	find . -type f \( -name 'input' -o -name 'input_*' -o -name 'input.txt' -o -name '*input' -o -name 'day*.txt' \) \! -name '*.age' |
		while read f; do
			t="$f.age"
			if [ ! -f "$t" ] ; then
				echo "encrypting $f -> $t"
				age --encrypt --identity "$key" --output "$t" "$f"
			fi
		done
}

decrypt() {
	local t
	find . -type f -name '*.age' |
		while read f; do
			d=$(dirname "$f")
			n=$(basename "$f" | sed 's/\.age$//')
			t="$d/$n"
			if [ ! -f "$t" ] ; then
				echo "decrypting $f -> $t"
				age --decrypt --identity "$key" --output "$t" "$f"
			fi
		done
}

case "${1:-}" in
	encrypt)
		encrypt
		;;

	decrypt)
		decrypt
		;;
	*)
		echo "Usage: $0 {encrypt|decrypt}"
		exit 1
esac

echo done
