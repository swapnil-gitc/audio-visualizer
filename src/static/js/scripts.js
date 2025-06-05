document.addEventListener('DOMContentLoaded', function() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const canvas = document.getElementById('visualizer');
    const canvasContext = canvas.getContext('2d');
    const fileInput = document.getElementById('file-input');
    const playButton = document.getElementById('play-button');
    let audioBuffer;

    fileInput.addEventListener('change', handleFileSelect);
    playButton.addEventListener('click', playAudio);

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                audioContext.decodeAudioData(e.target.result, function(buffer) {
                    audioBuffer = buffer;
                });
            };
            reader.readAsArrayBuffer(file);
        }
    }

    function playAudio() {
        if (audioBuffer) {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            const analyser = audioContext.createAnalyser();
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            source.start(0);
            visualize(analyser);
        }
    }

    function visualize(analyser) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        canvas.width = window.innerWidth;
        canvas.height = 200;

        function draw() {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            canvasContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
            canvasContext.fillRect(0, 0, canvas.width, canvas.height);
            const barWidth = (canvas.width / dataArray.length) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < dataArray.length; i++) {
                barHeight = dataArray[i];
                canvasContext.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
                canvasContext.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
                x += barWidth + 1;
            }
        }
        draw();
    }
});