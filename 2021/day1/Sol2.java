package day1;

import java.io.IOException;

import static util.Util.*;

public class Sol2 {

    public static void main(String[] args) throws IOException {
//        Stream<String> input = testStream(1);
//        Stream<String> input = inputStream(1);
//        String[] input = testStrings(1);
//        String[] input = inputStrings(1);
//        long[] input = testLongs(1);
        long[] input = inputLongs(1);

        long result = 0;
        long[] windows = new long[input.length - 2];
        for (int i = 0; i < input.length - 2; i++) {
            windows[i] = input[i] + input[i + 1] + input[i + 2];
        }
        long prev = -1;
        for (int i = 0; i < windows.length; i++) {
            if (prev != -1) {
                result += windows[i] > prev ? 1 : 0;
            }
            prev = windows[i];
        }
        log("Result: %d", result);
    }
}
