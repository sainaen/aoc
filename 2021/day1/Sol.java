package day1;

import java.io.IOException;
import java.util.Arrays;
import java.util.function.Predicate;
import java.util.stream.Stream;

import static util.Util.*;

public class Sol {

    static final String test = """
            """;

    public static void main(String[] args) throws IOException {
//        Stream<String> input = testStream(1);
//        Stream<String> input = inputStream(1);
//        String[] input = testStrings(1);
//        String[] input = inputStrings(1);
//        long[] input = testLongs(1);
//        long[] input = inputLongs(1);

        long result = 0;
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
