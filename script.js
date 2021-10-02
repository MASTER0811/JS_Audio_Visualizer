window.addEventListener('load', function(){
    const container = document.getElementById("container");
    const canvas = document.getElementById("canvas1");
    const file = document.getElementById('fileupload');
    const stop_btn = document.getElementById("stop_btn")
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    let audioSource;
    let analyser;

    stop_btn.addEventListener('click', function(){
        audio1.pause()
        audio1.currentTime = 0;
    })
    file.addEventListener('change', function(){
        const files = this.files;
        const audio1 = document.getElementById('audio1');
        audio1.src = URL.createObjectURL(files[0]);
        audio1.play();
        const audioContext = new AudioContext();
        console.log(audioSource)
        if (!audioSource) {
            audioSource = audioContext.createMediaElementSource(audio1);
            analyser = audioContext.createAnalyser();
            audioSource.connect(analyser);
            analyser.connect(audioContext.destination);
        }

        analyser.fftSize = 64;
        console.log(analyser.fftSize)
        const bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);

        const dataArray = new Uint8Array(bufferLength);
        const barWidth = (canvas.width / bufferLength);
        let barHeight;
        let x = 0;

        function animate() {
            ctx.clearRect(0,0,canvas.width, canvas.height);
            x = 0;
            analyser.getByteFrequencyData(dataArray);
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * 2;
                const red = 200 * (i/bufferLength);
                const green = 0;
                const blue = barHeight + (2.2 * (i/bufferLength));
                ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1.2;
            }
            requestAnimationFrame(animate);
        }
        animate();
    })
})
