import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import { createToast } from "./notification.js";
import { myModal, myOffcanvas, myCarousel, activeKeyFrameView } from "./carousel.js";
import { submit_KIS_or_QNA, get_session_ID, get_evaluationID } from "./fetching.js";

const fps30Files = ['L06_V003', 'L09_V009', 'L15_V003', 'L15_V004', 'L15_V005', 'L15_V008',
  'L15_V009', 'L15_V010', 'L15_V011', 'L15_V012', 'L15_V015', 'L15_V016', 'L15_V017', 'L15_V018',
  'L15_V019', 'L15_V022', 'L15_V023', 'L15_V024', 'L15_V025', 'L15_V028', 'L15_V029', 'L15_V030',
  'L16_V001', 'L16_V002', 'L16_V003', 'L16_V006', 'L16_V007', 'L16_V008', 'L16_V009', 'L16_V012',
  'L16_V013', 'L16_V014', 'L16_V015', 'L16_V016', 'L16_V019', 'L16_V020', 'L16_V021', 'L16_V022',
  'L16_V023', 'L16_V026', 'L16_V027', 'L16_V028', 'L16_V029', 'L17_V003', 'L17_V004', 'L17_V005',
  'L17_V006', 'L17_V007', 'L17_V010', 'L17_V011', 'L17_V012', 'L17_V013', 'L17_V014', 'L17_V017',
  'L17_V018', 'L17_V019', 'L17_V020', 'L17_V021', 'L17_V024', 'L17_V025', 'L17_V026', 'L17_V027',
  'L17_V028', 'L18_V002', 'L18_V003', 'L18_V004', 'L18_V005', 'L18_V006', 'L18_V009', 'L18_V010',
  'L18_V011', 'L18_V012', 'L18_V013', 'L18_V016', 'L18_V017', 'L18_V018', 'L18_V019', 'L18_V020',
  'L18_V023', 'L18_V024', 'L18_V025', 'L18_V026', 'L18_V027', 'L19_V001', 'L19_V003', 'L19_V004',
  'L19_V005', 'L19_V007', 'L19_V008', 'L19_V009', 'L19_V010', 'L19_V011', 'L19_V012', 'L19_V015',
  'L19_V016', 'L19_V017', 'L19_V018', 'L19_V019', 'L19_V022', 'L19_V023', 'L19_V024', 'L19_V025',
  'L19_V026', 'L19_V029', 'L19_V030', 'L19_V031', 'L20_V001', 'L20_V002', 'L20_V003', 'L20_V004',
  'L20_V007', 'L20_V008', 'L20_V009', 'L20_V010', 'L20_V011', 'L20_V014', 'L20_V015', 'L20_V016',
  'L20_V017', 'L20_V018', 'L20_V021', 'L20_V022', 'L20_V024', 'L20_V025', 'L20_V028', 'L20_V029',
  'L20_V030', 'L20_V031', 'L21_V001', 'L21_V002', 'L21_V005', 'L21_V006', 'L21_V007', 'L21_V012',
  'L21_V013', 'L21_V014', 'L21_V015', 'L21_V016', 'L21_V019', 'L21_V021', 'L21_V022', 'L21_V023',
  'L21_V026', 'L21_V027', 'L21_V028', 'L21_V029', 'L21_V030', 'L22_V001', 'L22_V004', 'L22_V005',
  'L22_V006', 'L22_V011', 'L22_V012', 'L22_V013', 'L22_V014', 'L22_V015', 'L22_V018', 'L22_V019',
  'L22_V020', 'L22_V021', 'L22_V022', 'L22_V025', 'L22_V026', 'L22_V027', 'L22_V028', 'L22_V029',
  'L24_V017', 'L24_V019', 'L24_V020', 'L24_V021', 'L24_V022', 'L24_V023', 'L24_V024', 'L24_V025',
  'L24_V027', 'L24_V028', 'L24_V029', 'L24_V030', 'L24_V031', 'L24_V033', 'L24_V035', 'L24_V036',
  'L24_V037', 'L24_V038', 'L24_V039', 'L24_V040', 'L24_V041', 'L24_V042', 'L24_V044', 'L24_V045',
  'L25_V004', 'L25_V005', 'L25_V008', 'L25_V013', 'L25_V014', 'L25_V017', 'L25_V021', 'L25_V022',
  'L25_V025', 'L25_V030', 'L25_V031', 'L25_V034', 'L25_V039', 'L25_V040', 'L25_V043', 'L25_V048',
  'L25_V049', 'L25_V052', 'L25_V057', 'L25_V058', 'L25_V061', 'L25_V066', 'L25_V067', 'L25_V070',
  'L25_V074', 'L25_V077', 'L25_V078', 'L25_V084', 'L25_V085', 'L25_V088']

