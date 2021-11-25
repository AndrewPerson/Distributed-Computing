var search = new URLSearchParams(window.location.search);

if (search.get("file") == "worker") {
    document.getElementById("fileName").innerText = "Upload worker javascript file";
}

caches.open("files").then(async cache => {
    if (search.get("file") == "worker") {
        var file = await cache.match("worker");

        if (file) {
            await saveFile(file);
            showContinueButton();
        }
    }
    else {
        var file = await cache.match("main");

        if (file) {
            await saveFile(file);
            showContinueButton();
        }
    }
});

const allowedFiles = [".js"];

function nextPage() {
    var worker = new URLSearchParams(window.location.search).get("file") == "worker";

    if (worker) {
        location.href = `${location.origin}/controller.html`;
    }
    else {
        location.href = `${location.origin}/upload.html?file=worker`;
    }
}

function updateFileName(name) {
    document.getElementById("fileName").innerText = name;
}

function showContinueButton() {
    document.getElementById("continue").style = undefined;
}

async function saveFile(file) {
    var text = await file.text();
    document.getElementById("code").innerHTML = text.replace(/\n/g, "<br>");
    hljs.highlightBlock(document.getElementById("code"));

    var worker = new URLSearchParams(window.location.search).get("file") == "worker";

    var cache = await caches.open("files");
    await cache.put(worker ? "worker" : "main", new Response(text));
}

function handleFiles(files) {
    var foundValidFile = false;

    for (var i = 0; i < files.length; i++) {
        if (!files[i].kind || files[i].kind == 'file') {
            var file = files[i].getAsFile ? files[i].getAsFile() : files[i];

            if (allowedFiles.some(value => file.name.endsWith(value))) {
                saveFile(file);

                updateFileName(file.name);

                foundValidFile = true;

                break;
            }
        }
    }

    if (foundValidFile) showContinueButton();
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

function dropHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        var items = ev.dataTransfer.items;

        handleFiles(items);
    }
    else {
        var files = ev.dataTransfer.files;

        handleFiles(files);
    }

    removeDragData(ev);
}

function removeDragData(ev) {
    if (ev.dataTransfer.items) {
        ev.dataTransfer.items.clear();
    }
    else {
        ev.dataTransfer.clearData();
    }
}