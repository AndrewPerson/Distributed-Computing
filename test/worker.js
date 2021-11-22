async function compute(i) {
    await new Promise(res => {
        setTimeout(res, 100);
    });

    return i == 50 ? "I have 50!" : "Nothing yet.";
}