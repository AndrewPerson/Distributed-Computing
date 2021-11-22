self.addEventListener("message", e => {
    var result = compute(...e.data);

    if (result instanceof Promise) {
        result.then(finalResult => {
            postMessage(finalResult);
        });
    }
    else {
        postMessage(result);
    }
});