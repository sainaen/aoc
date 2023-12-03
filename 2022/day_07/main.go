package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

// @formatter:off
/*
--------Part 1---------   --------Part 2---------
    Time    Rank  Score       Time    Rank  Score
    >24h  114901      0       >24h  112332      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 7")

	fmt.Println("-------------")
	part1(sample(`$ cd /
	$ ls
	dir a
	14848514 b.txt
	8504156 c.dat
	dir d
	$ cd a
	$ ls
	dir e
	29116 f
	2557 g
	62596 h.lst
	$ cd e
	$ ls
	584 i
	$ cd ..
	$ cd ..
	$ cd d
	$ ls
	4060174 j
	8033020 d.log
	5626152 d.ext
	7214296 k`))
	part1(fullInput())

	fmt.Println("-------------")
	part2(sample(`$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`))
	part2(fullInput())
}

func part1(in input) {
	fs := make(map[string]*dir)
	root := dir{path: []string{"/"}, children: make([]dirItem, 0)}
	fs["/"] = &root
	curDir := &root
	discoverFs(in, curDir, fs)
	result := uint64(0)
	for _, d := range fs {
		dsize := d.size()
		if dsize <= 100000 {
			result += dsize
		}
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func discoverFs(in input, curDir *dir, fs map[string]*dir) {
	listing := false
	for _, l := range in.lines {
		if l[0] == '$' {
			listing = false
			cmd := strings.Split(strings.TrimPrefix(l, "$ "), " ")
			if cmd[0] == "cd" {
				var newPath string
				if cmd[1] == ".." {
					newPath = curDir.parentPath()
				} else if strings.HasPrefix(cmd[1], "/") {
					newPath = cmd[1]
				} else {
					newPath = curDir.childPath(cmd[1])
				}
				newDir, ok := fs[newPath]
				if !ok {
					log.Fatalf("Dir '%s' doesn't exist (for cmd: %s)\n", newPath, l)
				}
				curDir = newDir
			} else if cmd[0] == "ls" {
				listing = true
			} else {
				log.Fatalf("unknown command: %s\n", l)
			}
		} else if listing {
			item := strings.Split(l, " ")
			itemPath := append([]string{}, curDir.path...)
			itemPath = append(itemPath, item[1])
			if item[0] == "dir" {
				newDir := dir{path: itemPath, children: make([]dirItem, 0)}
				fs[newDir.fullPath()] = &newDir
				curDir.addChildDir(&newDir)
			} else {
				size, err := strconv.ParseUint(item[0], 10, 64)
				if err != nil {
					log.Fatalf("Unexpected file size: %s %v\n", item[0], err)
				}
				curDir.addChildFile(&file{path: itemPath, fileSize: size})
			}
		}
	}
}

type dir struct {
	path     []string
	children []dirItem
}

func (d *dir) addChildDir(c *dir) {
	d.children = append(d.children, c)
}

func (d *dir) addChildFile(c *file) {
	d.children = append(d.children, c)
}

func (d *dir) childPath(name string) string {
	if len(d.path) == 1 {
		return "/" + name
	}
	return d.fullPath() + "/" + name
}

func (d *dir) fullPath() string {
	if len(d.path) == 1 {
		return "/"
	}
	return "/" + strings.Join(d.path[1:], "/")
}

func (d *dir) size() uint64 {
	total := uint64(0)
	for _, c := range d.children {
		total += c.size()
	}
	return total
}

func (d *dir) parentPath() string {
	if len(d.path) == 1 {
		// the root (/) is its own parent
		return "/"
	}
	return "/" + strings.Join(d.path[1:len(d.path)-1], "/")
}

func (d *dir) list() {
	fmt.Printf("[d] %s (size: %d, children: %d)\n", d.fullPath(), d.size(), len(d.children))
	for _, c := range d.children {
		c.list()
	}
}

type file struct {
	path     []string
	fileSize uint64
}

func (f *file) size() uint64 {
	return f.fileSize
}

func (f *file) list() {
	fmt.Printf("[f] /%s (size: %d)\n", strings.Join(f.path[1:], "/"), f.fileSize)
}

type dirItem interface {
	size() uint64
	list()
}

func part2(in input) {
	fs := make(map[string]*dir)
	root := dir{path: []string{"/"}, children: make([]dirItem, 0)}
	fs["/"] = &root
	curDir := &root
	discoverFs(in, curDir, fs)
	totalDiskSize := uint64(70000000)
	currentlyUsed := root.size()
	updateSize := uint64(30000000)
	result := currentlyUsed
	for _, d := range fs {
		candidateSize := d.size()
		if totalDiskSize-(currentlyUsed-candidateSize) >= updateSize {
			result = min(candidateSize, result)
		}
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}

type input struct {
	kind  string
	lines []string
}

func fullInput() input {
	file, err := os.Open("2022/day_07/input.txt")
	if err != nil {
		log.Fatal("Couldn't open the input file", err)
	}
	defer file.Close()
	return input{kind: "input", lines: lines(bufio.NewScanner(file))}
}

func sample(s string) input {
	return input{kind: "sample", lines: lines(bufio.NewScanner(strings.NewReader(s)))}
}

func lines(s *bufio.Scanner) []string {
	var result []string
	for s.Scan() {
		result = append(result, strings.TrimSpace(s.Text()))
	}
	return result
}
