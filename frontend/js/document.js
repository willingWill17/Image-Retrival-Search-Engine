import { post, currentResult, currentCollection, searchMode, StateOfTemporal} from "./request.js";

export let isASR = false;

let api = "http://localhost:8053/";

let query0 = "";
let query1 = "";
let objects0 = "";
let objects1 = "";
let color0 = "";
let color1 = "";
let ocr0 = "";
let ocr1 = "";

function modifyTextualData(query){
  query = query.replace("http://localhost:3031", "")
  query = query.replace("keyframe_resized", "keyframe")
  query = query.replace("webp", "jpg")

  let splittedParts = query.split('/');
  let frame = splittedParts[splittedParts.length - 1];
  splittedParts.pop();
  let video_name = splittedParts[splittedParts.length - 1];
  splittedParts.pop();
  let video_batch = splittedParts[splittedParts.length - 1];
  splittedParts.pop();

  if (video_name < "L13_V001") {
    video_batch = "data-batch-1";
  }
  else if (video_name >= "L25_V001") {
    video_batch = "data-batch-3";
  }
  else {
    video_batch = "data-batch-2";
  }
  splittedParts.push(video_batch);
  splittedParts.push(video_name);
  splittedParts.push(frame);
  query = splittedParts.join('/');
  console.log(query);
  return query;

}

async function getData() {
  let res = {
    query: [
      {
        textual: query0,
        objects: objects0,
        colors: color0,
        ocr: ocr0,
        imgPath: "",
        asr: "",
        metadata: "",
        collection : currentCollection
      },
      {
        textual: query1,
        objects: objects1,
        colors: color1,
        ocr: ocr1,
        imgPath: "",
        asr: "",
        metadata: "",
        collection : (query1 == "") ? "" : currentCollection, 
      },
    ],
  };
  
  res.query = res.query.map((obj) => {
    let filteredObject = {};
    for (let key in obj) if (obj[key]) filteredObject[key] = obj[key];
    return filteredObject;
  });

  res.query = res.query.filter((e) => Object.keys(e).length);
  return JSON.stringify(res);
}

function reset(){
  document.querySelector("#inputBlock0").value = "";
  document.querySelector("#inputBlock1").value = "";
  document.querySelector("#object0").value = "";
  document.querySelector("#object1").value = "";
  document.querySelector("#color0").value = "";
  document.querySelector("#color1").value = "";
  document.querySelector("#ocr0").value = "";
  document.querySelector("#ocr1").value = "";
}

document.getElementById("request").addEventListener("keydown", function (e) {
  let meta = document.querySelector('#meta').value;

  if (e.key === "Enter" && !e.shiftKey && !meta) {
    e.preventDefault();
    isASR = false;
    let searchTab = document.querySelector("#searchTab");

    let formData = new FormData(document.querySelector("form"));
    query0 = formData.get("scene_description");
    query1 = formData.get("next_scene_description");
    objects0 = document.querySelector("#object0").value;
    objects1 = document.querySelector("#object1").value;
    color0 = document.querySelector("#color0").value;
    color1 = document.querySelector("#color1").value;
    ocr0 = document.querySelector("#ocr0").value;
    ocr1 = document.querySelector("#ocr1").value;
    
    if (searchTab.style.display === "block"){

      if(query0 || ocr0){
        (async function () {
          try {
            const data = await getData();
            console.log("input data: ")
            console.log(data);
            console.log(api);
            post(data, api);
          } catch (error) {
            console.error("Error:", error);
          }
        })();
      }
    }
    else {
      const src = document.getElementById("image-fuck").value;
      isASR = true;
      if (src){
          let res = {
            query: [
              {
                textual: "",
                objects: "",
                colors: "",
                ocr: "",
                imgPath: src,
                asr: "",
                metadata: "",
                collection : "",
              }
            ]
          };
          console.log(src);
          reset();
          res = JSON.stringify(res);
          console.log(res);
          post(res, api);
          
          // console.log(data);
          // let jsonData = JSON.stringify(data);
          // post(jsonData, api);
        }
      else{
        let transcriptValue = document.getElementById("inputBlock3").value;
        let res = {
          query: [
            {
              textual: "",
              objects: "",
              colors: "",
              ocr: "",
              imgPath: "",
              asr: transcriptValue,
              metadata: "",
              collection : currentCollection
            }
          ]
        };
        reset();
        res = JSON.stringify(res);
        console.log(res);
        post(res, api);
      }

    }
    document.activeElement.blur();
  }
});

export let currentMode = 'similarity search';
export let toggle = document.querySelector('.buttonToggle');
export let circle = document.querySelector('.circle');
export let bg = document.querySelector('.result-mode');
export let mode = document.querySelector('.result-mode p');
export let contentGrid = document.querySelector('.contentGrid');
let line = document.querySelector('.distance-line');
let title = document.querySelector('.headers .title');

