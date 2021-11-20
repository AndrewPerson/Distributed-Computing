var workerScriptContent;
var mainScriptURL;
var peer = new Peer(options = {
    host: "distributedcompute.profsmart.repl.co",
    secure: true,
    debug: 3,
    path: "/"
});

peer.on("open", id => {
    document.getElementById("id").textContent = id;
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
    var start = document.getElementById("start");
    start.disabled = true;
    start.textContent = "Computing...";

    var worker = new Worker(mainScriptURL);

    worker.addEventListener("message", e => {
        if (e.data.command == "Completed") {
            document.getElementById("result").textContent = e.data.result == undefined ? "undefined" : JSON.stringify(e.data.result);

            start.disabled = false;
            start.textContent = "Start Computing";
        }
    });
}