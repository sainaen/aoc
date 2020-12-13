#!/usr/bin/env python3

from pysmt.shortcuts import Symbol, LE, GE, And, Int, Equals, Plus, Minus, Times, Div, Solver
from pysmt.typing import INT



# buses = [
#   { "b": 41, "i": 0 },
#   { "b": 37, "i": 35 },
#   { "b": 379, "i": 41 },
#   { "b": 23, "i": 49 },
#   { "b": 13, "i": 54 },
#   { "b": 17, "i": 58 },
#   { "b": 29, "i": 70 },
#   { "b": 557, "i": 72 },
#   { "b": 19, "i": 91 }
# ]

buses = [
    { "b": 7, "i": 0 },
    { "b": 13, "i": 1},
    { "b": 59, "i": 4},
    { "b": 31, "i": 6 },
    { "b": 19, "i": 7 },
]

x = Symbol("X", INT)
bs = list([ Symbol("B" + str(b['b']), INT) for b in buses ])

cons = [
	And(Equals(
		Times(Int(buses[0]['b']), x),
		Minus(
			Times(Int(b['b']), bx),
			Int(b['i'])
		),
	), GE(bx, Int(1)))
	for b,bx in zip(buses, bs)]

f=And(And(cons), GE(x, Int(1)))
print(f.serialize())

with Solver(name="z3") as solver:
    solver.add_assertion(f)
    if not solver.solve():
        print("Domain is not SAT!!!")
        exit()
    solver.add_assertion(f)
    if solver.solve():
    	print(buses[0]['b'] * solver.get_value(x))
    else:
        print("No solution found")