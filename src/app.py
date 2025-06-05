from flask import Flask, render_template
from visualizer.audio_processing import process_audio
from visualizer.visualization import create_visualization

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_audio', methods=['POST'])
def process_audio_route():
    # Logic to handle audio processing
    audio_data = request.files['audio_file']
    processed_data = process_audio(audio_data)
    visualization = create_visualization(processed_data)
    return visualization

if __name__ == '__main__':
    app.run(debug=True)