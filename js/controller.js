var workerScriptContent;
var worker;
var mainScriptURL;

var states = [
    "Connecting to Server",
    "Start Computing",
    "Computing"
];

var state = document.getElementById("state");

var peer = new Peer(options = {
    host: "distributedcompute.profsmart.repl.co",
    secure: true
});

peer.on("open", id => {
    document.getElementById("id").textContent = "ID: " + id;
    state.textContent = states[1];
    state.disabled = false;
});

var connections = [];
peer.on("connection", conn => {
    conn.on("open", () => {
        conn.send({command: "Compute Script", data: workerScriptContent});
        connections.push(conn);
    });

    conn.on("data", data => {
        worker.postMessage(data);
    });
});

async function main() {
    var fileCache = await caches.open("files");

    var workerScriptPromise = fileCache.match("worker");
    var mainScriptPromise = fileCache.match("main");

    if (!(workerScriptPromise && mainScriptPromise)) {
        location.href = `${location.origin}/upload.html`;
        return;
    }

    var [workerScript, mainScript] = await Promise.all([workerScriptPromise, mainScriptPromise]);

    workerScriptContent = `importScripts("${location.origin}/js/workerCompute.js");\n${await workerScript.text()}`;

    var mainScriptContent = `importScripts("${location.origin}/js/compute.js");\n${await mainScript.text()}`;

    mainScriptURL = URL.createObjectURL(new Blob([mainScriptContent], { type: "text/javascript" }));
}

main();

function startCompute() {
    state.disabled = true;
    state.textContent = states[2];

    worker = new Worker(mainScriptURL);

    worker.addEventListener("message", e => {
        if (e.data.command == "Completed") {
            document.getElementById("result").textContent = e.data.result == undefined ? "undefined" : JSON.stringify(e.data.result);

            state.disabled = false;
            state.textContent = states[1];

            for (var connection of connections) {
                connection.send({command: "Stop"});
            }
        }
        else if (e.data.command == "Compute") {
            connections[0].send(e.data);
        }
    });

    for (var connection of connections) {
        connection.send({command: "Start"});
    }
}