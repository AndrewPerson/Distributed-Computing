async function compute(numbers, check) {
    var results = [];

    for (var num of numbers) {
        if (num == check || num % check != 0)
            results.push(num);
    }

    return results;
}