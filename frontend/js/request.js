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

  let btnCloseCanvas = document.getElementById('.btn-close')
  // btnCloseCanvas.addEventListener("")

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
          const imageContainer = document.getElementById("content");
          imageContainer.innerHTML = "";

          let sortedDirPath = new DefaultDict(Array);

          // Lấy path img của mỗi directory
          response.path.forEach((directory) => {
            let splited = directory.split("/");
            let key = splited[splited.length - 2];
            sortedDirPath[key].push(directory);
          });

          for (const [_, value] of Object.entries(sortedDirPath)) {
            let divElement = document.createElement("div");
            let hline_column = document.createElement("div");
            divElement.setAttribute("class", "result");
            hline_column.setAttribute("class", "hline_column");

            for (const val of value) {
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
              linkElement.setAttribute(
                "href",
                `../show_video.html?videoPath=${getPath}&frameIdx=${getFrame}`
              );
              linkElement.setAttribute("target", "_blank");
              linkElement.setAttribute("rel", "noreferrer noopener");

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

              // Add các keyframe tiếp theo cho offcanvas
              // const carouselMain = document.createElement('div');
              // carouselMain.setAttribute("class", "carousel-item active border border-primary border-3");
              imgElement.addEventListener("contextmenu", function(event){
                event.preventDefault();

                function stringToInt(intNumber) {
                    let strNumber = intNumber.toString();
                    strNumber = strNumber.padStart(4, '0'); // Thêm số 0 cho keyframeidx đủ 4 digits
                    return strNumber;
                }

                let pathParts = val.split('/');
                let keyframeIdx = pathParts[pathParts.length - 1].split(".")[0];
                pathParts.pop(); // Bỏ file name ở cuối
                let basepath = pathParts.join('/');
                console.log(basepath)

                let bigFrameWrapper = document.querySelector('.modal-body');
                let bigFrame = document.createElement('img');
                bigFrame.setAttribute("src", val);
                bigFrame.setAttribute("class", "modal-img");
                bigFrameWrapper.appendChild(bigFrame);

                for(let i = -4; i <= 4; i++)
                {
                  let Mainframe = document.createElement('div')
                  Mainframe.setAttribute("class", "carousel-item");
                  const keyframe_path = basepath + '/' + stringToInt(parseInt(keyframeIdx, 10) + i) + '.jpg';
                  const card = document.createElement('div');
                  card.setAttribute("class", "card");
                  const imgWrapper = document.createElement('div');
                  imgWrapper.setAttribute("class", "img-wrapper");
                  const frame_image = document.createElement('img');
                  frame_image.setAttribute("src", keyframe_path);
                  frame_image.setAttribute("alt", "...");
                  imgWrapper.appendChild(frame_image);
                  card.appendChild(imgWrapper);
                  if(i == 0){ // Mark cái frame thứ 0 là frame chính màu đỏ border
                    Mainframe.appendChild(card);
                    document.querySelector('.carousel-inner').appendChild(Mainframe);
                  }
                  else {
                    document.querySelector('.carousel-inner').appendChild(card);
                  }
                }
              });

              function clearImages() {
                  document.querySelectorAll('.modal-body img').forEach(img => img.remove());
                  document.querySelectorAll('.carousel-inner .card').forEach(item => item.remove());
                  document.querySelector('.carousel-inner .carousel-item').remove();
              }

              document.querySelector('.modal').addEventListener('hidden.bs.modal', clearImages);
            }
            imageContainer.appendChild(hline_column);
            imageContainer.appendChild(divElement);
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

const HOTKEY = {
  key: "`",
  ctrl: true,
};
