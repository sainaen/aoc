package day1;

import java.io.IOException;
import java.util.Arrays;
import java.util.function.Predicate;
import java.util.stream.Stream;

import static util.Util.*;

public class Sol {

    static final String test = """
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
            """;

    public static void main(String[] args) throws IOException {
//        Stream<String> input = testStream(1);
//        Stream<String> input = inputStream(1);
//        String[] input = testStrings(1);
//        String[] input = inputStrings(1);
//        long[] input = testLongs(1);
        long[] input = inputLongs(1);

        long result = 0;
        long prev = -1;
        for (int i = 0; i < input.length; i++) {
            long d = input[i];
            if (prev != -1) {
                result += d > prev ? 1 : 0;
            }
            prev = d;
        }
        log("Result: %d", result);
    }

    static Stream<String> testStream(int ignored) {
        return Arrays.stream(test.split("\n")).map(String::strip).filter(Predicate.not(String::isEmpty));
    }

    static String[] testStrings(int ignored) {
        return testStream(ignored).toArray(String[]::new);
    }

    static long[] testLongs(int ignored) {
        return testStream(ignored).mapToLong(Long::parseLong).toArray();
    }

}
