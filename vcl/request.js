function getData(form) {
    var formData = new FormData(form);

    (formData.get("canvas0") === 'enabled') ? formData.set("canvas0", true) : formData.set("canvas0", false);
    (formData.get("canvas1") === 'enabled') ? formData.set("canvas1", true) : formData.set("canvas1", false);

    //formData.delete("imgFile")

    for (var pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
    }

    console.log(Object.fromEntries(formData));
    return Object.fromEntries(formData);
}

function post(data) {
    fetch('http://localhost:8000/', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        if (res.ok) {
            console.log("SUCCESS");
            res.json().then(response => console.log(response));
        } else {
            console.log("Not successful");
        }
    }).catch(error => console.log(error))
}

document.getElementById("request").addEventListener("submit", function (e) {
    e.preventDefault();
    data = getData(e.target);
    res = post(data);
});

