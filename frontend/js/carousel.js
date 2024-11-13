import { createToast } from "./notification.js";
import { queueImg, rejectImg, submitImg } from "./client.js";

// ***------------------------------------Public Variables-----------------------------------------------***
export const myModal = new bootstrap.Modal(document.getElementById("gallery-modal"));
export const myOffcanvas = new bootstrap.Offcanvas(
  document.getElementById("offcanvasBottom")
);

// Set up slide carousel
let multipleCardCarousel = document.querySelector("#carouselExampleControls");
export const myCarousel = new bootstrap.Carousel(multipleCardCarousel, {
  interval: false,
});

let initialPos = 0;
let cardWidth = $(".carousel-item").width();
let scrollPosition = 0;

// Modal & Offcanvas visibility
export let isModalShown = false;
export let isOffcanvasShown = false;
export let offcanvasImg = "";

// ***------------------------------------Functions-----------------------------------------------***

document.querySelector(".modal-body").querySelector("img").addEventListener("mouseenter", (e) => {
  e.preventDefault();
  offcanvasImg = document.querySelector(".modal-body img");
});

document.querySelector(".modal-body").querySelector("img").addEventListener("mouseleave", (e) => {
  e.preventDefault();
  offcanvasImg = "";
});

const lazyLoad = (target) => {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.setAttribute("src", img.getAttribute("data-lazy"));
        observer.unobserve(img);
      }
    });
  });
  io.observe(target);
};

function updateModal(imgSrc) {
  console.log(imgSrc);
  console.log(submitImg[0]);
  console.log(submitImg.includes(imgSrc));
  if (isModalShown) {
    myModal.hide();
    let modalImg = document.getElementById("modal-img");
    modalImg.setAttribute("src", imgSrc);
    myModal.show();
    // if (submitImg.includes(imgSrc)) {
    //   modalImg.style.border = "4px solid lime";
    // }
    // else if (rejectImg.includes(imgSrc)) {
    //   modalImg.style.border = "4px solid red";
    // }
    // else if (queueImg.includes(imgSrc)) {
    //   modalImg.style.border = "4px solid yellow";
    // }
  } else {
    let modalImg = document.getElementById("modal-img");
    modalImg.setAttribute("src", imgSrc);
    myModal.show();
    // if (submitImg.includes(imgSrc)) {
    //   modalImg.style.border = "4px solid lime";
    // }
    // else if (rejectImg.includes(imgSrc)) {
    //   modalImg.style.border = "4px solid red";
    // }
    // else if (queueImg.includes(imgSrc)) {
    //   modalImg.style.border = "4px solid yellow";
    // }
  }
}

