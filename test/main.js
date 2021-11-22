async function main() {
    var responses = [];

    for (var i = 0; i < 100; i++) {
        responses.push(compute(i));
    }

    responses = await Promise.all(responses);

    await new Promise(res => {
        setTimeout(res, 1000);
    });

    return responses;
}