var states = [
    "Connecting to Server",
    "Connect to Controller",
    "Connecting to Controller",
    "Waiting",
    "Computing"
];

var stateInput = document.getElementById("state");
var controllerInput = document.getElementById("controller");
var passwordInput = document.getElementById("password");
var maxWorkersInput = document.getElementById("maxWorkers");

function setState(disabled) {
    stateInput.disabled = disabled;
    controllerInput.disabled = disabled;
    passwordInput.disabled = disabled;
    maxWorkersInput.disabled = disabled;
}

var maxWorkers = 1;

var peer = new Peer(options = {
    host: "distributedcompute.profsmart.repl.co",
    secure: true,
    debug: 2
});

peer.on("open", id => {
    document.getElementById("id").textContent = "ID: " + id;
    stateInput.textContent = states[1];
    setState(false);
});

peer.on("error", err => {
    if (err.type == "peer-unavailable") {
        stateInput.textContent = states[1];
        setState(false);
    }
});

var workerScriptURL;

function connect(e) {
    e.preventDefault();

    var controller = controllerInput.value;
    maxWorkers = maxWorkersInput.value;

    if (controller && maxWorkers > 0) {
        stateInput.textContent = states[2];
        setState(true);
        
        var controllerConnection = peer.connect(controller, {
            metadata: {
                maxWorkers: maxWorkers,
                password: passwordInput.value
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
                stateInput.textContent = states[4];
            }
            else if (data.command == "Stop") {
                stateInput.textContent = states[3];
            }
            else if (data.command == "Close") {
                stateInput.textContent = states[1];
                setState(false);
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
            stateInput.textContent = states[3];
        });
    }
}