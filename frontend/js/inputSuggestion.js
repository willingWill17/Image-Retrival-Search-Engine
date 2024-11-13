const uniqueColors = ['black', 'blue', 'brown', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'white', 'yellow']

const uniqueObjects = ['airplane', 'apple', 'backpack', 'ball', 'banana', 'baseball bat', 'bear', 'bed', 'bench',
    'bicycle', 'bird', 'boat', 'book', 'bottle', 'bowl', 'broccoli', 'bus', 'cake', 'car', 'carrot',
    'cat', 'cell phone', 'chair', 'clock', 'couch', 'cow', 'cup', 'dining table', 'dog', 'donut', 'elephant',
    'fire hydrant', 'fork', 'frisbee', 'giraffe', 'hair drier', 'handbag', 'horse', 'keyboard', 'kite', 'knife',
    'laptop', 'light', 'microwave', 'motorcycle', 'mouse', 'orange', 'oven', 'parking meter', 'person', 'pizza',
    'potted plant', 'refrigerator', 'remote', 'sandwich', 'scissors', 'sheep', 'sink', 'skateboard', 'skis',
    'snowboard', 'spoon', 'sports ball', 'stop sign', 'suitcase', 'surfboard', 'teddy bear', 'tennis racket',
    'tie', 'toaster', 'toilet', 'toothbrush', 'train', 'truck', 'tv', 'umbrella', 'vase', 'win', 'wine glass', 'zebra']

function Suggestion(InputX, DivX, id, arr) {
    document.querySelector(`#${DivX}${id}`).style.display = "";
    let Input = InputX + id;
    let Div = DivX + id;
    let ValueArray = document.getElementById(Input).value.split(",");
    let Value = ValueArray[ValueArray.length - 1];
    let SuggestionDiv = document.getElementById(Div);

    if (Value.length > 0) {
        SuggestionDiv.innerHTML = "";
        let List = document.createElement("ul");
        List.style.listStyle = "none";
        List.style.margin = "0px";
        List.style.padding = "0px";
        List.style.flexDirection = "row";
        List.style.display = "flex";
        List.style.gap = "3px";
        List.style.fontSize = "13px";
        List.style.maxWidth = "230px";
        List.style.overflow = "hidden";
        List.style.overflowY = "hidden";
        List.style.height = "20px";

        let firstSuggestion = null;

        for (const el of arr) {
            let elPart = el.substring(0, Value.length);

            if (el.length >= Value.length && elPart === Value) {
                if (!firstSuggestion) firstSuggestion = el;

                let ListEntity = document.createElement("li");
                ListEntity.setAttribute("class", "element");
                ListEntity.style.height = "28px";
                ListEntity.style.whiteSpace = "nowrap";
                ListEntity.style.position = "relative";
                ListEntity.style.top = "-2px";
                ListEntity.style.cursor = "pointer";

                ListEntity.setAttribute("onclick", "complete('" + el + "', '" + Input + "', '" + Div + "' );");
                ListEntity.innerHTML = el + ', ';
                List.appendChild(ListEntity);
            }
        }
        if (firstSuggestion) document.getElementById(Input).setAttribute("data-first-suggestion", firstSuggestion);
        else document.getElementById(Input).removeAttribute("data-first-suggestion");
        if(List.innerHTML) SuggestionDiv.appendChild(List);
    }
    else {
        SuggestionDiv.innerHTML = "";
        document.getElementById(Input).removeAttribute("data-first-suggestion");
    }

    document.getElementById(Div).addEventListener("click", complete);
}

function unfocusSuggestion(divX, id){
    document.querySelector(`#${divX}${id}`).style.display = "none";
}

const complete = (Suggestion, InputID, suggestionDiv) => {
    console.log(document.getElementById(InputID).value);
    let valueArray = document.getElementById(InputID).value.split(",");
    valueArray.pop();
    document.getElementById(InputID).value = valueArray.join(",") + ',' + Suggestion;
    if (document.getElementById(InputID).value[0] === ',') document.getElementById(InputID).value = document.getElementById(InputID).value.substring(1);
    document.getElementById(suggestionDiv).innerHTML = "";
}

document.addEventListener("keydown", function (event) {
    const activeField = document.activeElement;
    if (event.key === "`" && activeField.tagName.toLowerCase() === 'textarea') {
        event.preventDefault();
        if (activeField.id.includes("color")) {
            id = activeField.id[activeField.id.length - 1];
            let firstSuggestion = activeField.getAttribute("data-first-suggestion");
            if (firstSuggestion) complete(firstSuggestion, activeField.id, "suggestionColor" + id);
        }
        else if (activeField.id.includes("object")) {
            id = activeField.id[activeField.id.length - 1];
            let firstSuggestion = activeField.getAttribute("data-first-suggestion");
            if (firstSuggestion) complete(firstSuggestion, activeField.id, "suggestionObject" + id);
        }
    }
});
