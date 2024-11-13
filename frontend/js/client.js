import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import { createToast } from "./notification.js";
import { isModalShown } from "./carousel.js"
// ***----------------------------------------------Public variables------------------------------------***

export let queueImg = [];
export let rejectImg = [];
export let submitImg = [];
export let whole_query = "";
// Web socket variables
export const socket = io("http://localhost:5053");

// ***----------------------------------------------Functions------------------------------------***

export function notifyStatus() {
    createToast("primary", `There are currently ${queueImg.length} images on queue, ${rejectImg.length} images are being rejected.`);
}

export function emitQueueImg(img) {
    socket.emit("queue-image", img.getAttribute("src"), img.getAttribute('frame_idx'));
}

export function update_query(query) {
    socket.emit("update-query", query);
    console.log(query);
}

function updateBorder(type, imgSrc) {
    switch (type) {
        case "submit":
            // console.log(submittedImg);
            let submittedImg = document.querySelector(".contentGrid").querySelector(`img[src="${imgSrc}"]`);
            if (submittedImg) {
                submittedImg.style.border = "4px solid lime";
                submittedImg.style["border-radius"] = "4px";
            }
            submittedImg = document.querySelector(".nearest-keyframes").querySelector(`img[src="${imgSrc}"]`);
            if (submittedImg) {
                submittedImg.style.border = "4px solid lime";
                submittedImg.style["border-radius"] = "4px";
            }
            break;
        case "queue":
            let updatedImg = document.querySelector(".contentGrid").querySelector(`img[src="${imgSrc}"]`);
            if (updatedImg) {
                updatedImg.style.border = "4px solid yellow";
                updatedImg.style["border-radius"] = "4px";
            }
            updatedImg = document.querySelector(".nearest-keyframes").querySelector(`img[src="${imgSrc}"]`);
            if (updatedImg) {
                updatedImg.style.border = "4px solid yellow";
                updatedImg.style["border-radius"] = "4px";
            }
            break;
        case "reject":
            let rejectedImg = document.querySelector(".contentGrid").querySelector(`img[src="${imgSrc}"]`);
            if (rejectedImg) {
                rejectedImg.style.border = "4px solid red";
                rejectedImg.style["border-radius"] = "4px";
            }
            rejectedImg = document.querySelector(".nearest-keyframes").querySelector(`img[src="${imgSrc}"]`);
            if (rejectedImg) {
                rejectedImg.style.border = "4px solid red";
                rejectedImg.style["border-radius"] = "4px";
            }
            break;
    }

}

function resetBorder() {
    queueImg.forEach((src) => {
        let currentImg = document.querySelector(".contentGrid").querySelector(`img[src="${src}"]`);
        if (currentImg) {
            currentImg.style.border = "2px solid black";
            currentImg.style["border-radius"] = "4px";
        }
        currentImg = document.querySelector(".nearest-keyframes").querySelector(`img[src="${src}"]`);
        if (currentImg) {
            currentImg.style.border = "2px solid black";
            currentImg.style["border-radius"] = "4px";
        }
    });

    rejectImg.forEach((src) => {
        let currentImg = document.querySelector(".contentGrid").querySelector(`img[src="${src}"]`);
        if (currentImg) {
            currentImg.style.border = "2px solid black";
            currentImg.style["border-radius"] = "4px";
        }
        currentImg = document.querySelector(".nearest-keyframes").querySelector(`img[src="${src}"]`);
        if (currentImg) {
            currentImg.style.border = "2px solid black";
            currentImg.style["border-radius"] = "4px";
        }
    });

    submitImg.forEach((src) => {
        let currentImg = document.querySelector(".contentGrid").querySelector(`img[src="${src}"]`);
        if (currentImg) {
            currentImg.style.border = "2px solid black";
            currentImg.style["border-radius"] = "4px";
        }
        currentImg = document.querySelector(".nearest-keyframes").querySelector(`img[src="${src}"]`);
        if (currentImg) {
            currentImg.style.border = "2px solid black";
            currentImg.style["border-radius"] = "4px";
        }
    });

}

// ***------------------------------------Socket Events-----------------------------------------------***
socket.on("connect", () => {
    console.log("CONNECTED");

});

socket.on("get-query", (query) => {
    whole_query = query;
    // update_query_box(whole_query)
});

socket.on("connect_error", (err) => {
    console.log(err);
    console.log(`connect_error due to ${err.message}`);
});

socket.on("display-noti", (id, message) => {
    createToast(id, message);
});

socket.on("get-queue", (queue, queue2, queue3) => {
    queueImg = queue;
    rejectImg = queue2;
    submitImg = queue3;
    notifyStatus();
});

socket.on("queue-update", (type, imgSrc) => {
    switch (type) {
        case "submit":
            if (queueImg.indexOf(imgSrc) != -1)
                queueImg.splice(queueImg.indexOf(imgSrc), 1);
            submitImg.push(imgSrc);
            updateBorder(type, imgSrc);
            if (isModalShown && imgSrc === document.querySelector(".modal-body img").getAttribute("src")) {
                document.querySelector(".modal-body img").style['border'] = '4px solid lime';
            }
            break;
        case "queue":
            queueImg.push(imgSrc);
            updateBorder(type, imgSrc);
            if (isModalShown && imgSrc === document.querySelector(".modal-body img").getAttribute("src")) {
                document.querySelector(".modal-body img").style['border'] = '4px solid yellow';
            }
            break;
        case "reject":
            queueImg.splice(queueImg.indexOf(imgSrc), 1);
            rejectImg.push(imgSrc);
            updateBorder(type, imgSrc);
            if (isModalShown && imgSrc === document.querySelector(".modal-body img").getAttribute("src")) {
                document.querySelector(".modal-body img").style['border'] = '4px solid red';
            }
            break;
        case "empty":
            for (const dir of queueImg) {
                document.querySelector(".modal-body img").style['border'] = '4px solid black';
            }
            for (const dir of rejectImg) {
                document.querySelector(".modal-body img").style['border'] = '4px solid black';
            }
            for (const dir of submitImg) {
                document.querySelector(".modal-body img").style['border'] = '4px solid black';
            }
            console.log("Empty");
            resetBorder();
            queueImg = [];
            rejectImg = [];
            submitImg = [];
            break;
    }
    console.log('update');
});
socket.on("updated-query-box", (query) => {
    whole_query = query;
    console.log('query-box-updated');
});
