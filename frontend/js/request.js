import { contentGrid, currentMode } from "./document.js";
import { queueImg, rejectImg, submitImg } from "./client.js";
import { isOffcanvasShown } from "./carousel.js";

let api = "http://localhost:8053/";
let log_data = '';
let random_pic_api = "http://localhost:8053/random_pic";

export let targetImg = "";
export let currentResult = [];
export let currentResult2 = [];
export let currentCollection = "clip";
const numElementPerPage = 203;
let maxLengthPage = 1;
let Pages = [[]]; // Storing frame grouped by video Names for each page from 1 to 5
let Pages2 = [[]];
export let StateOfTemporal = 1;
export let currentPage = 1;
export let prePage = 1;
export let currentPositionKeyframe = 0;
export let isShownNearKeyFrameWindow = 0;
export let keyFrameWindowData = null;
export let maxLenBatch = 0;
export let originalKFIndex = 0;
let PageMark = 0;


export let where = 1;
class ArrayHashTable {
  constructor() {
    this.table = {};
  }

  hash(value) {
    if (Array.isArray(value)) {
      return value.join(',');
    } else {
      return String(value);
    }
  }

  add(value) {
    this.table[this.hash(value)] = true;
  }

  has(value) {
    return !!this.table[this.hash(value)];
  }

  clear() {
    this.table = {};
  }
}

let hashTable = new ArrayHashTable();
let rejectedHashTable = new ArrayHashTable();

class DefaultDict {
  constructor(defaultInit) {
    return new Proxy(
      {},
      {
        get: (target, name) =>
          name in target
            ? target[name]
            : (target[name] =
              typeof defaultInit === "function"
                ? new defaultInit().valueOf()
                : defaultInit),
      }
    );
  }
}

export function get_video_path_m3u8(video_name) {
  console.log(video_name);
  let video_path = ""
  if (video_name < "L13_V001") {
    video_path = "http://localhost:3031/mlcv2/Datasets/HCMAI24/streaming/batch1_audio/";
  }
  else if (video_name >= "L25_V001") {
    video_path = "http://localhost:3031/mlcv2/Datasets/HCMAI24/streaming/batch3/";
  }
  else {
    video_path = "http://localhost:3031/mlcv2/Datasets/HCMAI24/streaming/batch2_audio/";
  }
  return video_path + video_name + "/" + video_name + ".m3u8";

}

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

export const openWin = (vid_name, frame_idx) => {
  // Encode path and frame index

  const getPath = encodeURIComponent(get_video_path_m3u8(vid_name));
  console.log(getPath);
  const getFrame = encodeURIComponent(frame_idx);
  // Open the new window with the specified URL and dimensions
  console.log(getPath);
  let win = window.open(
    `../show_video.html?videoPath=${getPath}&frameIdx=${getFrame}`, // Use backticks for template literals
    null,
    "popup"
  );

  if (win) win.resizeTo(500, 400);
}

function createImgElement(directory, frame_idx, opt) {
  const imgElement = document.createElement("img");
  if(opt === 0) {
    imgElement.setAttribute("class", "keyframeImg");
    imgElement.setAttribute("data-lazy", directory);

  }
  else {
    // console.log("yes near kf");
    directory = "http://localhost:3031" + directory;
    imgElement.setAttribute("class", "keyframeImg");
    imgElement.setAttribute("src", directory);

  }
  imgElement.setAttribute('frame_idx', frame_idx);

  console.log(submitImg);

  if (submitImg.includes(directory)) {
    console.log('1');
    imgElement.style.border = "4px solid lime";
  }
  else if (rejectImg.includes(directory)) {
    console.log('2');
    imgElement.style.border = "4px solid red";
  }
  else if(queueImg.includes(directory)){
    console.log('3');
    imgElement.style.border = "4px solid yellow";
  }

  imgElement.addEventListener("mouseenter", function (event) {
    event.preventDefault();
    targetImg = imgElement;
  });

  imgElement.addEventListener("mouseleave", function (event) {
    event.preventDefault();
    targetImg = "";
  });

  return imgElement;
}