export function transmode() {
  if (currentMode === 'video group') {
    circle.style.transform = 'translateX(-6px)';
    circle.style.background = '#82EA9E';
    currentMode = 'similarity search';
    bg.style.background = '#82EA9E';
    mode.innerHTML = 'Similarity Search';
    contentGrid.style.borderLeft = '4px solid #82EA9E';
    contentGrid.style.top = '29px';
    line.style.borderBottom = '6px solid #82EA9E';
    title.style.background = '#82EA9E';
  } 
  else if (currentMode === 'similarity search') {
    circle.style.transform = 'translateX(12px)';
    circle.style.background = '#7CB9E8';
    currentMode = 'video group';
    bg.style.background = '#7CB9E8';
    mode.innerHTML = 'Video Group Search';
    contentGrid.style.borderLeft = '4px solid #7CB9E8';
    contentGrid.style.top = '25px';
    line.style.borderBottom = '6px solid #7CB9E8';
    title.style.background = '#7CB9E8';
  }

  if (currentResult.length != 0) {
    console.log("ýes transmode");
    searchMode(StateOfTemporal);
  }
  else {
    console.log("No results in the contentGrid yet so cannot transmode");
  }
}

export async function get_text_translated_en() {
  const text0 = document.getElementById("inputBlock0").value
  const text1 = document.getElementById("inputBlock1").value
  if (text0) {
    console.log('fetching time');
    const response0 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&q=${encodeURIComponent(text0)}`);

    if (response0.ok) {
      const res0 = await response0.json();
      const datas0 = res0[0];
      let translatedText0 = ""; // Use a different variable to build the translated text
      for (let data0 of datas0) {
        translatedText0 += data0[0];
      }
      document.getElementById("inputBlock0").value = translatedText0;
    }
  }
  if (text1) {
    console.log('fetching time');
    const response1 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&q=${encodeURIComponent(text1)}`);

    if (response1.ok) {
      const res1 = await response1.json();
      const datas1 = res1[0];
      let translatedText1 = ""; // Use a different variable to build the translated text
      for (let data1 of datas1) {
        translatedText1 += data1[0];
      }
      document.getElementById("inputBlock1").value = translatedText1;
    }
  }
}

export async function get_text_reprompt() {
  const text0 = document.getElementById("inputBlock0").value
  const text1 = document.getElementById("inputBlock1").value

  const data = {
    prompt1: text0
  }
  if(text1) {
    data = {
      prompt1: text0,
      prompt2: text1
    }
  }

  console.log(JSON.stringify(data))

  console.log('fetching time');
  const response = await fetch(`http://localhost:8053/reprompt`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

  if (response.ok) {
    const res = await response.json();
    document.getElementById("inputBlock0").value = res.repromptedText1;
    document.getElementById("inputBlock1").value = res.repromptedText2;
  }
}

export async function get_text_translated_vn() {
  const text0 = document.getElementById("inputBlock0").value
  const text1 = document.getElementById("inputBlock1").value
  if (text0) {
    console.log('fetching time');
    const response0 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(text0)}`);
    if (response0.ok) {
      console.log('finshed fetching');
      const res0 = await response0.json();
      const datas0 = res0[0];
      let translatedText0 = ""; // Use a different variable to build the translated text
      for (let data0 of datas0) {
        translatedText0 += data0[0];
      }
      document.getElementById("inputBlock0").value = translatedText0;
    }
  }
  if (text1) {
    const response1 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(text1)}`);
    if (response1.ok) {
      const res1 = await response1.json();
      const datas1 = res1[0];
      let translatedText1 = ""; // Use a different variable to build the translated text
      for (let data1 of datas1) {
        translatedText1 += data1[0];
      }
      document.getElementById("inputBlock1").value = translatedText1;
    }
  }
}


toggle.addEventListener("click", transmode);

document.addEventListener("keydown", function (event) {
  if (event.key === 'g' && event.ctrlKey) {
    event.preventDefault();
    transmode();
  }
  if (event.key === 'p' && event.ctrlKey) {
    event.preventDefault();
    console.log('key registered');
    get_text_reprompt();
  }
  if (event.key === 'y' && event.ctrlKey) {
    event.preventDefault();
    console.log('key registered');
    get_text_translated_en();
  }
  if (event.key === 'i' && event.ctrlKey) {
    event.preventDefault();
    console.log('key registered');
    get_text_translated_vn();
  }

  if (event.key === 'q' && event.ctrlKey) {
    event.preventDefault();
    reset();
  }
});


document.getElementById("searchMeta").addEventListener("keydown",function(e){
  let meta = document.querySelector('#meta').value;
  if (e.key == "Enter" && meta && !e.ctrlKey){

    let res = {
      query: [
        {
          textual: "",
          objects: "",
          colors: "",
          ocr: "",
          imgPath: "",
          asr: "",
          metadata: meta,
          collection: currentCollection,
        }
  ]}
  res = JSON.stringify(res);
  console.log(res);
  post(res,api);
}
})




