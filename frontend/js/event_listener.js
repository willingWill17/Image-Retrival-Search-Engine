import { currentResult, targetImg, fetchImageSearch, pageMove, openWin, switching_Collection, collectionSwitchBtn, SwitchStateOfTemporal } from "./request.js";
import { createToast } from "./notification.js";
import { myModal, myOffcanvas, myCarousel, activeKeyFrameView, isOffcanvasShown } from "./carousel.js";
import { socket, queueImg, rejectImg, submitImg, emitQueueImg, whole_query, update_query } from "./client.js";
import { submit_KIS_or_QNA, get_session_ID, get_evaluationID } from "./fetching.js";

// ***----------------------------------------------Standard Events---------------------------------------------***
const modeModal = new bootstrap.Modal(document.getElementById("mode-modal"));
modeModal.toggle();

const checkModal = new bootstrap.Modal(document.getElementById("check-modal"));

const submitModel = new bootstrap.Modal(document.getElementById("submit-modal"));

let mode = "practice";
let sessionID = '';
let evaluationID = '';

export let loginName = '';

let temp_query = ''
let api = "http://localhost:8053/";
let query_box = document.querySelector(".query-box");
let query_text = query_box.querySelector("textarea");
// Chuột phải
document.addEventListener("contextmenu", function (e) {
  // Nếu element là hình keyframe: Hiện Offcanvas + Modal
  if (e.target.classList.contains("keyframeImg")) {
    e.preventDefault();
    activeKeyFrameView(e.target.getAttribute("src"));
  }
});

export function update_query_box(query) {
  query_text.value = query;
}

function switch_searchTab() {
  let searchTab = document.getElementById('searchTab');
  let searchTextarea = document.getElementById("inputBlock0");
  let transcriptTab = document.getElementById('transcriptTab');
  let imageDropage = document.getElementById('image-search');

  let transcriptTextarea = document.getElementById("inputBlock3");

  if (searchTab.style.display === "none") {
    transcriptTab.style.display = "none";
    imageDropage.style.display = "none";
    // transcriptTextarea.value = "";
    searchTab.style.display = "block";
    searchTextarea.focus()
  }
  else {
    searchTab.style.display = "none";
    // searchTextarea.value = "";
    transcriptTab.style.display = "block";
    imageDropage.style.display = "block";
    transcriptTextarea.focus();
  }
}

function handleName() {
  let name = document.getElementById("login-name").value;
  if (name) {
    loginName = name;
    return true;
  } else {
    document.getElementById("name-warning").hidden = false;
    return false;
  }
}


// Switch State of temporal search
document.getElementById('StateOfTemporal').addEventListener("click", function (e) {
  SwitchStateOfTemporal();
})

