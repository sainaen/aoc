package utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;
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

    public static <T> void swap(List<T> a, int i, int j) {
        T tmp = a.get(i);
        a.set(i, a.get(j));
        a.set(j, tmp);
    }

    private static List<String> cleanup(List<String> lines) {
        return lines.stream()
                .map(String::strip)
                .filter(Predicate.not(String::isEmpty))
                .collect(Collectors.toList());
    }

    public static List<String> day(int day, boolean cleanup) {
        try {
            List<String> lines = Files.readAllLines(Path.of("2021/inputs", "day" + day + ".txt"));
            if (cleanup) {
                lines = cleanup(lines);
            }
            System.out.println("read in " + lines.size() + " lines...");
            return lines;
        } catch (IOException e) {
            throw new RuntimeException("Something went wrong while reading the file", e);
        }
    }

    public static List<String> day(int day) {
        return day(day, true);
    }

    private static List<List<String>> splitLinesByEmpty(List<String> lines) {
        List<List<String>> result = new ArrayList<>();
        List<String> currentGroup = new ArrayList<>();
        for (String rawLine : lines) {
            String line = rawLine.strip();
            if (!line.isEmpty()) {
                currentGroup.add(line);
            } else if (!currentGroup.isEmpty()) {
                result.add(currentGroup);
                currentGroup = new ArrayList<>();
            }
        }
        if (!currentGroup.isEmpty()) {
            result.add(currentGroup);
        }
        return result;
    }

    public static List<List<String>> dayGroup(int day) {
        return splitLinesByEmpty(day(day, false));
    }

    public static List<String> sample(String sampleText) {
        return cleanup(Arrays.asList(sampleText.split("\n")));
    }

    public static List<List<String>> sampleGroup(String sampleText) {
        return splitLinesByEmpty(Arrays.asList(sampleText.split("\n")));
    }

    public static long[] longs(List<String> input) {
        return input.stream().mapToLong(Long::parseLong).toArray();
    }

    public static long[] longs(List<String> input, int base) {
        return input.stream().mapToLong(s -> Long.parseLong(s, base)).toArray();
    }

    @SuppressWarnings("unchecked")
    public static <T> T[] filter(T[] a, Predicate<T> test) {
        return (T[]) Arrays.stream(a).filter(test).toArray(Object[]::new);
    }

    public static long[] filter(long[] a, Predicate<Long> test) {
        return Arrays.stream(a).filter(test::test).toArray();
    }

    @SuppressWarnings("unchecked")
    public static <T, R> R[] map(T[] a, Function<T, R> map) {
        return (R[]) Arrays.stream(a).map(map).toArray(Object[]::new);
    }

    @SuppressWarnings("unchecked")
    public static <R> R[] map(long[] a, Function<Long, R> map) {
        return (R[]) Arrays.stream(a).mapToObj(map::apply).toArray(Object[]::new);
    }

    public static int bit(long l, int i) {
        return (int) ((l >> i) & 0x1);
    }

    public static void print(long[] longs) {
        print(longs, 10);
    }

    public static void print(long[] longs, int base) {
        String[] strings = new String[longs.length];
        var maxLen = 0;
        for (int i = 0; i < longs.length; i++) {
            long l = longs[i];
            strings[i] = Long.toString(l, base);
            maxLen = Math.max(strings[i].length(), maxLen);
        }
        System.out.print("[ ");
        for (int i = 0; i < strings.length; i++) {
            var s = "0".repeat(Math.max(0, maxLen - strings[i].length())) + strings[i];
            System.out.print(s);
            if (i < strings.length - 1) {
                System.out.print(", ");
            }
        }
        System.out.println("]");
    }


}
