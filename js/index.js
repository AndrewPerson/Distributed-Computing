function gotoWorker() {
    location.href = `${location.origin}/worker.html`;
}

async function gotoController() {
    var cache = await caches.open("files");

    var workerScriptPromise = cache.match("worker");
    var mainScriptPromise = cache.match("main");

    if (workerScriptPromise && mainScriptPromise)
        location.href = `${location.origin}/controller.html`;
    else if (workerScriptPromise)
        location.href = `${location.origin}/upload.html?file=worker`;
    else
        location.href = `${location.origin}/upload.html`;
}