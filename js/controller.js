var workerScriptContent;
var worker;
var mainScriptURL;

var states = [
    "Connecting to Server",
    "Start Computing",
    "Computing"
];

var state = document.getElementById("state");

var queuedMessages = [];
var totalMaxWorkers = 0;
var currentWorkers = 0;

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
var computing = false;
peer.on("connection", conn => {
    var index;
    conn.on("open", () => {
        totalMaxWorkers += conn.metadata.maxWorkers;

        conn.send({command: "Compute Script", data: workerScriptContent});

        index = connections.length;

        connections.push({
            conn: conn,
            currentWorkers: 0,
            active: true
        });

        CreateConnectionDisplay(index);
    });

    conn.on("data", data => {
        if (data.command == "Close") {
            connections[index].active = false;

            totalMaxWorkers -= connections[index].conn.metadata.maxWorkers;
            currentWorkers -= data.data.length;

            if (totalMaxWorkers == 0 && computing) {
                computing = false;
                worker.terminate();
                DisplayResults("Session terminated");
            }
            else {
                for (var item of data.data) {
                    AssignTask(totalMaxWorkers, currentWorkers, item);
                }
            }

            RemoveConnectionDisplay(index);
        }
        else if (data.command == "Data") {
            worker.postMessage(data);

            if (queuedMessages.length > 0) {
                connections[index].conn.send(queuedMessages.shift());
            }
            else {
                connections[index].currentWorkers--;
                currentWorkers--;
    
                UpdateConnectionDisplay(index);
            }
        }
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
    if (connections.length == 0) return;

    computing = true;

    state.disabled = true;
    state.textContent = states[2];

    worker = new Worker(mainScriptURL);

    worker.addEventListener("message", e => {
        if (e.data.command == "Completed") {
            DisplayResults(e.data.result);

            for (var i = 0; i < connections.length; i++) {
                computing = false;

                ResetConnectionDisplay(i);

                if (connections[i].active)
                    connections[i].conn.send({command: "Stop"});
            }
        }
        else if (e.data.command == "Compute") {
            AssignTask(totalMaxWorkers, currentWorkers, e.data);
        }
    });

    for (var connection of connections) {
        if (connection.active)
            connection.conn.send({command: "Start"});
    }
}

function DisplayResults(data) {
    document.getElementById("result").textContent = data == undefined ? "undefined" : JSON.stringify(data);

    state.disabled = false;
    state.textContent = states[1];
}

function AssignTask(totalMaxWorkers, workers, data) {
    var targetPercent = workers / totalMaxWorkers;
    
    var gotWorker = false;
    var leastDifference = 0;
    var currentWorker = 0;

    for (var i = 0; i < connections.length; i++) {
        if (connections[i].active && connections[i].currentWorkers < connections[i].conn.metadata.maxWorkers) {
            var percent = connections[i].currentWorkers / connections[i].conn.metadata.maxWorkers;

            if (!gotWorker) {
                gotWorker = true;
                leastDifference = percent - targetPercent;
                currentWorker = i;
            }
            else if (percent - targetPercent < leastDifference) {
                leastDifference = percent - targetPercent;
                currentWorker = i;
            }
        }
    }

    if (gotWorker) {
        connections[currentWorker].conn.send(data);
        connections[currentWorker].currentWorkers++;
        currentWorkers++;

        UpdateConnectionDisplay(currentWorker);
    }
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
}