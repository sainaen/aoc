package util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.function.Predicate;
import java.util.stream.Stream;

public class Util {

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
            pos = a.indexOf(v, pos) ;
            if (pos >= 0) {
                pos += v.length();
                result++;
            }
        }
        return result;
    }

    public static void log(String fmt, Object... args) {
        System.out.printf(fmt + "%n", args);
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

    public static Stream<String> inputStream(int day) throws IOException {
        return Files.readAllLines(Path.of("2021", "day" + day, "input"))
                .stream()
                .map(String::strip)
                .filter(Predicate.not(String::isEmpty));
    }

    public static String[] inputStrings(int day) throws IOException {
        var strings = inputStream(day).toArray(String[]::new);
        System.out.println("read in " + strings.length + " values...");
        return strings;
    }

    public static long[] inputLongs(int day) throws IOException {
        var longs = inputStream(day).mapToLong(Long::parseLong).toArray();
        System.out.println("read in " + longs.length + " values...");
        return longs;
    }

}