export function VideoGroupSearch(Pages) {

  console.log("Pages from video group search", Pages);

  const imageContainer = document.getElementById("content");
  imageContainer.innerHTML = "";

  let colorGroup = "black";

  if (currentPage > maxLengthPage) {
    console.log(`Error happens due to the current page index - Page ${currentPage} gets beyond the length of pages storage`);
    return;
  }

  let cnt = 0;

  for (const frameGroup of Pages[currentPage - 1]) {
    let divElement = document.createElement("div");
    let hline_column = document.createElement("div");
    divElement.setAttribute("class", "result");
    hline_column.setAttribute("class", "hline_column");

    for (const [dir, frame_idx] of frameGroup) {
      cnt += 1;
      const segments = dir.split("/");
      const vid_name = segments[segments.length - 2];
      const keyframe_idx = segments[segments.length - 1].split(".")[0];
      let video_name = vid_name + "_" + keyframe_idx;

      // tạo Element chứa link dẫn tới vid của frame
      const linkElement = document.createElement("a");
      linkElement.setAttribute("target", "_blank");
      linkElement.setAttribute("rel", "noreferrer noopener");
      linkElement.setAttribute("tabindex", "0");
      linkElement.addEventListener("click", function (ev) { // CLick ảnh sẽ dẫn tới video
        ev.preventDefault();
        openWin(vid_name, frame_idx);
      });

      // Tạo ảnh lấy từ directory
      const imgElement = createImgElement(dir, frame_idx, 0);

      // Video name và keyframe của mỗi ảnh for identification
      const name = document.createElement("p");
      name.innerHTML = video_name;

      linkElement.appendChild(imgElement);
      linkElement.appendChild(name);
      divElement.appendChild(linkElement);
    }

    if (colorGroup === "black") {
      divElement.style.borderLeft = `5px solid ${colorGroup}`;
      colorGroup = "yellow";
    } else {
      divElement.style.borderLeft = `5px solid ${colorGroup}`;
      colorGroup = "black";
    }

    imageContainer.appendChild(hline_column);
    imageContainer.appendChild(divElement);

    const targets = divElement.querySelectorAll("img");
    targets.forEach(lazyLoad);
  }

  const endLine = document.createElement("p");
  endLine.setAttribute("class", "endLine");
  endLine.innerHTML = `END OF PAGE ${currentPage}!`;
  contentGrid.appendChild(endLine);

  console.log(`The number of imgs of the current page ${currentPage}: ${cnt}`); // Trả về số ảnh mỗi page
}

export function SimilaritySearch(currentResult) {
  console.log("current Result from similarity search", currentResult);

  let contentGrid = document.querySelector("#content");
  contentGrid.innerHTML = "";

  let divElement = document.createElement("div");
  divElement.setAttribute("class", "result");

  let cnt = 0; // for counting the number of images of the current page through console.

  if (currentPage > maxLengthPage) {
    console.log(`Error happens due to the current page index - Page ${currentPage} gets beyond the length of pages storage`);
    return;
  }

  for (let i = (currentPage - 1) * numElementPerPage; i < Math.min(currentPage * numElementPerPage, currentResult.length); i++) {
    cnt += 1;
    if (i >= currentResult.length) break;

    // Lấy path img của mỗi directory
    const [directory, frame_idx] = currentResult[i];
    const segments = directory.split("/");
    const vid_name = segments[segments.length - 2];
    const keyframe_idx = segments[segments.length - 1].split(".")[0];
    let video_name = vid_name + "_" + keyframe_idx;

    // tạo Element chứa link dẫn tới vid của frame
    const linkElement = document.createElement("a");
    linkElement.setAttribute("target", "_blank");
    linkElement.setAttribute("rel", "noreferrer noopener");

    linkElement.addEventListener("click", function (ev) { // CLick ảnh sẽ dẫn tới video
      ev.preventDefault();
      openWin(vid_name, frame_idx);
    });

    // Tạo element ảnh từ directory
    const imgElement = createImgElement(directory, frame_idx, 0);

    // Video name và keyframe của mỗi ảnh for identification
    const name = document.createElement("p");
    name.innerHTML = video_name;

    linkElement.appendChild(imgElement);
    linkElement.appendChild(name);
    divElement.appendChild(linkElement);
  }
  contentGrid.appendChild(divElement);

  const targets = divElement.querySelectorAll("img");
  targets.forEach(lazyLoad);

  const endLine = document.createElement("p");
  endLine.setAttribute("class", "endLine");
  endLine.innerHTML = `END OF PAGE ${currentPage}!`;
  contentGrid.appendChild(endLine);

  console.log(`The number of imgs of the current page ${currentPage}: ${cnt}`); // Trả về số ảnh mỗi page
}

