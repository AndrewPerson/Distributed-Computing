<<<<<<< HEAD
var states = [
    "Connecting to Server",
    "Connect to Controller",
    "Connecting to Controller",
    "Waiting",
    "Computing"
];

var state = document.getElementById("state");

var maxWorkers = 1;

var peer = new Peer(options = {
    host: "distributedcompute.profsmart.repl.co",
    secure: true,
    debug: 2
});

peer.on("open", id => {
    document.getElementById("id").textContent = "ID: " + id;
    state.textContent = states[1];
    state.disabled = false;
});

peer.on("error", err => {
    if (err.type == "peer-unavailable") {
        state.textContent = states[1];
        state.disabled = false;

        document.getElementById("controller").disabled = false;
        document.getElementById("maxWorkers").disabled = false;
    }
});

var workerScriptURL;

function connect(e) {
    e.preventDefault();

    var controllerInput = document.getElementById("controller");
    var controller = controllerInput.value;
    controllerInput.disabled = true;

    var maxWorkersInput = document.getElementById("maxWorkers");
    maxWorkers = maxWorkersInput.value;
    maxWorkersInput.disabled = true;

    if (controller && maxWorkers > 0) {
        state.textContent = states[2];
        state.disabled = true;
        
        var controllerConnection = peer.connect(controller, {
            metadata: {
                maxWorkers: maxWorkers
            }
        });

        window.addEventListener("unload", () => {
            controllerConnection.send({
                command: "Close",
                data: Object.keys(processingData).map(key => ({
                    id: key,
                    data: processingData[key]
                }))
            });
        });

        var processingData = {};
        controllerConnection.on("data", data => {
            if (data.command == "Compute Script") {
                workerScriptURL = URL.createObjectURL(new Blob([data.data], {type: "text/javascript"}));
            }
            else if (data.command == "Start") {
                state.textContent = states[4];
            }
            else if (data.command == "Stop") {
                state.textContent = states[3];
            }
            else if (data.command == "Compute") {
                processingData[data.id] = data.data;

                var worker = new Worker(workerScriptURL);

                worker.addEventListener("message", e => {
                    delete processingData[data.id];

                    controllerConnection.send({
                        command: "Data",
                        id: data.id,
                        data: e.data
                    });
                });

                worker.postMessage(data.data);
            }
        });
        
        controllerConnection.on("open", () => {
            state.textContent = states[3];
        });
    }
}
=======
>>>>>>> parent of 6b2479e (Added working distributed computing!)
