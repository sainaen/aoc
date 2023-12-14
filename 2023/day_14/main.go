package main

import (
	"crypto/md5"
	"fmt"
	"log"
	"slices"
)

// @formatter:off
/*
--------Part 1--------   --------Part 2--------
    Time   Rank  Score       Time   Rank  Score
08:31:42  20156      0   14:35:04  18665      0

Being on-call sometimes means not solving AoC in the best time 🤷
*/
// @formatter:on
func main() {
	fmt.Println("Day 14")
	inputFile := "2023/day_14/input.txt"
	sampleLines := `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	part2(sample(sampleLines))
	//part2(sample(`..O
	//...
	//.O.`))
	part2(fullInput(inputFile))
}

func part1(in input) {
	f := newField(in.lines)
	f.rollRocksNorth()
	result := 0
	for i, l := range f {
		for _, c := range l {
			if c == 'O' {
				result += len(f) - i
			}
		}
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

type field [][]uint8

func newField(strField []string) field {
	rows := make([][]uint8, len(strField))
	for i, l := range strField {
		rows[i] = make([]uint8, len(l))
		for j, c := range l {
			rows[i][j] = uint8(c)
		}
	}
	return rows
}

func (f field) clone() field {
	nf := make([][]uint8, len(f))
	for i := range f {
		nf[i] = slices.Clone(f[i])
	}
	return nf
}

func (f field) print() {
	for i := range f {
		fmt.Printf("%s\n", f[i])
	}
}

func (f field) rollRocksNorth() {
	var m = make([]int, 100)
	for i, row := range f {
		for j, c := range row {
			if c == '#' {
				m[j] = i + 1
			} else if c == 'O' {
				prevHeight := m[j]
				f[i][j] = '.'
				f[prevHeight][j] = 'O'
				m[j] = prevHeight + 1
			}
		}
	}
}

func (f field) rollRocksWest() {
	var m = make([]int, 100)
	for i := 0; i < len(m); i++ {
		m[i] = 0
	}
	for j := 0; j < len(f[0]); j += 1 {
		for i, row := range f {
			c := row[j]
			if c == '#' {
				m[i] = j + 1
			} else if c == 'O' {
				prevHeight := m[i]
				f[i][j] = '.'
				f[i][prevHeight] = 'O'
				m[i] = prevHeight + 1
			}
		}
	}
}

func (f field) rollRocksSouth() {
	slices.Reverse(f)
	f.rollRocksNorth()
	slices.Reverse(f)
	//for i := 0; i < len(m); i++ {
	//      m[i] = len(f) - 1
	//}
	//for i := len(f) - 1; i >= 0; i -= 1 {
	//      row := f[i]
	//      for j, c := range row {
	//              if c == '#' {
	//                      m[j] = i - 1
	//              } else if c == 'O' {
	//                      prevHeight := m[j]
	//                      f[i][j] = '.'
	//                      f[prevHeight][j] = 'O'
	//                      m[j] = prevHeight - 1
	//              }
	//      }
	//}
}

func (f field) rollRocksEast() {
	for i := range f {
		slices.Reverse(f[i])
	}
	f.rollRocksWest()
	for i := range f {
		slices.Reverse(f[i])
	}
	//for i := 0; i < len(m); i++ {
	//      m[i] = len(f[0]) - 1
	//}
	//for j := len(f[0]) - 1; j >= 0; j -= 1 {
	//      for i, row := range f {
	//              c := row[j]
	//              if c == '#' {
	//                      m[i] = j - 1
	//              } else if c == 'O' {
	//                      prevHeight := m[i]
	//                      f[i][j] = '.'
	//                      f[i][prevHeight] = 'O'
	//                      m[i] = prevHeight - 1
	//              }
	//      }
	//}
}

func (f field) cycle() {
	f.rollRocksNorth()
	f.rollRocksWest()
	f.rollRocksSouth()
	f.rollRocksEast()
}

func (f field) key() []byte {
	b := byte(0)
	i := 0
	bs := make([]byte, 0)
	for _, r := range f {
		for _, c := range r {
			if i == 8 {
				bs = append(bs, b)
				b = 0
				i = 0
			}
			d := byte(0)
			if c == 'O' {
				d = byte(1)
			}
			b = (b << 1) + d
			i += 1
		}
	}
	bs = append(bs, b)
	//fmt.Println(bs)
	h := md5.New()
	h.Write(bs)
	result := make([]byte, 0)
	return h.Sum(result)
}

func (f field) reduceIterations(n int) int {
	cache := make(map[string]int)
	for i := 0; i < 100_000; i++ {
		k := string(f.key())
		if v, ok := cache[k]; ok {
			return v + ((n - v) % (i - v))
		} else {
			cache[k] = i
		}
		f.cycle()
	}
	log.Fatalln("Couldn't find a period :(")
	return -1
}

func part2(in input) {
	f := newField(in.lines)
	iterations := f.clone().reduceIterations(1_000_000_000)
	for i := 0; i < iterations; i++ {
		f.cycle()
	}
	result := 0
	for i, l := range f {
		for _, c := range l {
			if c == 'O' {
				result += len(f) - i
			}
		}
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
