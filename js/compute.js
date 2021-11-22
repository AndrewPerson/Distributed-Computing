<<<<<<< HEAD
var computeTasks = {};

addEventListener("message", e => {
    computeTasks[e.data.id](e.data.data);
});

var currentId = 0;
=======
>>>>>>> parent of 6b2479e (Added working distributed computing!)
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