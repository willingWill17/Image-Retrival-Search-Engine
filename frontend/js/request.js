import {currentMode} from "./document.js"

let api = "http://localhost:8053/";

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

function get_video_path(video_name, keyframe_idx) {
  let video_path =
    "http://localhost:3031/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/test_data/HCM_AIC_2023/videos_ln/";
  return video_path + video_name + ".mp4";
}

function get_vid_sum(path) {
  let all_keys = "http://localhost:3031/video_sum/";
  let lastslash = path.lastIndexOf("/");
  let new_path = path.substring(0, lastslash + 1);
  return all_keys + new_path;
}

function addRightClickEvent(element) {
  let offcanvas = new bootstrap.Offcanvas(
    document.getElementById("offcanvasBottom")
  );

  let modal = new bootstrap.Modal(document.getElementById("gallery-modal"));

  element.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    offcanvas.toggle();
    modal.show();
  });

  let btnCloseCanvas = document.getElementById(".btn-close");
  // btnCloseCanvas.addEventListener("")
}

export let currentResult = [];

export function VideoGroupSearch() {
    const imageContainer = document.getElementById("content");
    imageContainer.innerHTML = "";

    let sortedDirPath = new DefaultDict(Array);

    // Lấy path img của mỗi directory
    for(const [directory, frame_index] of currentResult) {
      let splited = directory.split("/");
      let key = splited[splited.length - 2];
      sortedDirPath[key].push([directory, frame_index]);
    }

    for (const [_, value] of Object.entries(sortedDirPath)) {
      let divElement = document.createElement("div");
      let hline_column = document.createElement("div");
      divElement.setAttribute("class", "result");
      hline_column.setAttribute("class", "hline_column");

      for (const [val, frame_idx] of value) {
        const segments = val.split("/");
        const vid_name = segments[segments.length - 2];
        const keyframe_idx = segments[segments.length - 1].split(".")[0];
        let video_name = vid_name + "_" + keyframe_idx;

        // tạo Element chứa link dẫn tới vid của frame
        const linkElement = document.createElement("a");
        const getPath = encodeURIComponent(
          get_video_path(vid_name, keyframe_idx)
        );
        const getFrame = encodeURIComponent(keyframe_idx);
        // linkElement.setAttribute(
        //   "href",
        //   `../show_video.html?videoPath=${getPath}&frameIdx=${getFrame}`
        // );
        linkElement.setAttribute("target", "_blank");
        linkElement.setAttribute("rel", "noreferrer noopener");
        linkElement.addEventListener("click", function openWin(ev) {
          ev.preventDefault();

          // Encode path and frame index
          const getPath = encodeURIComponent(get_video_path(vid_name));
          const getFrame = encodeURIComponent(frame_idx);

          // Open the new window with the specified URL and dimensions
          let win = window.open(
            `../show_video.html?videoPath=${getPath}&frameIdx=${getFrame}`, // Use backticks for template literals
            null,
            "popup"
          );
          if (win) {
            win.resizeTo(500, 400);
          }
        });

        // display ảnh lấy từ path trong database
        const imgElement = document.createElement("img");
        imgElement.setAttribute("src", val);
        imgElement.setAttribute("class", "keyframeImg");

        // Video name và keyframe của mỗi ảnh for identification
        const name = document.createElement("p");
        name.innerHTML = video_name;

        linkElement.appendChild(imgElement);
        linkElement.appendChild(name);
        divElement.appendChild(linkElement);
      }
      imageContainer.appendChild(hline_column);
      imageContainer.appendChild(divElement);
    }
}

export function SimilaritySearch(){
  const imageContainer = document.getElementById("content");
  imageContainer.innerHTML = "";

  let divElement = document.createElement("div");
  divElement.setAttribute("class", "result")

  // Lấy path img của mỗi directory
  for(const [directory, frame_idx] of currentResult) {

    const val = directory;
    const segments = val.split("/");
    const vid_name = segments[segments.length - 2];
    const keyframe_idx = segments[segments.length - 1].split(".")[0];
    let video_name = vid_name + "_" + keyframe_idx;

    // tạo Element chứa link dẫn tới vid của frame
    const linkElement = document.createElement("a");
    const getPath = encodeURIComponent(
      get_video_path(vid_name, keyframe_idx)
    );
    const getFrame = encodeURIComponent(keyframe_idx);
    linkElement.setAttribute("target", "_blank");
    linkElement.setAttribute("rel", "noreferrer noopener");
    linkElement.addEventListener("click", function openWin(ev) {
      ev.preventDefault();

      // Encode path and frame index
      const getPath = encodeURIComponent(get_video_path(vid_name));
      const getFrame = encodeURIComponent(frame_idx);

      // Open the new window with the specified URL and dimensions
      let win = window.open(
        `../show_video.html?videoPath=${getPath}&frameIdx=${getFrame}`, // Use backticks for template literals
        null,
        "popup"
      );
      if (win) {
        win.resizeTo(500, 400);
      }
    });

    // display ảnh lấy từ path trong database
    const imgElement = document.createElement("img");
    imgElement.setAttribute("src", val);
    imgElement.setAttribute("class", "keyframeImg");
    addRightClickEvent(imgElement);

    // Video name và keyframe của mỗi ảnh for identification
    const name = document.createElement("p");
    name.innerHTML = video_name;

    linkElement.appendChild(imgElement);
    linkElement.appendChild(name);
    divElement.appendChild(linkElement);
    
    imageContainer.appendChild(divElement);
  }
}

export function post(data) {
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
        // console.log(res);
        res.json().then((response) => {
          // response là biến kqua return từ function post_item bên hàm main.py ở backend

          console.log(response);

          currentResult.length = 0;

          response.path.forEach((directory, index) => {
            currentResult.push([directory, response.frame_idx[index]]);
          });

          // Search theo video group
          if(currentMode === 'video group'){
            VideoGroupSearch();
          }

          // Search theo Similarity
          else{
            SimilaritySearch();
          }
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

// function openVideo(){
//   const videoPath
// }

const HOTKEY = {
  key: "`",
  ctrl: true,
};

