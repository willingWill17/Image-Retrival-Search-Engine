// let palettes = document.getElementsByClassName("palette");
let canvasBlock0 = document.getElementById("canvasBlock0");


const desiredWidth = 30; 
const desiredHeight = 30; 

// Add event listeners for canvasBlock0
canvasBlock0.addEventListener("dragover", function (e) {
  e.preventDefault();
});

canvasBlock0.addEventListener("drop", function (e) {
  e.preventDefault();
  let data = e.dataTransfer.getData("text");
  let draggedElement = document.getElementById(data);
  
  // Ensure the dropped element is an <img> element
  if (draggedElement.tagName.toLowerCase() === 'img') {
    // Append the dragged element to the drop zone
    canvasBlock1.appendChild(draggedElement);
    
    // Optionally, position the dropped element within the drop zone
    let rect = canvasBlock1.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    draggedElement.style.position = "absolute";
    draggedElement.style.left = x + "px";
    draggedElement.style.top = y + "px";
    draggedElement.style.width = desiredWidth + "px";
    draggedElement.style.height = desiredHeight + "px";
  }
});

let canvasBlock1 = document.getElementById("canvasBlock1");

// Add event listeners for canvasBlock1
canvasBlock1.addEventListener("dragover", function (e) {
  e.preventDefault();
});

canvasBlock1.addEventListener("drop", function (e) {
  e.preventDefault();
  let data = e.dataTransfer.getData("text");
  let draggedElement = document.getElementById(data);
  
  // Ensure the dropped element is an <img> element
  if (draggedElement.tagName.toLowerCase() === 'img') {
    // Append the dragged element to the drop zone
    canvasBlock1.appendChild(draggedElement);
    
    // Optionally, position the dropped element within the drop zone
    let rect = canvasBlock1.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    draggedElement.style.position = "absolute";
    draggedElement.style.left = x + "px";
    draggedElement.style.top = y + "px";
    draggedElement.style.width = desiredWidth + "px";
    draggedElement.style.height = desiredHeight + "px";
  }
});

// Add dragstart event listeners to palettes

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
  console.log()
}