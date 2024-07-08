function getData(form) {
    var formData = new FormData(form);

    if(formData.get("canvas0") === 'enabled')
        formData.set("canvas0", true);
    if(formData.get("canvas1") === 'enabled')
        formData.set("canvas1", true);

    formData.delete("imgFile")

    for (var pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
    }

    console.log(Object.fromEntries(formData));
    return Object.fromEntries(formData);
}

function post(data) {
    fetch('http://0.0.0.0:8000/', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        if(res.ok) {
            console.log("SUCCESS");
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

