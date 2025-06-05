from flask import Flask, render_template, request
from visualizer.audio_processing import process_audio
from visualizer.visualization import generate_visualization

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_audio():
    if 'audio_file' not in request.files:
        return "No file part", 400
    file = request.files['audio_file']
    if file.filename == '':
        return "No selected file", 400
    if file:
        audio_data = process_audio(file)
        visualization = generate_visualization(audio_data)
        return visualization, 200

if __name__ == '__main__':
    app.run(debug=True)