export function searchMode(StateOfTemporal) {
  if (StateOfTemporal === 1) {
    // Search theo video group hoặc similarity
    if (currentMode === "video group") VideoGroupSearch(Pages);
    else if (currentMode === "similarity search") SimilaritySearch(currentResult);
  }
  else {
    if (currentMode === "video group") VideoGroupSearch(Pages2);
    else if (currentMode === "similarity search") SimilaritySearch(currentResult2);
  }
}

function storePage(path, frame_idx) {
  let currentResultX = [];
  let PageX = [[]];

  path.forEach((directory, index) => {
    // console.log(directory);
    directory = "http://localhost:3031" + directory
    currentResultX.push([directory, frame_idx[index]]);
  });


  // Prepare Pages array for 5 pages of Video Group Search Mode 
  let sortedDirPath = new DefaultDict(Array);

  for (const [directory, frame_index] of currentResultX) { // Sort and group the results based on the video name
    let splited = directory.split("/");
    let key_videoName = splited[splited.length - 2];
    sortedDirPath[key_videoName].push([directory, frame_index]);
  }

  let cntElement = 0;
  let cntPage = 0;

  // Chia Page
  for (const [keyVideoName, value] of Object.entries(sortedDirPath)) {
    let frameGroup = []; // frames that have the same video Name
    cntElement += value.length;
    frameGroup = value;
    PageX[cntPage].push(frameGroup);
    if (cntElement >= numElementPerPage) {
      cntElement = 0;
      cntPage += 1;
      maxLengthPage = Math.min(cntPage + 1, 5);
      PageX.push([]);
    }
  }
  return { PageX, currentResultX };
}

function createResult(response) {

  // Reset page counter whenever new search :D
  currentPage = 1;
  document.querySelector(".pagination p").innerHTML = currentPage; // hiển thị  StateOfTemporal = 1;
  StateOfTemporal = 1;

  Pages2 = [[]];
  currentResult2.length = 0;
  Pages = [[]];
  currentResult.length = 0;

  const { PageX, currentResultX } = storePage(response.path, response.frame_idx);
  Pages = PageX;
  currentResult = currentResultX;

  if (response.path2) {
    // For temporal only 
    const { PageX, currentResultX } = storePage(response.path2, response.frame_idx2);
    Pages2 = PageX;
    currentResult2 = currentResultX;
  }

  window.scrollTo({ top: 0, behavior: 'instant' });

  searchMode(StateOfTemporal);
}


export function post(data, api) {
  console.log(data);

  fetch(api, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((res) => {
      if (res.ok) {
        console.log("SUCCESS");
        res.json().then((response) => {
          // response là biến kqua đã được json.parse() return từ function post_item bên hàm main.py ở backend
          console.log("response from backend: ", response);
          console.log("Length of the response: ", response.path.length);

          console.log(response);

          createResult(response);
        });
      } else {
        console.log("Not successful");
        console.log("Status: " + res.status);
        console.log("Status Text: " + res.statusText);
        res.text().then((text) => console.log("Response Body: " + text));
      }
    })
    .catch((error) => console.log("Fetch error: ", error));
}


export async function fetchImageSearch(imgElement) {
  const src = imgElement.getAttribute("src") || imgElement.getAttribute("data-lazy");
  let api = "http://localhost:8053/";

  if (src) {
    let data = {
      query: [
        {
          textual: "",
          objects: "",
          colors: "",
          ocr: "",
          imgPath: src,
          asr: "",
          metadata: "",
          collection: currentCollection,
        }
      ]
    };
    console.log(data);
    console.log
    let jsonData = JSON.stringify(data);
    post(jsonData, api);
  }
}

// Page move indexing
let leftPageBtn = document.querySelector(".forward");
let rightPageBtn = document.querySelector(".backward");

export function pageMove(direction) {
  prePage = currentPage;
  if (direction === "left") currentPage = (currentPage - 1) < 1 ? 1 : currentPage - 1;
  else currentPage = (currentPage + 1) > maxLengthPage ? maxLengthPage : currentPage + 1;

  let PageIndex = document.querySelector(".pagination p"); // Display Page index on the website!!!
  PageIndex.innerHTML = currentPage;

  if (prePage != currentPage) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    searchMode(StateOfTemporal);
  }
}