const modeModal = new bootstrap.Modal(document.getElementById("mode-modal"));
modeModal.toggle();

const checkModal = new bootstrap.Modal(document.getElementById("check-modal"));

const submitModel = new bootstrap.Modal(document.getElementById("submit-modal"));

let queue_view = document.querySelector('#queue-view');
let targetImg = "";
let isOffcanvasShown = false;
let mode = "";
let sessionID = "";
let evaluationID = "";
let loginName = "Admin";

let submitImg = [];

export async function get_video_path_m3u8(video_name) {
  let final_time = `http://localhost:3031/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/data/keyframe_resized/metadata/${video_name}.json`
  // console.log(final_time);
  return await fetch(final_time).then(res => {
    if (res.ok)
      return res.json();
    throw new Error("Cannot fetch video url");
  })
    .then( response =>
    {
      return response.watch_url;
    }
    )

}

export const openWin = (vid_name, frame_idx) => {
  // Encode path and frame index
  get_video_path_m3u8(vid_name).then(getPath => {
    console.log(getPath);
    let fps = 25;
    if (fps30Files.includes(vid_name)){
      fps = 30;
    }
    let SecondPoint = Math.floor(frame_idx / fps);

    // Open the new window with the specified URL and dimensions
    console.log(getPath);
    let win = window.open(
      `${getPath}&t=${SecondPoint}`, // Use backticks for template literals
      null,
      "popup"
    );
    if (win) win.resizeTo(500, 400);
  })

}


function displayQueue(Queue) {
  queue_view.innerHTML = "";

  Queue.forEach(element => {
    let src = element;

    let img = document.createElement('img');
    img.setAttribute('src', src);
    img.setAttribute('class', 'keyframeImg');
    // img.setAttribute('frame_idx', frame_idx);

    img.addEventListener("mouseenter", function (event) {
      event.preventDefault();
      targetImg = img;
      img.style.border = "3px solid red";
    });

    img.addEventListener("mouseleave", function (event) {
      event.preventDefault();
      targetImg = "";
      img.style.border = "3px solid black";
    });

    let container = document.createElement('div');
    container.setAttribute("class", "imgContainer");
    container.appendChild(img);

    let name = document.createElement('p');
    name.innerHTML = src.split("/").slice(-2)[0] + '_' + src.split("/").slice(-1)[0].split(".")[0];

    container.appendChild(name);
    queue_view.appendChild(container);
  });
}

const socket = io("http://localhost:5053/boss");

socket.on("connect", () => {
  console.log("CONNECTED");
});

socket.on("display-noti", (id, message) => {
  console.log("Recieved");
  createToast(id, message);
});

socket.on('queue-update', (queue, queue2) => {
  displayQueue(queue);
  submitImg = queue2;
})

