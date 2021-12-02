package solutions;

import java.util.List;

import static utils.Utils.*;

/*
Result:

      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
  1   00:01:40   407      0   00:09:07  2101      0
 */
public class Day1 {

    public static void main(String[] args) throws Exception {
        List<String> input = day(1);
        List<String> sample1 = sample("""
                199
                200
                208
                210
                200
                207
                240
                269
                260
                263
                """);

        System.out.println("Sample1: " + part1(sample1));
        System.out.println("Result: " + part1(input));

        System.out.println("---");

        System.out.println("Sample1: " + part2(sample1));
        System.out.println("Result: " + part2(input));
    }

    static long part1(List<String> strings) throws Exception {
        long[] longs = longs(strings);

        long result = 0;
        long prev = -1;
        for (int i = 0; i < longs.length; i++) {
            long d = longs[i];
            if (prev != -1) {
                result += d > prev ? 1 : 0;
            }
            prev = d;
        }

        return result;
    }

    static long part2(List<String> strings) throws Exception {
        long[] longs = longs(strings);

        long result = 0;
        long[] windows = new long[longs.length - 2];
        for (int i = 0; i < longs.length - 2; i++) {
            windows[i] = longs[i] + longs[i + 1] + longs[i + 2];
        }
        long prev = -1;
        for (int i = 0; i < windows.length; i++) {
            if (prev != -1) {
                result += windows[i] > prev ? 1 : 0;
            }
            prev = windows[i];
        }

        return result;
    }

}