function createCarouselItem(imgSrc, activeSrc) {
  let img = document.createElement("img");
  img.setAttribute("data-lazy", imgSrc);
  img.setAttribute("class", "d-block w-100 target-img");
  img.setAttribute("alt", imgSrc.split("/").slice(-1)[0]);
  lazyLoad(img);

  let p = document.createElement("p");
  p.innerHTML = imgSrc.split("/").slice(-1)[0].split(".")[0];

  let imgWrapper = document.createElement("div");
  imgWrapper.setAttribute("class", "img-wrapper");
  imgWrapper.appendChild(p);
  imgWrapper.appendChild(img);

  imgWrapper.addEventListener("mouseenter", (e) => {
    e.preventDefault();
    offcanvasImg = img;
  });

  imgWrapper.addEventListener("mouseleave", (e) => {
    e.preventDefault();
    offcanvasImg = "";
  });

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

function slideCarousel() {
  $("#carouselExampleControls .carousel-inner").animate(
    { scrollLeft: scrollPosition },
    60
  );
  $("#carouselExampleControls .carousel-inner").finish();
  let currentPos = document.querySelector(".carousel-item.active").getBoundingClientRect().left;
  console.log(initialPos);
  console.log(currentPos);
  scrollPosition -= (initialPos - currentPos);
}

// Update Offcanvas title
function updateOffcanvasTitle() {
  let title = document.querySelector("#offcanvasBottomLabel");
  let imgSrc = document.querySelector(".active img").getAttribute("data-lazy");
  let newTitle =
    imgSrc.split("/").slice(-2)[0] +
    "_" +
    imgSrc.split("/").slice(-1)[0].split(".")[0];
  title.innerHTML = newTitle;
}



export function activeKeyFrameView(imgPath) {
  // Gán ảnh của Modal là ảnh được target
  let modalImg = document.getElementById("modal-img")
  modalImg.setAttribute("src", imgPath);

  // Get the video directory path
  let videoID = imgPath.split("/").slice(-2)[0];

  let innerCarousel = document.getElementById("carousel-inner");
  innerCarousel.innerHTML = "";

  let folderName = imgPath.split("/");
  folderName.pop();
  folderName = folderName.join("/");

  console.log(videoID);
  let path = "http://localhost:3031/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/data/keyframe_resized/json/" + videoID + ".json";
  fetch(path).then((res) => {
    if (res.ok) {
      res.json().then((response) => {
        let fileNames = [];
        let index = 0;
        Object.entries(response).forEach((element, _) => {
          let imgName = element[1].split("/").pop();
          let currentPath = folderName + "/" + imgName;
          innerCarousel.appendChild(createCarouselItem(folderName + "/" + imgName, imgPath));
          if (currentPath == imgPath) {
            index = fileNames.indexOf(imgName);
          }
        });

        let rect = document.querySelector(".carousel-item.active").getBoundingClientRect();
        cardWidth = Math.round(rect.width * 10) / 10;
        console.log(cardWidth);
        scrollPosition = (index - 1) * cardWidth;
        initialPos = cardWidth * 4;
        scrollPosition -= (initialPos - rect.left);
        slideCarousel();
        updateOffcanvasTitle();
        myModal.show();
        myOffcanvas.show();
        if (submitImg.includes(imgPath)) {
          modalImg.style.border = "4px solid lime";
        }
        else if (rejectImg.includes(imgPath)) {
          modalImg.style.border = "4px solid red";
        }
        else if (queueImg.includes(imgPath)) {
          modalImg.style.border = "4px solid yellow";
        }
      });
    } else {
      createToast("danger", "CANNOT GET KEYFRAME NAMES!");
    }
  })
    .catch(e => createToast("danger", `ERROR: ${e.message}`));
}

// ***------------------------------------Carousel Events-----------------------------------------------***
document
  .getElementById("carouselExampleControls")
  .addEventListener("slide.bs.carousel", (event) => {
    if ($(".carousel-inner .carousel-item:last").hasClass("active")) {
      console.log("Lmao");
    }
    if (event.to == 0 && event.from > event.to) {
      scrollPosition = 0;
    } else if (event.from == 0 && event.to - event.from != 1) {
      scrollPosition = document.querySelectorAll(".carousel-item").length * cardWidth;
    } else if (event.to > event.from) {
      // Slide right
      scrollPosition += cardWidth;
    } else {
      // Slide left
      if (scrollPosition > 0) {
        scrollPosition -= cardWidth;
      }
    }
    slideCarousel();
  });

// Chuyển active carousel-item: Cập nhật hình trên Modal
document
  .getElementById("carouselExampleControls")
  .addEventListener("slid.bs.carousel", (event) => {
    updateModal(
      document.querySelector(".active").querySelector("img").getAttribute("src")
    );
    updateOffcanvasTitle();
  });




// ***----------------------------------------------Modal Events------------------------------------------------***
document.getElementById("gallery-modal").addEventListener("hidden.bs.modal", (_) => {
  isModalShown = false;
});

document.getElementById("gallery-modal").addEventListener("shown.bs.modal", (_) => {
  isModalShown = true;
});

// ***----------------------------------------------Offcanvas Events------------------------------------------------***
document.getElementById("offcanvasBottom").addEventListener("hidden.bs.offcanvas", (_) => {
  isOffcanvasShown = false;
});

document.getElementById("offcanvasBottom").addEventListener("shown.bs.offcanvas", (_) => {
  isOffcanvasShown = true;
});