// Khi nhấn phím
document.addEventListener("keydown", (e) => {
  if (isOffcanvasShown) {
    if (e.key == "d") {
      myCarousel.next();
    }
    if (e.key == "a") {
      myCarousel.prev();

    }
    if (e.key == "c" || (e.key == "g" && e.ctrlKey)) {
      myOffcanvas.hide();
      myModal.hide();
    }
    if (e.key == "z") {
      myModal.toggle();
    }
  }

  if (e.ctrlKey) {
    if (e.altKey && !e.shiftKey) {
      e.preventDefault();
      SwitchStateOfTemporal();
    }

    if (e.key === "`" && !isOffcanvasShown) {
      e.preventDefault();
      switch_searchTab();
    }

    if (e.key === "," && !isOffcanvasShown) {
      e.preventDefault();
      pageMove("left");
    }

    if (e.key === "." && !isOffcanvasShown) {
      e.preventDefault();
      pageMove("right");
    }

    if (e.key == "c") {
      let chosenImg = "";
      if (isOffcanvasShown) {
        chosenImg = document.querySelector(".modal-body img");
      } else {
        chosenImg = targetImg;
      }

      if (chosenImg) {
        e.preventDefault();
        let videoID = chosenImg.src.split("/").slice(-2)[0];
        let frameIdx = chosenImg.src.split("/").slice(-1)[0].split(".")[0];
        navigator.clipboard.writeText(videoID + ", " + frameIdx);
        createToast("success", "Copied video name!");
      }
    }

    // Open video
    if (e.key === "v" && isOffcanvasShown) {
      console.log("ctrl + v and turn on video");
      e.preventDefault();
      const src = document.querySelector(".modal-body").querySelector("img").src;
      const segments = src.split("/");
      const vid_name = segments[segments.length - 2];
      const frameidx = segments[segments.length - 1].split(".")[0];
      openWin(vid_name, frameidx);
    }

    if (e.key == "b") { // Similarity search
      e.preventDefault();

      if (isOffcanvasShown) {
        let ModalImg = document.querySelector(".modal-body img");
        myOffcanvas.hide();
        myModal.hide();

        currentResult.length = 0;
        fetchImageSearch(ModalImg);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }

      if (targetImg) {
        currentResult.length = 0;
        fetchImageSearch(targetImg);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }

    if (e.key == "e") {
      e.preventDefault();
      if (document.activeElement.tagName.toLowerCase() != "textarea") {
        let chosenImg = "";
        if (isOffcanvasShown) {
          chosenImg = document.querySelector(".modal-body img");
        } else {
          chosenImg = targetImg;
        }

        if (chosenImg) {
          if (submitImg.includes(chosenImg.getAttribute("src")))
            createToast("danger", "Oops, this image has already been submitted!");
          else {
            let videoID = chosenImg.src.split("/").slice(-2)[0];
            let frameIdx = chosenImg.src.split("/").slice(-1)[0].split(".")[0];
            document.getElementById("video-id").value = videoID;
            document.getElementById("frame-idx").value = frameIdx;
            submitModel.toggle();
            document.getElementById("qa-answer").focus();
          }
        }
      }
    }

    if (e.key == '/') {
      e.preventDefault();

      if (query_box.style.display == 'block') {
        query_box.style.display = 'none';
      }

      else {
        query_text.value = whole_query;
        query_box.style.display = 'block';
      }

      console.log('yes');
    }

    if (e.key == "h") {
      e.preventDefault();
      checkModal.toggle();
    }

    if (e.key == "x" && document.activeElement.tagName.toLowerCase() != "textarea") { // Queue img for admin check
      let chosenImg = "";

      if (isOffcanvasShown) {
        chosenImg = document.querySelector(".modal-body img");
      } else {
        chosenImg = targetImg;
        targetImg.style.border = "4px solid yellow";
      }

      if (chosenImg) {
        console.log(queueImg);
        if (rejectImg.includes(chosenImg.getAttribute("src")))
          createToast("danger", "Oops, this image was rejected before!");
        else if (queueImg.includes(chosenImg.getAttribute("src")))
          createToast("danger", "Oops, this image has already been queued!");
        else if (submitImg.includes(chosenImg.getAttribute("src")))
          createToast("danger", "Oops, this image has already been submitted!");
        else {
          document.querySelector(".modal-body img").style['border'] = '4px solid yellow';
          emitQueueImg(chosenImg);
        }
      }
      queueImg.push(targetImg.src);
    }
  }

  if (e.altKey) {
    let sectionNum = '1';
    if (document.activeElement.tagName.toLocaleLowerCase() == "textarea") {
      sectionNum = document.activeElement.getAttribute("id").slice(-1);
    }
    switch (e.key) {
      case "`": // Switch between textaread field of the "current scene" or the "next scene"
        document.getElementById(`inputBlock${sectionNum == '0' ? '1' : '0'}`).focus();
        break;
      case "1": // Clear the input of the current focused textarea field
        document.getElementById(`inputBlock${sectionNum}`).value = "";
        break;
      case "2": // Clear all the input of the filters area
        document.getElementById(`object${sectionNum}`).value = "";
        document.getElementById(`color${sectionNum}`).value = "";
        document.getElementById(`ocr${sectionNum}`).value = "";
        break;
      case "3": // Clear all the input of every textarea field
        console.log('im here mtfk');
        document.getElementById(`inputBlock0`).value = "";
        document.getElementById(`object0`).value = "";
        document.getElementById(`color0`).value = "";
        document.getElementById(`ocr0`).value = "";
        document.getElementById(`inputBlock1`).value = "";
        document.getElementById(`object1`).value = "";
        document.getElementById(`color1`).value = "";
        document.getElementById(`ocr1`).value = "";
    }
  }
});

document
  .getElementById("carouselExampleControls")
  .addEventListener("slid.bs.carousel", (_) => {
    let imgSrc = document.querySelector(".active").querySelector("img").getAttribute("src");

    let modalImg = document.querySelector(".modal-body img");

    modalImg.style['border'] = "4px solid black";

    for (const dir of queueImg) {
      if (dir === imgSrc) {
        modalImg.style['border'] = "4px solid yellow";
      }
    }

    for (const dir of rejectImg) {
      if (dir === imgSrc) {
        modalImg.style['border'] = "4px solid red";
      }
    }

    for (const dir of submitImg) {
      if (dir === imgSrc) {
        modalImg.style['border'] = "4px solid lime";
      }
    }
  });

document.getElementById("gallery-modal").addEventListener("shown.bs.modal", (_) => {
  let imgSrc = document.querySelector(".active").querySelector("img").getAttribute("src");

  let modalImg = document.querySelector(".modal-body img");

  modalImg.style['border'] = "4px solid black";

  for (const dir of queueImg) {
    if (dir === imgSrc) {
      modalImg.style['border'] = "4px solid yellow";
      break;
    }
  }

  for (const dir of rejectImg) {
    if (dir === imgSrc) {
      modalImg.style['border'] = "4px solid red";
      break;
    }
  }
});

document.getElementById("check-modal").addEventListener("shown.bs.modal", (_) => {
  console.log(submitImg);
  let modalBody = document.getElementById("check-modal").querySelector(".list-group");
  modalBody.innerHTML = "";
  submitImg.forEach(imgSrc => {
    let videoID = imgSrc.split("/").slice(-2)[0];
    let frameIdx = imgSrc.split("/").slice(-1)[0].split(".")[0];
    let videoName = videoID + ", " + frameIdx;

    let imgBtn = document.createElement("button");
    imgBtn.setAttribute("type", "button");
    imgBtn.setAttribute("class", "list-group-item list-group-item-action");
    imgBtn.innerHTML = videoName;

    imgBtn.addEventListener("click", (_) => {
      navigator.clipboard.writeText(videoName);
      createToast("success", `Coppied: ${videoName}`);
    });
    modalBody.appendChild(imgBtn);
  });
});



// switch collection
collectionSwitchBtn.addEventListener("click", function (e) {
  switching_Collection();
})

document.addEventListener("keydown", function (e) {
  if (e.code === "Space" && e.ctrlKey) {
    e.preventDefault();
    switching_Collection();
  }
})

query_box.addEventListener('keyup', function (e) {
  if (query_box.style.display == 'block') {
    update_query(query_text.value)
  }
})

document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", function (_) {
    if (handleName()) {
      mode = btn.innerHTML == "Practice Mode" ? "practice" : "competition";
      console.log(mode);
      get_session_ID(mode).then(sID => {
        sessionID = sID;
        get_evaluationID(sID, mode).then(eID => evaluationID = eID);
      });
      modeModal.toggle();
    }
  })
});

document.getElementById("submit-btn").addEventListener("click", () => {
  let qa_answer = document.getElementById("qa-answer").value.trim();
  let video_name = document.getElementById("video-id").value;
  let frame_idx = document.getElementById("frame-idx").value;
  let qs_type = "KIS";
  if (qa_answer) qs_type = "QA";
  console.log(qa_answer, video_name, frame_idx, qs_type);
  submit_KIS_or_QNA(loginName, socket, qa_answer, video_name, frame_idx, qs_type, sessionID, evaluationID, mode);
  submitModel.toggle();
})

document.getElementById("qa-answer").addEventListener("keydown", (e) => {
  if (e.key == "Enter") document.getElementById("submit-btn").click();
})