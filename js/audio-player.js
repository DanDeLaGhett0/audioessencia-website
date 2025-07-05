/**
 * AudiEssencia - Audio Player
 * Advanced audio player with Web Audio API integration, visualizations, and custom controls
 */

class AudioPlayer {
    constructor() {
        this.audio = null;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.source = null;
        this.gainNode = null;
        
        this.isPlaying = false;
        this.currentTrack = null;
        this.playlist = [];
        this.currentIndex = 0;
        this.duration = 0;
        this.currentTime = 0;
        this.volume = 0.7;
        
        this.visualizerCanvas = null;
        this.visualizerCtx = null;
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.setupAudioContext();
        this.setupElements();
        this.setupEventListeners();
        this.setupVisualizer();
        this.setupMediaSession();
    }

    setupAudioContext() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create analyser for visualizations
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.8;
            
            // Create gain node for volume control
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = this.volume;
            
            // Create data array for frequency data
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            
            // Connect nodes
            this.gainNode.connect(this.audioContext.destination);
            this.analyser.connect(this.gainNode);
            
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    setupElements() {
        this.playerContainer = document.getElementById('audioPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeBtn = document.getElementById('volumeBtn');
        this.closeBtn = document.getElementById('closePlayer');
        this.trackTitle = document.getElementById('currentTrackTitle');
        this.trackArtist = document.getElementById('currentTrackArtist');
        this.trackArt = document.getElementById('currentTrackArt');
        
        // Set initial volume
        if (this.volumeSlider) {
            this.volumeSlider.value = this.volume;
        }
    }

    setupEventListeners() {
        // Play/Pause button
        this.playPauseBtn?.addEventListener('click', () => {
            this.togglePlayPause();
        });

        // Previous/Next buttons
        this.prevBtn?.addEventListener('click', () => {
            this.previousTrack();
        });

        this.nextBtn?.addEventListener('click', () => {
            this.nextTrack();
        });

        // Progress bar
        this.progressBar?.addEventListener('click', (e) => {
            this.seekTo(e);
        });

        // Volume controls
        this.volumeSlider?.addEventListener('input', (e) => {
            this.setVolume(e.target.value);
        });

        this.volumeBtn?.addEventListener('click', () => {
            this.toggleMute();
        });

        // Close button
        this.closeBtn?.addEventListener('click', () => {
            this.closePlayer();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.playerContainer?.classList.contains('active')) {
                this.handleKeyboardShortcuts(e);
            }
        });

        // Audio context resume on user interaction
        document.addEventListener('click', () => {
            this.resumeAudioContext();
        }, { once: true });
    }

    setupVisualizer() {
        // Create canvas for visualizations
        this.visualizerCanvas = document.createElement('canvas');
        this.visualizerCanvas.width = 200;
        this.visualizerCanvas.height = 50;
        this.visualizerCanvas.className = 'audio-visualizer-mini';
        
        // Style the canvas
        this.visualizerCanvas.style.background = 'rgba(0, 212, 255, 0.1)';
        this.visualizerCanvas.style.borderRadius = '4px';
        this.visualizerCanvas.style.marginLeft = '10px';
        
        this.visualizerCtx = this.visualizerCanvas.getContext('2d');
        
        // Insert canvas into player
        const playerInfo = document.querySelector('.player-info');
        if (playerInfo) {
            playerInfo.appendChild(this.visualizerCanvas);
        }
    }

