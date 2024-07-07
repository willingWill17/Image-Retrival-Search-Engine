let palettes = document.getElementsByClassName("palette");
let canvasBlock0 = document.getElementById("canvasBlock0");
let canvasBlock1 = document.getElementById("canvasBlock1");

// Set desired width and height for the images when they are dropped
const desiredWidth = 30; // Set to the desired width
const desiredHeight = 30; // Set to the desired height

// Add event listeners for canvasBlock0
canvasBlock0.addEventListener("dragover", function (e) {
  e.preventDefault();
});

canvasBlock0.addEventListener("drop", function (e) {
  e.preventDefault();
  let selected = document.querySelector('.dragging');
  let rect = canvasBlock0.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  selected.style.position = "absolute";
  selected.style.left = x + "px";
  selected.style.top = y + "px";
  selected.style.width = desiredWidth + "px";
  selected.style.height = desiredHeight + "px";
  canvasBlock0.appendChild(selected);
});

// Add event listeners for canvasBlock1
canvasBlock1.addEventListener("dragover", function (e) {
  e.preventDefault();
});

canvasBlock1.addEventListener("drop", function (e) {
  e.preventDefault();
  let selected = document.querySelector('.dragging');
  let rect = canvasBlock1.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  selected.style.position = "absolute";
  selected.style.left = x + "px";
  selected.style.top = y + "px";
  selected.style.width = desiredWidth + "px";
  selected.style.height = desiredHeight + "px";
  canvasBlock1.appendChild(selected);
});

// Add dragstart event listeners to palettes
for (let palette of palettes) {
  palette.addEventListener("dragstart", function (e) {
    e.target.classList.add('dragging');
  });

  palette.addEventListener("dragend", function (e) {
    e.target.classList.remove('dragging');
  });
}
  