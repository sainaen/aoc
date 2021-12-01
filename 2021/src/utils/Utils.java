package utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class Utils {

    public static <T> long count(T[] a, T v) {
        long result = 0;
        for (T t : a) {
            if (v.equals(t)) {
                result++;
            }
        }
        return result;
    }

    public static long count(String a, char v) {
        long result = 0;
        var chars = a.toCharArray();
        for (char c : chars) {
            if (c == v) {
                result++;
            }
        }
        return result;
    }

    public static long count(String a, String v) {
        long result = 0;
        int pos = 0;
        while (0 <= pos && pos < a.length()) {
            pos = a.indexOf(v, pos);
            if (pos >= 0) {
                pos += v.length();
                result++;
            }
        }
        return result;
    }

    public static long sum(long[] vs, int... is) {
        long s = 0;
        for (int i : is) {
            long before = s;
            s += vs[i];
            if (s < before) {
                throw new IllegalStateException("overflow for before=" + before + " v=" + vs[i] + " pos=" + i + " after=" + s);
            }
        }
        return s;
    }

    public static long product(long[] vs, int... is) {
        long p = 1;
        for (int i : is) {
            long before = p;
            p *= vs[i];
            if (p < before) {
                throw new IllegalStateException("overflow for before=" + before + " v=" + vs[i] + " pos=" + i + " after=" + p);
            }
        }
        return p;
    }

    public static <T> void swap(T[] a, int i, int j) {
        T tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }

    private static List<String> cleanup(List<String> lines) {
        return lines.stream()
                .map(String::strip)
                .filter(Predicate.not(String::isEmpty))
                .collect(Collectors.toList());
    }

    public static List<String> day(int day) {
        try {
            List<String> lines = cleanup(Files.readAllLines(Path.of("2021/inputs", "day" + day + ".txt")));
            System.out.println("read in " + lines.size() + " lines...");
            return lines;
        } catch (IOException e) {
            throw new RuntimeException("Something went wrong while reading the file", e);
        }
    }

    public static List<String> sample(String sampleText) {
        return cleanup(Arrays.asList(sampleText.split("\n")));
    }

    public static long[] longs(List<String> input) {
        return input.stream().mapToLong(Long::parseLong).toArray();
    }

}
