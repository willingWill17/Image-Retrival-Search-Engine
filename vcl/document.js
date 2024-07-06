let palattes = document.getElementsByClassName("palette");
let canvasBlock0 = document.getElementById("canvasBlock0");
let canvasBlock1 = document.getElementById("canvasBlock1");

for (palatte of palattes) {
  palatte.addEventListener("dragstart", function (e) {
    let selected = e.target;

    canvasBlock0.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    canvasBlock0.addEventListener("drop", function (e) {
      canvasBlock0.appendChild(selected);
      selected.style.position = "absolute";
    });
  });
}