document.addEventListener("keydown", function (e) {
  // var module_displaying;
  if (e.key == "d" && isOffcanvasShown) {
    myCarousel.next();
  }
  if (e.key == "a" && isOffcanvasShown) {
    myCarousel.prev();
  }
  if (e.key == "c" || e.key == "g") {
    if (isOffcanvasShown) {
      myOffcanvas.hide();
      myModal.hide();
      isOffcanvasShown = false;
    }
  }
  if (e.key == "z") {
    myModal.toggle();
  }

  if (e.key == 'q' && targetImg) {
    socket.emit("reject-image", targetImg.getAttribute("src"));
    targetImg = "";
  }

  if (e.ctrlKey) {
    if (e.key == "h") {
      e.preventDefault();
      checkModal.toggle();
    }

    if (e.key == 'e') {
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


  if (e.key == "\\") {
    e.preventDefault();
    socket.emit('empty-queue');
  }
  if (e.key == 'v') {
    e.preventDefault();
    let imgSrc = document.getElementById("modal-img").src;
    const videoName = imgSrc.split("/").slice(-2)[0];
    const frameidx = imgSrc.split("/").slice(-1)[0].split(".")[0];
    openWin(videoName, frameidx);
  }
});

// Chuột phải
document.addEventListener("contextmenu", function (e) {
  // Nếu element là hình keyframe: Hiện Offcanvas + Modal
  if (e.target.classList.contains("keyframeImg")) {
    isOffcanvasShown = true;
    e.preventDefault();
    activeKeyFrameView(e.target.getAttribute("src"));
  }
});


document.addEventListener('click', function (e) {
  if (e.target.classList.contains("keyframeImg")) {
    const path = e.target.getAttribute('src');
    const videoName = path.split("/").slice(-2)[0];
    const frameidx = path.split("/").slice(-1)[0].split(".")[0];
    openWin(videoName, frameidx);
  }
})

document.getElementById("add-file-modal").addEventListener("shown-bs-modal", _ => {
  isAddFileModal = true;
});

document.getElementById("add-file-modal").addEventListener("hidden-bs-modal", _ => {
  isAddFileModal = false;
});

export let currentPositionKeyframe = 0;
export let isShownNearKeyFrameWindow = 0;
export let keyFrameWindowData = null;
export let maxLenBatch = 0;
export let originalKFIndex = 0;

function createImgElement(directory, frame_idx) {
  const imgElement = document.createElement("img");
  imgElement.setAttribute("data-lazy", directory);
  imgElement.setAttribute("class", "keyframeImg");
  imgElement.setAttribute('frame_idx', frame_idx);


  imgElement.addEventListener("mouseenter", function (event) {
    event.preventDefault();
    targetImg = imgElement;
    // console.log(targetImg);
  });

  imgElement.addEventListener("mouseleave", function (event) {
    event.preventDefault();
    targetImg = "";
  });
  // for (const directory of queueImg) {
  //   if (document.querySelector(`[src = "${directory}"]`)) document.querySelector(`[src = "${directory}"]`).style.border = "4px solid yellow";
  // }

  // for (const dir of rejectImg) { // Rejected imgs
  //   if (document.querySelector(`[src = "${dir}"]`)) document.querySelector(`[src = "${dir}"]`).style.border = "4px solid red";
  // }
  return imgElement;
}

function createKeyFrameImg(currentKFIndex) {
  let keyframeGrid = document.querySelector(".nearest-keyframes");
  keyframeGrid.innerHTML = "<i class='bx bx-x' id='close-near-kf'></i>"; // reset - innercontent need to have cls button

  const closeButton = document.querySelector("#close-near-kf");
  if (closeButton) {
    closeButton.addEventListener("click", function () {
      console.log("close");
      document.querySelector(".nearest-keyframes").style.display = "none";
      document.querySelector(".nearest-keyframes").style.transform = "";
      document.querySelector(".contentGrid").style.filter = "";
      document.body.style.overflow = "";
      isShownNearKeyFrameWindow = 0;
    });
  }

  let divElement = document.createElement("div");
  divElement.setAttribute("class", "lil-kf");

  keyframeGrid.scrollTo({ top: 0, behavior: 'instant' });


  for (let i = Math.max(0, currentKFIndex - 32); i < Math.min(maxLenBatch, currentKFIndex + 32); i++) { // 30 previous keyframes and 30 next keyframes

    let path = keyFrameWindowData[i];
    const segments = path.split("/");
    const vid_name = segments[segments.length - 2];
    const frame_idx = segments[segments.length - 1].split(".")[0];
    let video_name = vid_name + "_" + frame_idx;

    // tạo Element chứa link dẫn tới vid của frame
    const linkElement = document.createElement("a");
    linkElement.setAttribute("target", "_blank");
    linkElement.setAttribute("rel", "noreferrer noopener");

    linkElement.addEventListener("click", function (ev) { // CLick ảnh sẽ dẫn tới video
      ev.preventDefault();
      openWin(vid_name, frame_idx);
    });

    // Tạo element ảnh từ directory
    const imgElement = createImgElement(path, frame_idx);
    imgElement.src = path;

    if (i === originalKFIndex) {
      imgElement.style.border = '8px solid blue';
      console.log("find the blue kf");
    }

    // Video name và keyframe của mỗi ảnh for identification
    const name = document.createElement("p");
    name.innerHTML = video_name;

    linkElement.appendChild(imgElement);
    linkElement.appendChild(name);
    divElement.appendChild(linkElement);
  }
  keyframeGrid.appendChild(divElement);

  // for (const directory of queueImg) {
  //   if (document.querySelector(`[src = "${directory}"]`)) document.querySelector(`[src = "${directory}"]`).style.border = "4px solid yellow";
  // }

  // for (const dir of rejectImg) { // Rejected imgs
  //   if (document.querySelector(`[src = "${dir}"]`)) document.querySelector(`[src = "${dir}"]`).style.border = "4px solid red";
  // }
}

// Nearest keyframes search
export function nearestKeyFrameSearch() {
  // Get the fetch path and save the original target index @@
  let FrameSrc = targetImg.src;
  let splittedKeyFramePath = FrameSrc.split('/');
  let kfIdx = splittedKeyFramePath[splittedKeyFramePath.length - 1].split('.')[0];
  splittedKeyFramePath.pop();
  let videoName = splittedKeyFramePath[splittedKeyFramePath.length - 1];
  splittedKeyFramePath.pop();
  splittedKeyFramePath.pop();
  let pathForFetch = splittedKeyFramePath.join('/') + '/json/' + videoName + '.json';

  FrameSrc = FrameSrc.replace("http://localhost:3031", "");

  maxLenBatch = 0;

  // Fetch the JSON data path
  fetch(pathForFetch)
    .then(response => {
      if (!response.ok) {
        throw new Error("Response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => { // data is a video batch in json format that has the target frame idx

      // console.log(data);

      keyFrameWindowData = data;

      Object.entries(keyFrameWindowData).forEach(([key, value]) => {
        maxLenBatch = Math.max(maxLenBatch, key);
        if (FrameSrc === value) {
          currentPositionKeyframe = Number(key);
        }
      });
      originalKFIndex = currentPositionKeyframe;

      createKeyFrameImg(currentPositionKeyframe);


    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

}

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

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();

    isShownNearKeyFrameWindow = 1;

    nearestKeyFrameSearch();

    document.querySelector(".nearest-keyframes").style.display = "flex";
    document.querySelector(".nearest-keyframes").style.transform = `translateY(${window.scrollY}px)`; // the pop up nearKeyFrameWindow follow wherever the window scroll to
    document.querySelector(".contentGrid").style.filter = "blur(4px) brightness(50%)";
    document.body.style.overflow = "hidden";
  }

  if (isShownNearKeyFrameWindow) {
    if (e.key === 'a' && !isOffcanvasShown) {
      e.preventDefault();
      currentPositionKeyframe = Math.max(currentPositionKeyframe - 64, 0);
      if (keyFrameWindowData && maxLenBatch) {
        createKeyFrameImg(currentPositionKeyframe);
        console.log("move keyframe window left side");
      }
    }
    if (e.key === 'd' && !isOffcanvasShown) {
      e.preventDefault();
      currentPositionKeyframe = Math.min(currentPositionKeyframe + 64, maxLenBatch);
      if (keyFrameWindowData && maxLenBatch) {
        createKeyFrameImg(currentPositionKeyframe);
        console.log("move keyframe window right side");
      }
    }
    if (e.key === 'Escape' || (e.key === 'c' && e.ctrlKey && !isOffcanvasShown)) {
      isShownNearKeyFrameWindow = 0;
      e.preventDefault();
      document.querySelector(".nearest-keyframes").style.display = "none";
      document.querySelector(".nearest-keyframes").style.transform = "";
      document.querySelector(".contentGrid").style.filter = "";
      document.body.style.overflow = "";
    }
  }
});

document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", function (_) {
    mode = btn.innerHTML == "Practice Mode" ? "practice" : "competition";
    console.log(mode);
    get_session_ID(mode).then(sID => {
      sessionID = sID;
      get_evaluationID(sID, mode).then(eID => evaluationID = eID);
    });
    modeModal.toggle();
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
});

document.getElementById("qa-answer").addEventListener("keydown", (e) => {
  if (e.key == "Enter") document.getElementById("submit-btn").click();
});
