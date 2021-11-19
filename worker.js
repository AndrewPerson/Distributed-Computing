var peer = new Peer({
    host: "https://distributedcompute.profsmart.repl.co",
    port: 9000,
    secure: true
}); 

function connectToController(id) {
    peer.connect(id);
}