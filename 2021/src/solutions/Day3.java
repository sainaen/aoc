package solutions;

import java.util.*;
import java.util.stream.Collectors;

import static utils.Utils.day;
import static utils.Utils.sample;

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
  3   00:08:47  2248      0   00:30:39  2545      0
 */
public class Day3 {

    public static void main(String[] args) throws Exception {
        List<String> input = day(3);
        List<String> sample1 = sample("""
                00100
                11110
                10110
                10111
                10101
                01111
                00111
                11100
                10000
                11001
                00010
                01010
                """);

        System.out.println("Sample: " + part1(sample1));
        System.out.println("Result: " + part1(input));

        System.out.println("---");

        System.out.println("Sample: " + part2(sample1));
        System.out.println("Result: " + part2(input));
    }

    static long part1(List<String> strings) throws Exception {
        Map<String, Long>[] bits = new HashMap[strings.get(0).length()];
        for (int i = 0; i < strings.get(0).length(); i++) {
            bits[i] = new HashMap<>();
        }
        for (String string : strings) {
            var sbits = string.split("");
            for (int i = 0; i < sbits.length; i++) {
                bits[i].compute(sbits[i], (key, oldVal) -> oldVal == null ? 1 : oldVal + 1);
            }
        }

        long gamma = 0;
        long sigma = 0;

        for (Map<String, Long> b : bits) {
            var mb = 0;
            var lb = 0;
            if (b.get("0") > b.get("1")) {
                mb = 1;
            } else {
                lb = 1;
            }
            gamma = (gamma << 1) + mb;
            sigma = (sigma << 1) + lb;
        }

        return gamma * sigma;

    }

    static Map<String, Long>[] countBits(Set<String[]> strings) {
        int len = strings.iterator().next().length;
        Map<String, Long>[] bits = new HashMap[len];
        for (int i = 0; i < len; i++) {
            bits[i] = new HashMap<>();
        }

        for (String[] sbits : strings) {
            for (int i = 0; i < sbits.length; i++) {
                bits[i].compute(sbits[i], (key, oldVal) -> oldVal == null ? 1 : oldVal + 1);
            }
        }
        return bits;
    }

    static String[] pop(Map<String, Long>[] bits, int i) {
        var b = bits[i];
        var mb = 0;
        var lb = 0;
        if (b.getOrDefault("0", 0L) < b.getOrDefault("1", 0L)) {
            mb = 1;
        } else if (b.getOrDefault("0", 0L).equals(b.getOrDefault("1", 0L))) {
            mb = 1;
        } else {
            lb = 1;
        }
        var mb_ = Long.toString(mb);
        var lb_ = Long.toString(lb);
        return new String[]{mb_, lb_};
    }

    static long part2(List<String> strings) throws Exception {
        Set<String[]> ox = new HashSet<>();
        Set<String[]> co2 = new HashSet<>();
        for (String string : strings) {
            var sbits = string.split("");
            ox.add(sbits);
            co2.add(sbits);
        }
        var len = ox.iterator().next().length;

        for (int i = 0; i < len; i++) {
            var mp_ox = pop(countBits(ox), i)[0];
            var lp_co2 = pop(countBits(co2), i)[1];
            var j = i;
            if (ox.size() > 1) {
                ox = ox.stream()
                        .filter(sbits -> sbits[j].equals(mp_ox))
                        .collect(Collectors.toSet());
            }
            if (co2.size() > 1) {
                co2 = co2.stream()
                        .filter(sbits -> sbits[j].equals(lp_co2))
                        .collect(Collectors.toSet());
            }
        }

        return Long.parseLong(String.join("", ox.iterator().next()), 2) * Long.parseLong(String.join("", co2.iterator().next()), 2);

    }

}
