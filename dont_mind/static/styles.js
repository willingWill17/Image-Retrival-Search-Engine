function addObject() {
    const objectSelect = document.getElementById('object-select').value;
    const sceneObjects = document.getElementById('scene-objects').value;

    fetch('/add_object', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            scene_objects: sceneObjects,
            selected_object: objectSelect
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('scene-objects').value = data.updated_objects;
    });
}

function addNextObject() {
    const objectSelect = document.getElementById('next-object-select').value;
    const nextSceneObjects = document.getElementById('next-scene-objects').value;

    fetch('/add_next_object', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            next_scene_objects: nextSceneObjects,
            selected_object: objectSelect
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('next-scene-objects').value = data.updated_objects;
    });
}
