var states = [
    "Connecting to Server",
    "Connect to Controller",
    "Connecting to Controller",
    "Waiting",
    "Computing"
];

var state = document.getElementById("state");

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
    }
});

var workerScriptURL;

function connect(e) {
    e.preventDefault();

    var controller = document.getElementById("controller").value;
    if (controller) {
        state.textContent = states[2];
        state.disabled = true;
        
        var controllerConnection = peer.connect(controller);

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
                var worker = new Worker(workerScriptURL);

                worker.addEventListener("message", e => {
                    controllerConnection.send({
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