    setupMediaSession() {
        // Set up Media Session API for better mobile/desktop integration
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => this.play());
            navigator.mediaSession.setActionHandler('pause', () => this.pause());
            navigator.mediaSession.setActionHandler('previoustrack', () => this.previousTrack());
            navigator.mediaSession.setActionHandler('nexttrack', () => this.nextTrack());
            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (this.audio) {
                    this.audio.currentTime = details.seekTime;
                }
            });
        }
    }

    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (error) {
                console.warn('Failed to resume audio context:', error);
            }
        }
    }

    loadTrack(audioSrc, trackInfo = {}) {
        this.currentTrack = {
            src: audioSrc,
            title: trackInfo.title || 'Unknown Track',
            artist: trackInfo.artist || 'audioessentia.com',
            artwork: trackInfo.image || './assets/images/default-artwork.jpg'
        };

        this.updateUI();
        this.loadAudio();
        this.showPlayer();
    }

    loadAudio() {
        if (this.audio) {
            this.audio.pause();
            this.audio.removeEventListener('loadedmetadata', this.onLoadedMetadata);
            this.audio.removeEventListener('timeupdate', this.onTimeUpdate);
            this.audio.removeEventListener('ended', this.onEnded);
            this.audio.removeEventListener('error', this.onError);
        }

        this.audio = new Audio(this.currentTrack.src);
        this.audio.crossOrigin = 'anonymous';
        this.audio.preload = 'metadata';

        // Set up audio element event listeners
        this.audio.addEventListener('loadedmetadata', this.onLoadedMetadata.bind(this));
        this.audio.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
        this.audio.addEventListener('ended', this.onEnded.bind(this));
        this.audio.addEventListener('error', this.onError.bind(this));
        this.audio.addEventListener('canplaythrough', this.onCanPlayThrough.bind(this));

        // Connect to Web Audio API
        this.connectToAudioContext();
    }

    connectToAudioContext() {
        if (this.audioContext && this.audio) {
            try {
                // Disconnect previous source
                if (this.source) {
                    this.source.disconnect();
                }

                // Create new source
                this.source = this.audioContext.createMediaElementSource(this.audio);
                this.source.connect(this.analyser);
                
            } catch (error) {
                console.warn('Failed to connect to audio context:', error);
            }
        }
    }

    onLoadedMetadata() {
        this.duration = this.audio.duration;
        this.updateDuration();
        this.updateMediaSession();
    }

    onTimeUpdate() {
        this.currentTime = this.audio.currentTime;
        this.updateProgress();
        this.updateCurrentTime();
    }

    onEnded() {
        this.nextTrack();
    }

    onError(error) {
        console.error('Audio error:', error);
        this.showError('Failed to load audio file');
    }

    onCanPlayThrough() {
        // Audio is ready to play
        this.hideLoadingState();
    }

    showError(message) {
        console.error(message);
        // You could show a toast notification here
    }

    hideLoadingState() {
        this.playPauseBtn?.classList.remove('loading');
    }

    updateUI() {
        if (this.trackTitle) {
            this.trackTitle.textContent = this.currentTrack.title;
        }
        if (this.trackArtist) {
            this.trackArtist.textContent = this.currentTrack.artist;
        }
        if (this.trackArt) {
            this.trackArt.src = this.currentTrack.artwork;
            this.trackArt.alt = `${this.currentTrack.title} artwork`;
        }
    }

    updateMediaSession() {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: this.currentTrack.title,
                artist: this.currentTrack.artist,
                album: 'audioessentia.com',
                artwork: [
                    { src: this.currentTrack.artwork, sizes: '96x96', type: 'image/jpeg' },
                    { src: this.currentTrack.artwork, sizes: '256x256', type: 'image/jpeg' },
                    { src: this.currentTrack.artwork, sizes: '512x512', type: 'image/jpeg' }
                ]
            });
        }
    }

    updateProgress() {
        if (this.duration > 0) {
            const progress = (this.currentTime / this.duration) * 100;
            if (this.progressFill) {
                this.progressFill.style.width = `${progress}%`;
            }
        }
    }

    updateCurrentTime() {
        if (this.currentTimeEl) {
            this.currentTimeEl.textContent = this.formatTime(this.currentTime);
        }
    }

    updateDuration() {
        if (this.durationEl) {
            this.durationEl.textContent = this.formatTime(this.duration);
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    async play() {
        if (this.audio) {
            try {
                await this.audio.play();
                this.isPlaying = true;
                this.updatePlayButton();
                this.startVisualization();
            } catch (error) {
                console.error('Play failed:', error);
                this.showError('Failed to play audio');
            }
        }
    }

    pause() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlayButton();
            this.stopVisualization();
        }
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    updatePlayButton() {
        if (this.playPauseBtn) {
            this.playPauseBtn.textContent = this.isPlaying ? '⏸' : '▶';
            this.playPauseBtn.setAttribute('aria-label', 
                this.isPlaying ? 'Pause' : 'Play');
        }
    }

    seekTo(e) {
        if (this.audio && this.duration > 0) {
            const rect = this.progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const progress = clickX / rect.width;
            this.audio.currentTime = progress * this.duration;
        }
    }

    setVolume(value) {
        this.volume = parseFloat(value);
        
        if (this.audio) {
            this.audio.volume = this.volume;
        }
        
        if (this.gainNode) {
            this.gainNode.gain.value = this.volume;
        }
        
        this.updateVolumeButton();
    }

    toggleMute() {
        if (this.volume > 0) {
            this.previousVolume = this.volume;
            this.setVolume(0);
            this.volumeSlider.value = 0;
        } else {
            this.setVolume(this.previousVolume || 0.7);
            this.volumeSlider.value = this.volume;
        }
    }

    updateVolumeButton() {
        if (this.volumeBtn) {
            if (this.volume === 0) {
                this.volumeBtn.textContent = '🔇';
            } else if (this.volume < 0.5) {
                this.volumeBtn.textContent = '🔉';
            } else {
                this.volumeBtn.textContent = '🔊';
            }
        }
    }

    previousTrack() {
        // Implement playlist functionality
        console.log('Previous track');
    }

    nextTrack() {
        // Implement playlist functionality
        console.log('Next track');
    }

    showPlayer() {
        if (this.playerContainer) {
            this.playerContainer.classList.add('active');
            
            // Adjust page padding to account for player
            document.body.style.paddingBottom = '100px';
        }
    }

    closePlayer() {
        if (this.playerContainer) {
            this.playerContainer.classList.remove('active');
            document.body.style.paddingBottom = '0';
        }
        
        this.pause();
        this.stopVisualization();
    }

    handleKeyboardShortcuts(e) {
        switch (e.key) {
            case ' ':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.seekRelative(-10);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.seekRelative(10);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.adjustVolume(0.1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.adjustVolume(-0.1);
                break;
            case 'Escape':
                e.preventDefault();
                this.closePlayer();
                break;
        }
    }

    seekRelative(seconds) {
        if (this.audio) {
            this.audio.currentTime = Math.max(0, Math.min(this.duration, this.audio.currentTime + seconds));
        }
    }

    adjustVolume(delta) {
        const newVolume = Math.max(0, Math.min(1, this.volume + delta));
        this.setVolume(newVolume);
        this.volumeSlider.value = newVolume;
    }

    startVisualization() {
        if (this.analyser && this.visualizerCtx) {
            const animate = () => {
                if (this.isPlaying) {
                    this.drawVisualization();
                    this.animationId = requestAnimationFrame(animate);
                }
            };
            animate();
        }
    }

    stopVisualization() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Clear canvas
        if (this.visualizerCtx) {
            this.visualizerCtx.clearRect(0, 0, this.visualizerCanvas.width, this.visualizerCanvas.height);
        }
    }

    drawVisualization() {
        if (!this.analyser || !this.visualizerCtx) return;
        
        this.analyser.getByteFrequencyData(this.dataArray);
        
        const canvas = this.visualizerCanvas;
        const ctx = this.visualizerCtx;
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw frequency bars
        const barWidth = width / this.dataArray.length * 2;
        let x = 0;
        
        for (let i = 0; i < this.dataArray.length; i++) {
            const barHeight = (this.dataArray[i] / 255) * height;
            
            // Create gradient
            const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
            gradient.addColorStop(0, 'rgba(0, 212, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 212, 255, 0.2)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
        
        // Draw waveform overlay
        this.drawWaveform();
    }

    drawWaveform() {
        if (!this.analyser || !this.visualizerCtx) return;
        
        const canvas = this.visualizerCanvas;
        const ctx = this.visualizerCtx;
        const width = canvas.width;
        const height = canvas.height;
        
        // Get time domain data for waveform
        const timeData = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteTimeDomainData(timeData);
        
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const sliceWidth = width / timeData.length;
        let x = 0;
        
        for (let i = 0; i < timeData.length; i++) {
            const v = timeData[i] / 128.0;
            const y = v * height / 2;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        
        ctx.stroke();
    }

    // Audio Effects
    applyLowPassFilter(frequency = 1000) {
        if (this.audioContext && this.source) {
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = frequency;
            
            this.source.disconnect();
            this.source.connect(filter);
            filter.connect(this.analyser);
        }
    }

    applyHighPassFilter(frequency = 1000) {
        if (this.audioContext && this.source) {
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = frequency;
            
            this.source.disconnect();
            this.source.connect(filter);
            filter.connect(this.analyser);
        }
    }

    applyReverb(roomSize = 0.5, decay = 2) {
        if (this.audioContext && this.source) {
            const convolver = this.audioContext.createConvolver();
            convolver.buffer = this.createReverbBuffer(roomSize, decay);
            
            this.source.disconnect();
            this.source.connect(convolver);
            convolver.connect(this.analyser);
        }
    }

    createReverbBuffer(roomSize, decay) {
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * decay;
        const buffer = this.audioContext.createBuffer(2, length, sampleRate);
        
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, roomSize);
            }
        }
        
        return buffer;
    }

    // Analytics
    trackPlayback() {
        if (this.currentTrack) {
            console.log('Track played:', this.currentTrack.title);
            
            // In production, send to analytics service
            // analytics.track('Audio Played', {
            //     track: this.currentTrack.title,
            //     artist: this.currentTrack.artist,
            //     duration: this.duration,
            //     timestamp: new Date().toISOString()
            // });
        }
    }

    // Performance Monitoring
    getPerformanceMetrics() {
        return {
            audioContextState: this.audioContext?.state,
            currentTime: this.currentTime,
            duration: this.duration,
            volume: this.volume,
            isPlaying: this.isPlaying,
            bufferHealth: this.audio?.buffered?.length || 0
        };
    }
}

// Initialize audio player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.audioPlayer = new AudioPlayer();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioPlayer;
} 