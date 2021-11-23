async function main() {
    var max = 100000;

    var primes = [2];

    for (var n = 0; n < Math.sqrt(max); n++)
    {
        var responses = [];

        for (var i = 0; i < max; i++) {
            responses.push(compute(i, primes).then(prime => {
                if (prime) primes.push(i);
            }));
        }

        await Promise.all(responses);
    }

    return primes;
}