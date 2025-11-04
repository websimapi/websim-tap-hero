class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.musicSource = null;
        this.sounds = {};
        this.musicStartTime = 0;
    }

    async loadSound(name, url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.sounds[name] = audioBuffer;
    }

    async loadSounds() {
        await Promise.all([
            this.loadSound('music', './song.mp3'),
            this.loadSound('hit', './hit.mp3'),
            this.loadSound('miss', './miss.mp3')
        ]);
    }

    playSound(name) {
        if (!this.sounds[name] || this.audioContext.state === 'suspended') return;
        const source = this.audioContext.createBufferSource();
        source.buffer = this.sounds[name];
        source.connect(this.audioContext.destination);
        source.start(0);
    }

    playMusic() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        if(this.musicSource) {
            this.musicSource.stop();
        }
        this.musicSource = this.audioContext.createBufferSource();
        this.musicSource.buffer = this.sounds.music;
        this.musicSource.connect(this.audioContext.destination);
        
        const offset = 0; // Can be used to start song from a specific time
        this.musicSource.start(0, offset);
        this.musicStartTime = this.audioContext.currentTime - offset;
    }

    stopMusic() {
        if (this.musicSource) {
            try {
                this.musicSource.stop();
            } catch (e) {
                // Ignore errors if source is already stopped
            }
            this.musicSource = null;
        }
    }

    getCurrentTime() {
        if (!this.musicSource || this.musicStartTime === 0) {
            return 0;
        }
        return this.audioContext.currentTime - this.musicStartTime;
    }
}

export default AudioManager;