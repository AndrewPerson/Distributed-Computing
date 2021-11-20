function compute() {
    return new Promise(res => res());
}

var result = main();

if (result instanceof Promise) {
    result.then(finalResult => {
        postMessage({
            command: "Completed",
            result: finalResult
        });
    });
}
else {
    postMessage({
        command: "Completed",
        result: result
    });
}