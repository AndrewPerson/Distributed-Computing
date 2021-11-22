var workerScriptContent;
var mainScriptURL;
<<<<<<< HEAD

var states = [
    "Connecting to Server",
    "Start Computing",
    "Computing"
];

var state = document.getElementById("state");

<<<<<<< HEAD
<<<<<<< HEAD
var queuedMessages = [];
var totalMaxWorkers = 0;
var currentWorkers = 0;

=======
>>>>>>> parent of 6b2479e (Added working distributed computing!)
=======
>>>>>>> parent of d8f7e0a (Made computing more resilient)
=======
>>>>>>> parent of d8f7e0a (Made computing more resilient)
var peer = new Peer(options = {
    host: "distributedcompute.profsmart.repl.co",
    secure: true,
    debug: 3,
    path: "/"
});

peer.on("open", id => {
<<<<<<< HEAD
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
=======
    document.getElementById("id").textContent = id;
>>>>>>> parent of 6b2479e (Added working distributed computing!)
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

    workerScriptContent = await workerScript.text();

    var mainScriptContent = `importScripts("${location.origin}/js/compute.js");\n${await mainScript.text()}`;

    mainScriptURL = URL.createObjectURL(new Blob([mainScriptContent], { type: "text/javascript" }));


}

main();

function startCompute() {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    if (connections.length == 0) return;

    computing = true;

=======
>>>>>>> parent of d8f7e0a (Made computing more resilient)
=======
>>>>>>> parent of d8f7e0a (Made computing more resilient)
    state.disabled = true;
    state.textContent = states[2];
=======
    var start = document.getElementById("start");
    start.disabled = true;
    start.textContent = "Computing...";
>>>>>>> parent of 6b2479e (Added working distributed computing!)

    var worker = new Worker(mainScriptURL);

    worker.addEventListener("message", e => {
        if (e.data.command == "Completed") {
            document.getElementById("result").textContent = e.data.result == undefined ? "undefined" : JSON.stringify(e.data.result);

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                ResetConnectionDisplay(i);
=======
            state.disabled = false;
            state.textContent = states[1];
>>>>>>> parent of d8f7e0a (Made computing more resilient)
=======
            state.disabled = false;
            state.textContent = states[1];
>>>>>>> parent of d8f7e0a (Made computing more resilient)

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
<<<<<<< HEAD
<<<<<<< HEAD
    else {
        queuedMessages.push(data);
    }
}

var workers = document.getElementById("workers");
function CreateConnectionDisplay(index) {
    var container = document.createElement("div");

    var capacityText = document.createElement("p");
    capacityText.innerText = "Capacity:";
    container.appendChild(capacityText);

    var maxWorkersContainer = document.createElement("div");

    var maxWorkers = document.createElement("h1");
    maxWorkers.innerText = connections[index].conn.metadata.maxWorkers;
    maxWorkersContainer.appendChild(maxWorkers);

    var maxWorkersPercent = document.createElement("div");
    maxWorkersContainer.appendChild(maxWorkersPercent);

    container.appendChild(maxWorkersContainer);

    var workerName = document.createElement("p");
    workerName.classList.add("name");
    workerName.innerText = connections[index].conn.peer;
    container.appendChild(workerName);

    workers.appendChild(container);
}

function UpdateConnectionDisplay(index) {
    var root = workers.children[index].children[1];

    root.children[0].innerText = connections[index].currentWorkers;
    root.children[1].style.setProperty("--percent", `${connections[index].currentWorkers / connections[index].conn.metadata.maxWorkers * 100}%`);
}

function ResetConnectionDisplay(index) {
    var root = workers.children[index].children[1];

    root.children[0].innerText = connections[index].conn.metadata.maxWorkers;
    root.children[1].removeAttribute("style");
}

function RemoveConnectionDisplay(index) {
    workers.children[index].style.display = "none";
=======
            start.disabled = false;
            start.textContent = "Start Computing";
        }
    });
>>>>>>> parent of 6b2479e (Added working distributed computing!)
=======
>>>>>>> parent of d8f7e0a (Made computing more resilient)
=======
>>>>>>> parent of d8f7e0a (Made computing more resilient)
}