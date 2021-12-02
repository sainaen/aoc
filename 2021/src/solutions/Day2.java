package solutions;

import java.util.List;

import static utils.Utils.day;
import static utils.Utils.sample;

/*
       -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
  2   00:04:10  2239      0   00:05:16  1010      0
 */
public class Day2 {

    public static void main(String[] args) throws Exception {
        List<String> input = day(2);
        List<String> sample1 = sample("""
                forward 5
                down 5
                forward 8
                up 3
                down 8
                forward 2
                """);

        System.out.println("Sample1: " + part1(sample1));
        System.out.println("Result: " + part1(input));

        System.out.println("---");

        System.out.println("Sample1: " + part2(sample1));
        System.out.println("Result: " + part2(input));
    }

    static long part1(List<String> strings) throws Exception {
        long depth = 0;
        long lt = 0;
        for (String l : strings) {
            String[] parts = l.split(" ");
            long n = Long.parseLong(parts[1]);
            if (parts[0].equals("up")) {
                depth -= n;
            } else if (parts[0].equals("down")) {
                depth += n;
            } else if (parts[0].equals("forward")) {
                lt += n;
            } else {
                throw new IllegalStateException(parts[0]);
            }
        }
        return depth * lt;
    }

    static long part2(List<String> strings) throws Exception {
        long depth = 0;
        long lt = 0;
        long aim = 0;
        for (String l : strings) {
            String[] parts = l.split(" ");
            long n = Long.parseLong(parts[1]);
            if (parts[0].equals("up")) {
                aim -= n;
            } else if (parts[0].equals("down")) {
                aim += n;
            } else if (parts[0].equals("forward")) {
                lt += n;
                depth += aim * n;
            } else {
                throw new IllegalStateException(parts[0]);
            }
        }
        return depth * lt;
    }
}
