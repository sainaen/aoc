package main

import (
	"fmt"
	"strings"
)

// @formatter:off
/*
--------Part 1--------   --------Part 2--------
    Time   Rank  Score       Time   Rank  Score
00:26:01    336      0   02:45:35   1251      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 24")
	inputFile := "2023/day_24/input.txt"
	//	sampleLines := `19, 13, 30 @ -2,  1, -2
	//18, 19, 22 @ -1, -1, -2
	//20, 25, 34 @ -2, -2, -4
	//12, 31, 28 @ -1, -2, -1
	//20, 19, 15 @  1, -5, -3`

	fmt.Println("-------------")
	//part1(sample(sampleLines))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	//part2(sample(sampleLines))
	part2(fullInput(inputFile))
}

func part1(in input) {
	hs := make([]*Hailstone, len(in.lines))
	for i, l := range in.lines {
		hs[i] = parseHailstone(l)
		//fmt.Println(hs[i])
	}
	const lo = float64(200000000000000)
	const hi = float64(400000000000000)
	//const lo = float64(7)
	//const hi = float64(27)
	result := 0
	for i, h := range hs {
		for j := i + 1; j < len(hs); j++ {
			o := hs[j]
			cx, cy, e := h.collision(o)
			if e != nil {
				//fmt.Println(h, o, e)
				continue
			}
			if lo <= cx && cx <= hi && lo <= cy && cy <= hi {
				//fmt.Println(h, o, "collide!")
				result += 1
			} else {
				//fmt.Println(h, o, "collide.")
			}
		}
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

type Path struct {
	s float64
	y float64
}

type Hailstone struct {
	x  int
	y  int
	z  int
	vx int
	vy int
	vz int
}

func parseHailstone(l string) *Hailstone {
	parts := strings.Split(l, " @ ")
	pos := parseNumsWithSep(parts[0], ",")
	vel := parseNumsWithSep(parts[1], ",")
	return &Hailstone{pos[0], pos[1], pos[2], vel[0], vel[1], vel[2]}
}

func (h *Hailstone) getPath() *Path {
	s := float64(h.vy) / float64(h.vx)
	y := float64(h.y) - s*float64(h.x)
	return &Path{s, y}
}

func (h *Hailstone) collision(o *Hailstone) (float64, float64, error) {
	hp := h.getPath()
	op := o.getPath()
	if hp.s == op.s {
		return 0, 0, fmt.Errorf("hailstones do not collide")
	}
	x := (op.y - hp.y) / (hp.s - op.s)
	y := hp.s*x + hp.y
	if h.vx > 0 && float64(h.x) > x ||
		h.vx < 0 && float64(h.x) < x ||
		h.vy > 0 && float64(h.y) > y ||
		h.vy < 0 && float64(h.y) < y ||
		o.vx > 0 && float64(o.x) > x ||
		o.vx < 0 && float64(o.x) < x ||
		o.vy > 0 && float64(o.y) > y ||
		o.vy < 0 && float64(o.y) < y {
		return 0, 0, fmt.Errorf("hailstones collided in the past")
	}
	return x, y, nil
}

func part2(in input) {
	hs := make([]*Hailstone, len(in.lines))
	for i, l := range in.lines {
		hs[i] = parseHailstone(l)
	}
	fmt.Println("To solve p2, run the following:")
	fmt.Println()
	fmt.Println("python -m venv venv")
	fmt.Println("source venv/bin/activate")
	fmt.Println("pip install sympy")
	// code based on official guide:
	// https://docs.sympy.org/latest/guides/solving/solve-system-of-equations-algebraically.html
	fmt.Printf(`cat <<EOF > p2.py
from sympy import solve
from sympy.abc import x,y,z,a,b,c,d,e,f
vx, vy, vz = a, b, c
t1, t2, t3 = d, e, f

eqs = [
  x + t1 * vx - %d - t1 * %d,
  y + t1 * vy - %d - t1 * %d,
  z + t1 * vz - %d - t1 * %d,
  x + t2 * vx - %d - t2 * %d,
  y + t2 * vy - %d - t2 * %d,
  z + t2 * vz - %d - t2 * %d,
  x + t3 * vx - %d - t3 * %d,
  y + t3 * vy - %d - t3 * %d,
  z + t3 * vz - %d - t3 * %d,
]

sol = solve(eqs, [x,y,z,vx,vy,vz,t1,t2,t3], dict=True)
print("Result: ", sol)
print("Solution: ", sol[0][x] + sol[0][y] + sol[0][z])
EOF
`,
		hs[0].x, hs[0].vx, hs[0].y, hs[0].vy, hs[0].z, hs[0].vz,
		hs[1].x, hs[1].vx, hs[1].y, hs[1].vy, hs[1].z, hs[1].vz,
		hs[2].x, hs[2].vx, hs[2].y, hs[2].vy, hs[2].z, hs[2].vz)
	fmt.Println("python p2.py")
}
