// ***----------------------------------------------Public variables------------------------------------***

let fileNames = []

let queue = []
let rejectQueue = [];
let submitQueue = [];
let whole_query = '';
const io = require("socket.io")(5053, {
  cors: {
    origin: ["http://localhost:3031", "http://localhost:1999", "https://admin.socket.io/"],
  },
});

const admin = io.of('/boss');

// ***----------------------------------------------Functions------------------------------------***

function emitNoti(id, message) {
  io.emit("display-noti", id, message);
  admin.emit("display-noti", id, message);
}

function emitQueueUpdate(type, imgSrc) {
  io.emit("queue-update", type, imgSrc);
  admin.emit("queue-update", queue, submitQueue);
}

// ***----------------------------------------------Connections------------------------------------***

// Peasants
io.on("connection", (socket) => {
  socket.emit("get-queue", queue, rejectQueue, submitQueue);
  socket.on("queue-image", (imgPath, frame_idx) => {
    queue.push(imgPath);
    emitQueueUpdate("queue", imgPath);
    emitNoti("warning", `Queued: ${imgPath.split("/").slice(-2)[0]}/${imgPath.split("/").slice(-1)[0]}`);
  });
  socket.emit("get-query", whole_query);
  socket.on("update-query", query => {
    whole_query = query;
    io.emit("get-query", whole_query);
  });
  socket.on("listen-noti", (id, message) => {
    emitNoti(id, message);
  });
  socket.on("submit-image", (imgPath) => {
    queue.splice(queue.indexOf(imgPath), 1);
    submitQueue.push(imgPath);
    emitNoti("success", `Submitted: ${imgPath.split("/").slice(-2)[0]}/${imgPath.split("/").slice(-1)[0]}`);
    emitQueueUpdate("submit", imgPath);
  });
});

// Admin
admin.on("connection", (socket) => {
  admin.emit("queue-update", queue, submitQueue);
  admin.emit("update-file-names", fileNames);
  console.log("I am TAD, bitch");

  socket.on("submit-image", (imgPath) => {
    queue.splice(queue.indexOf(imgPath), 1);
    submitQueue.push(imgPath);
    emitNoti("success", `Submitted: ${imgPath.split("/").slice(-2)[0]}/${imgPath.split("/").slice(-1)[0]}`);
    emitQueueUpdate("submit", imgPath);
  });

  socket.on("reject-image", (imgPath) => {
    queue.splice(queue.indexOf(imgPath), 1);
    rejectQueue.push(imgPath);
    emitNoti("danger", `Rejected: ${imgPath.split("/").slice(-2)[0]}/${imgPath.split("/").slice(-1)[0]}`);
    emitQueueUpdate("reject", imgPath);
  });

  socket.on("change-image", (oldPath, newPath) => {
    queue.splice(queue.indexOf(oldPath), 1);
    submitQueue.push(newPath);
    emitNoti("primary", `Submitted ${newPath.split("/").slice(-2)[0]}/${newPath.split("/").slice(-1)[0]} instead of ${oldPath.split("/").slice(-2)[0]}/${oldPath.split("/").slice(-1)[0]}`);
    emitQueueUpdate("submit", newPath);
  });

  socket.on("empty-queue", () => {
    queue = [];
    rejectQueue = [];
    submitQueue = [];
    emitNoti("primary", `Empty queue`);
    emitQueueUpdate("empty", "");
  })

  socket.on("add-file-name", name => {
    fileNames.push(name);
    admin.emit("update-file-names", fileNames);
  })

  socket.emit("get-query", whole_query);
  socket.on("update-query", query => {
    whole_query = query;
    socket.emit("get-query", whole_query);
  });
  socket.on("listen-noti", (id, message) => {
    emitNoti(id, message);
  });
});

