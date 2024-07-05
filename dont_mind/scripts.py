from flask import Flask, render_template, request

app = Flask(__name__)

# Initialize global variables to store objects
scene_objects = []
next_scene_objects = []

@app.route('/', methods=['GET', 'POST'])
def index():
    global scene_objects, next_scene_objects

    if request.method == 'POST':
        # Handle form submission for adding objects
        if 'add_object' in request.form:
            selected_object = request.form['object_select']
            scene_objects.append(selected_object)
        elif 'add_next_object' in request.form:
            selected_object = request.form['next_object_select']
            next_scene_objects.append(selected_object)

    return render_template('index.html', scene_objects=', '.join(scene_objects), next_scene_objects=', '.join(next_scene_objects))

if __name__ == '__main__':
    app.run(debug=True)
