async function main() {
    var max = 1000000;
    var batchSize = 10000;

    var numbers = [];

    for (var i = 2; i < max; i++) {
        numbers.push(i);
    }

    var n = 0;
    while (numbers[n] <= Math.ceil(Math.sqrt(max))) {
        var responses = [];

        for (var i = 0; i < Math.ceil(numbers.length / batchSize); i++) {
            responses.push(compute(numbers.slice(i * batchSize, (i + 1) * batchSize), numbers[n]));
        }

        numbers = (await Promise.all(responses)).flat(1);

        n++;

        setPercent(numbers[n] / Math.ceil(Math.sqrt(max)) * 100);
    }

    return numbers;
}