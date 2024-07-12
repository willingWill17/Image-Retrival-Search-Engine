export function post(data) {
  fetch("http://localhost:8053/", {
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
        res.json().then((response) => console.log(response));
      } else {
        console.log("Not successful");
        console.log("Status: " + res.status);
        console.log("Status Text: " + res.statusText);
        res.text().then((text) => console.log("Response Body: " + text));
      }
    })
    .catch((error) => console.log("Fetch error: ", error));
}