leftPageBtn.addEventListener("click", () => pageMove("left"));
rightPageBtn.addEventListener("click", () => pageMove("right"));

// Switch collection - Beit or Clip or Merge
export const collectionSwitchBtn = document.getElementById('collection-switch');
export function switching_Collection() {
  // currentCollection = (currentCollection == "beit") ? "clip": "beit";
  if (currentCollection === "beit") currentCollection = "merge";
  else if (currentCollection === "merge") currentCollection = "clip";
  else currentCollection = "beit"
  console.log("Current used collection:", currentCollection);
  collectionSwitchBtn.innerHTML = currentCollection;
  document.getElementById(`inputBlock0`).focus();
}

// random pic intialization
document.getElementById('random-pic').addEventListener("click", function (e) {
  post("", random_pic_api);
})

// Switch State
export function SwitchStateOfTemporal() {
  StateOfTemporal = (StateOfTemporal === 1) ? 2 : 1;
  document.querySelector("#StateOfTemporal").innerHTML = "State " + StateOfTemporal;
  searchMode(StateOfTemporal);
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
    const imgElement = createImgElement(path, frame_idx, 1);
    imgElement.src = path;

    if (i === originalKFIndex) {
      imgElement.style.border = '8px solid blue';
    }

    // Video name và keyframe của mỗi ảnh for identification
    const name = document.createElement("p");
    name.innerHTML = video_name;

    linkElement.appendChild(imgElement);
    linkElement.appendChild(name);
    divElement.appendChild(linkElement);
  }
  keyframeGrid.appendChild(divElement);

}

// Nearest keyframes search
export function nearestKeyFrameSearch() {
  for (const dir of rejectImg) {
    if (!rejectedHashTable.has(dir)) rejectedHashTable.add(dir); // Load các ảnh bị reject để apply border màu đỏ
  }
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
  console.log(pathForFetch);

  // Fetch the JSON data path
  fetch(pathForFetch)
    .then(response => {
      if (!response.ok) {
        throw new Error("Response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => { // data is a video batch in json format that has the target frame idx
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

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();

    isShownNearKeyFrameWindow = 1;

    nearestKeyFrameSearch();

    document.querySelector(".nearest-keyframes").style.display = "flex";
    document.querySelector(".nearest-keyframes").style.transform = `translateY(${window.scrollY}px)`;
    document.querySelector(".contentGrid").style.filter = "blur(4px) brightness(50%)";
    document.body.style.overflow = "hidden";
  }

  if (isShownNearKeyFrameWindow) {
    if (e.key === 'a' && !isOffcanvasShown) {
      e.preventDefault();
      if (currentPositionKeyframe - 64 >= 0) currentPositionKeyframe = Math.max(currentPositionKeyframe - 64, 0);
      if (keyFrameWindowData && maxLenBatch) {
        createKeyFrameImg(currentPositionKeyframe);
        console.log("move keyframe window left side");
      }
    }
    if (e.key === 'd' && !isOffcanvasShown) {
      e.preventDefault();
      if (currentPositionKeyframe + 64 <= maxLenBatch) currentPositionKeyframe = Math.min(currentPositionKeyframe + 64, maxLenBatch);
      if (keyFrameWindowData && maxLenBatch) {
        createKeyFrameImg(currentPositionKeyframe);
        console.log("move keyframe window right side");
      }
    }
    if (e.key === 'Escape' || (e.key === 'c' && e.ctrlKey)) {
      isShownNearKeyFrameWindow = 0;
      e.preventDefault();
      document.querySelector(".nearest-keyframes").style.display = "none";
      document.querySelector(".nearest-keyframes").style.transform = "";
      document.querySelector(".contentGrid").style.filter = "";
      document.body.style.overflow = "";
    }
  }
});