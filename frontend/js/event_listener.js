// Function tạo carousel item
function createCarouselItem(imgSrc, activeSrc) {
  let img = document.createElement("img");
  img.setAttribute("src", imgSrc);
  img.setAttribute("class", "d-block w-100 target-img");
  img.setAttribute("alt", imgSrc.split("/").slice(-1)[0]);

  let imgWrapper = document.createElement("div");
  imgWrapper.setAttribute("class", "img-wrapper");
  imgWrapper.appendChild(img);

  let card = document.createElement("div");
  card.setAttribute("class", "card");
  card.appendChild(imgWrapper);

  let res = document.createElement("div");
  res.setAttribute("class", "carousel-item");

  if (imgSrc == activeSrc) {
    res.classList.add("active");
  }
  res.appendChild(card);
  return res;
}

// Cập nhật ảnh của Modal
function updateModal(imgSrc) {
  myModal.hide();
  let modalImg = document.getElementById("modal-img");
  modalImg.setAttribute("src", imgSrc);
  myModal.show();
}

// Lấy các element của Bootstrap
const myModal = new bootstrap.Modal(document.getElementById("gallery-modal"));
const myCarousel = new bootstrap.Carousel(
  document.getElementById("carouselExampleControls")
);
const myOffcanvas = new bootstrap.Offcanvas(
  document.getElementById("offcanvasBottom")
);

// Chuyển active carousel-item: Cập nhật hình trên Modal
document
  .getElementById("carouselExampleControls")
  .addEventListener("slid.bs.carousel", (event) => {
    updateModal(
      document.querySelector(".active").querySelector("img").getAttribute("src")
    );
  });

// Chuột trái
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("target-img")) {
    console.log("Lmao");
    updateModal(e.target.getAttribute("src"));
  }
});

// Chuột phải
document.addEventListener("contextmenu", function (e) {
  // Nếu element là hình keyframe: Hiện Offcanvas + Modal
  if (e.target.classList.contains("keyframeImg")) {
    e.preventDefault();
    let imgPath = e.target.getAttribute("src");
    // Gán ảnh của Modal là ảnh được target
    document.getElementById("modal-img").setAttribute("src", imgPath);

    let folderName = imgPath.split("/");
    folderName.pop();
    folderName = folderName.join("/");

    let innerCarousel = document.getElementById("carousel-inner");
    innerCarousel.innerHTML = "";

    let path = "http://localhost:3031" + folderName + "/";

    fetch(path).then((res) => {
      if (res.ok) {
        console.log("GOT KEYFRAME NAMES!");
        res.json().then((response) => {
          let fileNames = [];
          console.log(response);
          response.forEach((element) => {
            fileNames.push(element.name);
          });
          let index = 0;
          for (const imgName of fileNames) {
            let currentPath = folderName + "/" + imgName;
            innerCarousel.appendChild(
              createCarouselItem(folderName + "/" + imgName, imgPath)
            );
            if (currentPath == imgPath) {
              index = fileNames.indexOf(imgName);
            }
          }

          console.log(index);

          myCarousel.to(index);
          myModal.show();
          myOffcanvas.show();
        });
      } else {
        console.log("CANNOT GET KEYFRAME NAMES!");
      }
    });
  }
});

// Khi nhấn phím
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey) {
    if (e.key == ".") {
      myCarousel.next();
    }
    if (e.key == ",") {
      myCarousel.prev();
    }
    if (e.key == "c") {
      myOffcanvas.hide();
      myModal.hide();
    }
    if (e.key == "z") {
      myModal.hide();
    }
  }
});
