window.addEventListener('load', function(){
    // const container = document.getElementById("container");
    const canvas = document.getElementById("canvas1");
    const file = document.getElementById('fileupload');
    const stop_btn = document.querySelector(".stop_btn")
    const title_of_song = document.querySelector(".title_song")
    // const volume_down = document.querySelector(".down_vo")
    const audio_song = document.getElementById('audio_song');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    let audioSource;
    let analyser;
    stop_btn.addEventListener('click', function(){
        audio_song.pause()
        audio_song.currentTime = 0;
        title_of_song.innerHTML = "Audio Visualizer"
    })
    audio_song.addEventListener("ended",function(){
        title_of_song.innerHTML = "Audio Visualizer"
    })
    
    file.addEventListener('change', function(){
        const files = this.files;
        const audio_song = document.getElementById('audio_song');
        audio_song.src = URL.createObjectURL(files[0]);
        audio_song.play();
        audio_song.volume = 0.15;
        title_of_song.innerHTML = `${files[0].name}`
        console.log(title_of_song.innerHTML)
        const audioContext = new AudioContext();
        console.log(audioSource)
        if (!audioSource) {
          audioSource = audioContext.createMediaElementSource(audio_song);
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
          const blue = barHeight + (2.25 * (i/bufferLength));

            ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1.2;
        }
        requestAnimationFrame(animate);
    }

    animate();
    });
    
});


