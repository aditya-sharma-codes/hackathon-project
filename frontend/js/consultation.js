// ─── GramHealth Consultation Engine ───────────────────────────────────────
// Adaptive WebRTC with fallback modes

const Consultation = {
  peer: null,
  call: null,
  localStream: null,
  roomId: null,
  consultationId: null,
  mode: 'video', // video | audio | voice-message
  isMuted: false,
  isVideoOff: false,

  async init(roomId, consultationId) {
    this.roomId = roomId;
    this.consultationId = consultationId;

    // Detect network and set mode
    const speed = await NetworkSpeed.detect();
    this.setMode(speed);

    // Init PeerJS
    this.peer = new Peer(roomId, {
      host: '0.peerjs.com',
      port: 443,
      secure: true,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    this.peer.on('open', (id) => {
      console.log('PeerJS connected:', id);
      this.updateStatus('Ready to connect');
      this.showRoomId(id);
    });

    this.peer.on('call', async (incomingCall) => {
      const stream = await this.getLocalStream();
      incomingCall.answer(stream);
      this.handleCall(incomingCall);
    });

    this.peer.on('error', (err) => {
      console.error('PeerJS error:', err);
      Toast.error('Connection error: ' + err.message);
      this.updateStatus('Connection failed - try voice message');
      this.showVoiceMessageMode();  // fallback
    });

    return this.peer;
  },

  setMode(speed) {
    const banner = document.getElementById('conn-banner');
    if (!banner) return;
    const { label, cls } = NetworkSpeed.getLabel();
    banner.className = `conn-banner ${cls}`;
    banner.textContent = label;

    if (speed === 'offline') {
      this.mode = 'offline';
      this.showVoiceMessageMode();
    } else if (speed === 'low') {
      this.mode = 'voice-message';
      this.showVoiceMessageMode();
    } else if (speed === 'medium') {
      this.mode = 'audio';
    } else {
      this.mode = 'video';
    }
  },

  async getLocalStream() {
    const constraints = this.mode === 'audio' || this.mode === 'voice-message'
      ? { audio: true, video: false }
      : { audio: true, video: { width: 640, height: 480, facingMode: 'user' } };

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      const localVideo = document.getElementById('local-video');
      if (localVideo) {
        localVideo.srcObject = this.localStream;
        localVideo.muted = true;
        localVideo.play();
      }
      return this.localStream;
    } catch (err) {
      Toast.warning('Camera/mic access denied. Using text mode.');
      return new MediaStream(); // empty stream
    }
  },

  async startCall(targetPeerId) {
    const stream = await this.getLocalStream();
    this.call = this.peer.call(targetPeerId, stream);
    this.handleCall(this.call);
    Toast.info('Calling...');
    this.updateStatus('Calling...');
  },

  handleCall(call) {
    call.on('stream', (remoteStream) => {
      const remoteVideo = document.getElementById('remote-video');
      if (remoteVideo) {
        remoteVideo.srcObject = remoteStream;
        remoteVideo.play();
      }
      this.updateStatus('Connected');
      Toast.success('Connected to consultation!');

      // Update consultation status
      if (this.consultationId) {
        API.patch(`/consultations/${this.consultationId}`, { status: 'active' })
          .catch(console.error);
      }
    });

    call.on('close', () => {
      this.updateStatus('Call ended');
      Toast.info('Call ended');
    });

    call.on('error', (err) => {
      Toast.error('Call error: ' + err.message);
    });
  },

  toggleMute() {
    if (!this.localStream) return;
    this.isMuted = !this.isMuted;
    this.localStream.getAudioTracks().forEach(t => t.enabled = !this.isMuted);
    const btn = document.getElementById('mute-btn');
    if (btn) btn.textContent = this.isMuted ? '🔇' : '🎙️';
  },

  toggleVideo() {
    if (!this.localStream) return;
    this.isVideoOff = !this.isVideoOff;
    this.localStream.getVideoTracks().forEach(t => t.enabled = !this.isVideoOff);
    const btn = document.getElementById('video-btn');
    if (btn) btn.textContent = this.isVideoOff ? '📵' : '📹';
  },

  async endCall() {
    if (this.call) this.call.close();
    if (this.localStream) this.localStream.getTracks().forEach(t => t.stop());
    if (this.peer) this.peer.destroy();
    if (this.consultationId) {
      await API.patch(`/consultations/${this.consultationId}`, { status: 'completed' })
        .catch(console.error);
    }
    Toast.info('Call ended. Returning to dashboard...');
    setTimeout(() => {
      const user = Auth.user;
      window.location.href = user?.role === 'doctor'
        ? '/doctor-dashboard.html'
        : '/patient-dashboard.html';
    }, 1500);
  },

  updateStatus(msg) {
    const el = document.getElementById('call-status');
    if (el) el.textContent = msg;
  },

  showRoomId(id) {
    const el = document.getElementById('room-id-display');
    if (el) el.textContent = id;
  },

  showVoiceMessageMode() {
    const videoGrid = document.querySelector('.video-grid');
    const voiceModeSection = document.getElementById('voice-mode-section');
    if (videoGrid) videoGrid.style.display = 'none';
    if (voiceModeSection) voiceModeSection.classList.remove('hidden');
  },

  // ─── Voice Message Recording ──────────────────────────────────────
  recorder: null,
  audioChunks: [],
  isRecording: false,

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      this.recorder = new MediaRecorder(stream);
      this.recorder.ondataavailable = (e) => this.audioChunks.push(e.data);
      this.recorder.start();
      this.isRecording = true;

      const btn = document.getElementById('record-btn');
      if (btn) {
        btn.textContent = '⏹️ Stop Recording';
        btn.className = 'btn btn-danger btn-full';
      }
      document.getElementById('voice-indicator')?.classList.remove('hidden');
      Toast.info('Recording...');
    } catch (err) {
      Toast.error('Microphone access denied');
    }
  },

  stopRecording() {
    if (!this.recorder || !this.isRecording) return;
    this.recorder.stop();
    this.isRecording = false;

    this.recorder.onstop = () => {
      const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
      this.saveVoiceMessage(blob);
    };

    const btn = document.getElementById('record-btn');
    if (btn) {
      btn.textContent = '🎙️ Record Voice Message';
      btn.className = 'btn btn-primary btn-full';
    }
    document.getElementById('voice-indicator')?.classList.add('hidden');
  },

  saveVoiceMessage(blob) {
    const reader = new FileReader();
    reader.onload = () => {
      const msgs = JSON.parse(localStorage.getItem('gh_voice_messages') || '[]');
      msgs.push({
        id: Date.now(),
        consultationId: this.consultationId,
        data: reader.result,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('gh_voice_messages', JSON.stringify(msgs));
      Toast.success('Voice message saved. Will send when connected.');
      this.loadVoiceMessages();
    };
    reader.readAsDataURL(blob);
  },

  loadVoiceMessages() {
    const msgs = JSON.parse(localStorage.getItem('gh_voice_messages') || '[]');
    const container = document.getElementById('voice-messages-list');
    if (!container) return;
    if (msgs.length === 0) {
      container.innerHTML = '<p class="text-muted text-sm">No voice messages yet</p>';
      return;
    }
    container.innerHTML = msgs.slice(-5).map(m => `
      <div class="card" style="padding:12px;">
        <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:6px;">${formatDate(m.timestamp)} ${formatTime(m.timestamp)}</div>
        <audio controls src="${m.data}" style="width:100%;height:32px;"></audio>
      </div>
    `).join('');
  }
};