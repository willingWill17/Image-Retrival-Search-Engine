function getData(form) {
    var formData = new FormData(form);

    formData.set("canvas0", formData.get("canvas0") === 'enabled');
    formData.set("canvas1", formData.get("canvas1") === 'enabled');

    for (var pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
    }

    console.log(Object.fromEntries(formData));
    return Object.fromEntries(formData);
}

function post(data) {
    fetch('http://localhost:8054/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        if (res.ok) {
            console.log("SUCCESS");
            res.json().then(response => console.log(response));
        } else {
            console.log("Not successful");
            console.log("Status: " + res.status);
            console.log("Status Text: " + res.statusText);
            res.text().then(text => console.log("Response Body: " + text));
        }
    }).catch(error => console.log("Fetch error: ", error));
}

document.getElementById("request").addEventListener("submit", function (e) {
    e.preventDefault();
    let data = getData(e.target);
    post(data);
});
