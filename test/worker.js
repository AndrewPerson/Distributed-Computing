async function compute(i, primes) {
    for (var prime of primes) {
        if (i % prime == 0)
            return false;
    }

    return true;
}