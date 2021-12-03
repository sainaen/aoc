package solutions;

import java.util.List;

import static utils.Utils.*;

public class Day<n> {

    public static void main(String[] args) throws Exception {
        List<String> input = day(<n>);
        List<String> sample1 = sample("""

                """);

        System.out.println("Sample: " + part1(sample1));
        System.out.println("Result: " + part1(input));

        System.out.println("---");

        // System.out.println("Sample: " + part2(sample1));
        // System.out.println("Result: " + part2(input));
    }

    static long part1(List<String> strings) throws Exception {
        long[] longs = longs(strings);

    }

}
