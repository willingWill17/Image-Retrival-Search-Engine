let canvasBlock0 = document.getElementById("canvasBlock0");
let canvasBlock1 = document.getElementById("canvasBlock1");

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
  }
});

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
  }
});
