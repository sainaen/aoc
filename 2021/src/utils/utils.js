let fs = require("fs");

function last(a) {
    return a[a.length - 1];
}
exports.last = last;

function remove(a, i) {
    a.splice(i, 1);
}
exports.remove = remove;

function swap(a, i, j) {
    let tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
}
exports.swap = swap;

function cleanup(lines) {
    return lines.map(l => l.trim()).filter(l => l);
}
exports.cleanup = cleanup;

function day(d, shouldCleanup = true) {
    let lines = fs.readFileSync(`inputs/day${d}.txt`, "utf-8").split("\n");
    if (shouldCleanup) {
        lines = cleanup(lines);
    }
    console.log(`read in ${lines.length} lines...`);
    return lines;
}
exports.day = day;

function splitLinesByEmpty(lines) {
    let result = [];
    let currentGroup = [];
    for (let rawLine of lines) {
        let line = rawLine.trim();
        if (line) {
            currentGroup.push(line);
        } else if (currentGroup.length > 0) {
            result.push(currentGroup);
            currentGroup = [];
        }
    }
    if (currentGroup.length > 0) {
        result.push(currentGroup);
    }
    return result;
}

function dayGroup(d) {
    return splitLinesByEmpty(day(d, false));
}
exports.dayGroup = dayGroup;

function sample(text, shouldCleanup = true) {
    let lines;
    if (typeof text == "number") {
        lines = fs.readFileSync(`inputs/day${text}_sample.txt`, "utf-8").split("\n");
        if (shouldCleanup) {
            lines = cleanup(lines);
        }
        return lines;
    } else {
        lines = text.split("\n");
    }

    if (shouldCleanup) {
        lines = cleanup(lines);
    }
    return lines;
}
exports.sample = sample;

function sampleGroup(text) {
    return splitLinesByEmpty(sample(text, false));
}
exports.sampleGroup = sampleGroup;

function longs(strs, {base = 10, split = null, lsplit = null} = {}) {
    if (split != null) {
        strs = strs.split(split);
    }
    if (lsplit != null) {
        return strs.map(row => row.split(lsplit).filter(v => v).map(v => parseInt(v, base)));
    }
    return strs.map(v => v.trim()).filter(v => v).map(v => parseInt(v, base));
}
exports.longs = longs;

function neighbors(field, y, x, {diagonals = false} = {}) {
    let res = [];
    if (y > 0) {
        res.push([y - 1, x]);
        if (diagonals && x > 0) {
            res.push([y - 1, x - 1]);
        }
        if (diagonals && x < field[y].length - 1) {
            res.push([y - 1, x + 1]);
        }
    }
    if (y < field.length - 1) {
        res.push([y + 1, x]);
        if (diagonals && x > 0) {
            res.push([y + 1, x - 1]);
        }
        if (diagonals && x < field[y].length - 1) {
            res.push([y + 1, x + 1]);
        }
    }
    if (x > 0) {
        res.push([y, x - 1]);
    }
    if (x < field[y].length - 1) {
        res.push([y, x + 1]);
    }

    return res;
}
exports.neighbors = neighbors;
