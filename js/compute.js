var computeTasks = {};

addEventListener("message", e => {
    computeTasks[e.data.id](e.data.data);
    delete computeTasks[e.data.id];
});

function setPercent(percent) {
    postMessage({
        command: "Set Percent",
        percent: Math.min(percent, 100)
    });
}

var currentId = 0;
function compute() {
    return new Promise(res => {
        postMessage({
            command: "Compute",
            id: currentId,
            data: [...arguments]
        });

        computeTasks[currentId] = res;

        currentId++;
    });
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