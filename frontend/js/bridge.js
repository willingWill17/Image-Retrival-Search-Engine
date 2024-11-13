export function emitToast(socket, id, message) {
    socket.emit("listen-noti", id, message);
}
