import { post } from "./request.js";
let canvasBlock0 = document.getElementById("canvasBlock0");

let query0 = "";
let query1 = "";

let objects0 = [];
let objects1 = [];

let pos0 = [];
let pos1 = [];

const desiredWidth = 30;
const desiredHeight = 30;

function getData() {
  let res = {
    query: [
      {
        textual: query0,
        objects: objects0.join(" "),
        txt: convertPosToStr(pos0),
      },
      {
        textual: query1,
        objects: objects1.join(" "),
        txt: convertPosToStr(pos1),
      },
    ],
  };
  res.query = res.query.map((obj) => {
    let filteredObject = {};
    for (let key in obj) if (obj[key]) filteredObject[key] = obj[key];
    return filteredObject;
  });

  res.query = res.query.filter((e) => Object.keys(e).length);
  return JSON.stringify(res);
}

function convertPosToStr(pos) {
  let res = [];
  pos.forEach((element) => {
    res.push(element.join(" "));
  });
  return res.join(" ");
}

function calcGridPos(x, y, name) {
  let size = 13;
  let cellWidth = canvasBlock0.clientWidth / size;
  let cellHeight = canvasBlock0.clientHeight / size;

  let startX = Math.max(0, Math.floor(x / cellWidth));
  let startY = Math.max(0, Math.floor(y / cellHeight));

  let endX = Math.min(size, Math.ceil((x + desiredWidth) / cellWidth));
  let endY = Math.min(size, Math.ceil((y + desiredHeight) / cellHeight));

  let res = [];
  for (let i = startX; i < endX; i++) {
    for (let j = startY; j < endY; j++) {
      let temp = String(i) + String.fromCharCode(97 + j) + name;
      res.push(temp);
    }
  }
  return res;
}

// Add event listeners for canvasBlock0
canvasBlock0.addEventListener("dragover", function (e) {
  e.preventDefault();
});

canvasBlock0.addEventListener("drop", function (e) {
  e.preventDefault();

  let formData = new FormData(document.getElementById("request"));
  query0 = formData.get("scene_description");
  query1 = formData.get("next_scene_description");

  let data = e.dataTransfer.getData("text");
  if (!objects0.includes(data)) {
    objects0.push(data);
  }

  let draggedElement = document.getElementById(data);

  // Ensure the dropped element is an <img> element
  if (draggedElement.tagName.toLowerCase() === "img") {
    // Append the dragged element to the drop zone
    canvasBlock0.appendChild(draggedElement);

    // Optionally, position the dropped element within the drop zone
    let rect = canvasBlock1.getBoundingClientRect();
    let x = e.clientX - rect.left - desiredWidth / 2;
    let y = e.clientY - rect.top - desiredHeight / 2;
    draggedElement.style.position = "absolute";
    draggedElement.style.left = x + "px";
    draggedElement.style.top = y + "px";
    draggedElement.style.width = desiredWidth + "px";
    draggedElement.style.height = desiredHeight + "px";

    console.log(objects0);
    if (objects0.includes(data)) {
      let index = objects0.indexOf(data);
      pos0[index] = calcGridPos(
        e.clientX - canvas0.getBoundingClientRect().x,
        e.clientY - canvas0.getBoundingClientRect().y,
        data
      );
    } else {
      pos0.push(
        calcGridPos(
          e.clientX - canvas0.getBoundingClientRect().x,
          e.clientY - canvas0.getBoundingClientRect().y,
          data
        )
      );
    }
    post(getData());

    console.log(getData());
  }
});

let canvasBlock1 = document.getElementById("canvasBlock1");

// Add event listeners for canvasBlock1
canvasBlock1.addEventListener("dragover", function (e) {
  e.preventDefault();
});

canvasBlock1.addEventListener("drop", function (e) {
  e.preventDefault();

  let formData = new FormData(document.getElementById("request"));
  query0 = formData.get("scene_description");
  query1 = formData.get("next_scene_description");

  let data = e.dataTransfer.getData("text");
  if (!objects1.includes(data)) {
    objects1.push(data);
  }

  let draggedElement = document.getElementById(data);

  // Ensure the dropped element is an <img> element
  if (draggedElement.tagName.toLowerCase() === "img") {
    // Append the dragged element to the drop zone
    canvasBlock1.appendChild(draggedElement);

    // Optionally, position the dropped element within the drop zone
    let rect = canvasBlock1.getBoundingClientRect();
    let x = e.clientX - rect.left - desiredWidth / 2;
    let y = e.clientY - rect.top - desiredHeight / 2;
    draggedElement.style.position = "absolute";
    draggedElement.style.left = x + "px";
    draggedElement.style.top = y + "px";
    draggedElement.style.width = desiredWidth + "px";
    draggedElement.style.height = desiredHeight + "px";

    console.log(objects1);
    if (objects1.includes(data)) {
      let index = objects1.indexOf(data);
      pos1[index] = calcGridPos(
        e.clientX - canvas1.getBoundingClientRect().x,
        e.clientY - canvas1.getBoundingClientRect().y,
        data
      );
    } else {
      pos1.push(
        calcGridPos(
          e.clientX - canvas1.getBoundingClientRect().x,
          e.clientY - canvas1.getBoundingClientRect().y,
          data
        )
      );
    }
    post(getData());

    console.log(getData());
  }
});

// document.getElementById("request").addEventListener("submit", function (e) {
//     e.preventDefault();
//     let formData = new FormData(e.target);
//     query0 = formData.get("scene_description");
//     query1 = formData.get("next_scene_description");
//     post(getData())

//     console.log(getData());
// });
