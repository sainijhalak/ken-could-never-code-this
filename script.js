/* ==========================================================================
   BARBIE DREAMHOUSE PORTFOLIO - INTERACTIVE ENGINE
   Designed for Jhalak Saini
   ========================================================================== */

// --- 1. Synthesized Web Audio Barbie Chimes (No external files needed) ---
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

// Plays a magical Barbie sparkle sound (celesta / harp arpeggio)
function playSparkleSound() {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    const startTime = audioCtx.currentTime;

    notes.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle'; // Sweet chime timbre
      osc.frequency.setValueAtTime(freq, startTime + index * 0.06);

      // Volume envelope
      gain.gain.setValueAtTime(0, startTime + index * 0.06);
      gain.gain.linearRampToValueAtTime(0.18, startTime + index * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.06 + 0.45);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime + index * 0.06);
      osc.stop(startTime + index * 0.06 + 0.5);
    });
  } catch (e) {
    console.log('Audio autoplay prevented or unsupported');
  }
}

// Plays a celebratory Barbie fanfare
function playFanfareSound() {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const chords = [
      { f: [523.25, 659.25, 783.99], t: 0, d: 0.2 },       // C maj
      { f: [587.33, 739.99, 880.00], t: 0.18, d: 0.2 },    // D maj
      { f: [659.25, 830.61, 987.77], t: 0.36, d: 0.25 },   // E maj
      { f: [1046.50, 1318.51, 1567.98], t: 0.56, d: 0.6 } // High C octave
    ];

    const baseTime = audioCtx.currentTime;

    chords.forEach(chord => {
      chord.f.forEach(freq => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, baseTime + chord.t);

        gain.gain.setValueAtTime(0, baseTime + chord.t);
        gain.gain.linearRampToValueAtTime(0.15, baseTime + chord.t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, baseTime + chord.t + chord.d);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(baseTime + chord.t);
        osc.stop(baseTime + chord.t + chord.d + 0.1);
      });
    });
  } catch (e) {
    console.log(e);
  }
}

// --- 2. Barbie Background Canvas Sparkles ---
const canvas = document.getElementById('sparkle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = 45;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const sparkleColors = ['#ff007f', '#ff69b4', '#ffd700', '#ffffff', '#ffb6c1', '#c71585'];

class SparkleParticle {
  constructor(x, y, isBurst = false) {
    this.reset(x, y, isBurst);
  }

  reset(x, y, isBurst = false) {
    this.x = x !== undefined ? x : Math.random() * canvas.width;
    this.y = y !== undefined ? y : Math.random() * canvas.height;
    this.size = Math.random() * 8 + 4;
    this.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    this.speedY = isBurst ? (Math.random() - 0.5) * 4 : -(Math.random() * 0.8 + 0.2);
    this.speedX = isBurst ? (Math.random() - 0.5) * 4 : (Math.random() - 0.5) * 0.6;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    this.opacity = Math.random() * 0.6 + 0.3;
    this.fadeSpeed = Math.random() * 0.008 + 0.003;
    this.isBurst = isBurst;
    this.life = isBurst ? 40 : 100;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;

    if (this.isBurst) {
      this.opacity -= 0.02;
      this.life--;
      return this.life > 0 && this.opacity > 0;
    }

    this.opacity -= this.fadeSpeed;
    if (this.opacity <= 0 || this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
      this.reset(Math.random() * canvas.width, canvas.height + 10);
    }
    return true;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;

    // Draw 4-point star
    ctx.beginPath();
    const s = this.size;
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(0, 0, s, 0);
    ctx.quadraticCurveTo(0, 0, 0, s);
    ctx.quadraticCurveTo(0, 0, -s, 0);
    ctx.quadraticCurveTo(0, 0, 0, -s);
    ctx.closePath();
    ctx.fill();

    // Central bright glow
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new SparkleParticle());
}

// Mouse sparkle trail
let mouseTimer = 0;
window.addEventListener('mousemove', (e) => {
  mouseTimer++;
  if (mouseTimer % 4 === 0) {
    particles.push(new SparkleParticle(e.clientX, e.clientY, true));
    if (particles.length > 90) particles.splice(0, 1);
  }
});

function animateSparkles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => {
    const alive = p.update();
    if (alive) p.draw();
    return alive;
  });

  // Keep ambient pool filled
  while (particles.length < particleCount) {
    particles.push(new SparkleParticle(Math.random() * canvas.width, canvas.height + 10));
  }
  requestAnimationFrame(animateSparkles);
}
animateSparkles();

// --- 3. Barbie Confetti Blast ---
function triggerBarbieConfetti(originX = 0.5, originY = 0.5) {
  playSparkleSound();
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 65,
      spread: 75,
      origin: { x: originX, y: originY },
      colors: ['#ff007f', '#ff69b4', '#ffd700', '#ffffff', '#c71585'],
      shapes: ['circle', 'square'],
      scalar: 1.2
    });
  }
}

// --- 4. Toast Notification ---
function showBarbieToast(message, icon = '💖') {
  const toast = document.getElementById('barbie-toast');
  if (!toast) return;
  toast.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span> <span>${message}</span>`;
  toast.classList.add('show');
  playSparkleSound();

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// --- 5. 3D Doll Box Tilt Effect ---
const dollBox = document.getElementById('doll-box-container');
if (dollBox) {
  dollBox.addEventListener('mousemove', (e) => {
    const rect = dollBox.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / (rect.height / 2)) * -9; // Max 9 deg
    const rotY = (x / (rect.width / 2)) * 9;

    dollBox.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  dollBox.addEventListener('mouseleave', () => {
    dollBox.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

// --- 6. Clipboard Copy Helper ---
function copyText(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showBarbieToast(`${label} copied to clipboard!`, '✨');
    triggerBarbieConfetti(0.5, 0.3);
  }).catch(() => {
    showBarbieToast(`Contact: ${text}`, '💌');
  });
}

// --- 7. Theme Selector (Clean Light vs Dark) ---
let isDarkMode = false;

function toggleTheme() {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    document.body.classList.remove('theme-light');
    document.body.classList.add('theme-dark');
    localStorage.setItem('barbie-theme', 'dark');
    showBarbieToast('Dark Barbie Mode 🌙⚡', '🖤');
  } else {
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
    localStorage.setItem('barbie-theme', 'light');
    showBarbieToast('Light Barbie Mode 💖✨', '🌸');
  }
  updateThemeUI();
  triggerBarbieConfetti(0.9, 0.9);
}

function setTheme(mode) {
  isDarkMode = (mode === 'dark');
  if (isDarkMode) {
    document.body.classList.remove('theme-light');
    document.body.classList.add('theme-dark');
  } else {
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
  }
  updateThemeUI();
}

function updateThemeUI() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.innerHTML = isDarkMode ? '☀️ <span class="hidden sm:inline">Light</span>' : '🌙 <span class="hidden sm:inline">Dark</span>';
  });
  const floatingBtn = document.getElementById('btn-floating-theme');
  if (floatingBtn) {
    floatingBtn.innerHTML = isDarkMode ? '☀️' : '🌙';
  }
}

// Check saved theme preference on page load
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('barbie-theme');
  if (saved === 'dark') {
    setTheme('dark');
  } else {
    setTheme('light');
  }
});

// --- 8. Sound Toggle ---
function toggleSound() {
  soundEnabled = !soundEnabled;
  const soundBtn = document.getElementById('btn-sound-toggle');
  if (soundBtn) {
    if (soundEnabled) {
      soundBtn.innerHTML = '🎵';
      soundBtn.classList.add('sound-active');
      playSparkleSound();
      showBarbieToast('Sparkle Chimes: ON', '🎶');
    } else {
      soundBtn.innerHTML = '🔇';
      soundBtn.classList.remove('sound-active');
      showBarbieToast('Sparkle Chimes: OFF', '🔇');
    }
  }
}

// --- 9. "Hi Barbie!" Interactive Greeting ---
function greetBarbie() {
  playFanfareSound();
  triggerBarbieConfetti(0.5, 0.4);

  const greetings = [
    "Hi Barbie! Welcome to Jhalak's Dreamhouse! 💖",
    "Hi Barbie! Ready to build some cute AI systems? ✨",
    "Hi Barbie! Let's solve 400+ DSA problems together! ⚡",
    "Hi Barbie! Every day is the best day in tech! 🌸",
    "Hi Barbie! Java, React, and Gemini are in the house! 🎀"
  ];
  const msg = greetings[Math.floor(Math.random() * greetings.length)];
  showBarbieToast(msg, '👑');
}

// --- 10. Contact Form Submission Simulation ---
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('barbie-contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name')?.value || 'Friend';
      playFanfareSound();
      triggerBarbieConfetti(0.5, 0.6);
      showBarbieToast(`Thank you ${name}! Letter delivered to Barbie's Dreamhouse! 💌`, '💖');
      form.reset();
    });
  }

  // Mobile menu toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navContainer = document.querySelector('.nav-links-container');
  if (menuBtn && navContainer) {
    menuBtn.addEventListener('click', () => {
      navContainer.classList.toggle('open');
      playSparkleSound();
    });
  }

  // Attach sound to all buttons and cards
  document.querySelectorAll('button, .btn-barbie-primary, .btn-barbie-secondary, .barbie-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      // Subtle sparkle on hover
    });
    el.addEventListener('click', () => {
      playSparkleSound();
    });
  });
});

// --- 11. Camera Shutter Sound (Web Audio API) ---
function playCameraShutterSound() {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;
    // White noise burst for the mechanical shutter
    const bufferSize = audioCtx.sampleRate * 0.05;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1500, t);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(t);

    // Second metallic click sound (mirror slap)
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, t + 0.06);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.12);

    oscGain.gain.setValueAtTime(0.3, t + 0.06);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);

    osc.start(t + 0.06);
    osc.stop(t + 0.13);
  } catch (e) {
    console.log(e);
  }
}

// --- 12. Snap Mirror Selfie Interaction ---
function snapMirrorSelfie() {
  playCameraShutterSound();

  // Flash animation
  const flash = document.getElementById('camera-flash-overlay');
  if (flash) {
    flash.classList.add('active');
    setTimeout(() => {
      flash.classList.remove('active');
    }, 120);
  }

  // Confetti burst
  triggerBarbieConfetti(0.5, 0.4);

  // Show toast notification
  showBarbieToast("📸 Click! Fitting Room Selfie captured! 💖", "✨");

  // Show/reveal polaroid container if hidden
  const polaroid = document.getElementById('mirror-polaroid-result');
  if (polaroid) {
    polaroid.classList.remove('hidden');
    polaroid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// --- 13. Photo Filter Controls ---
function setSelfieFilter(filterName) {
  const img = document.getElementById('main-selfie-img');
  if (!img) return;

  img.className = 'selfie-img filter-' + filterName;
  playSparkleSound();

  // Update active pill button
  document.querySelectorAll('.filter-pill-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById('btn-filter-' + filterName);
  if (activeBtn) activeBtn.classList.add('active');

  const names = {
    'dreamhouse': 'Dreamhouse Pink Glow 💖',
    'golden': 'Golden Barbie Hour ✨',
    'y2k': 'Y2K Retro Barbie Cam 📸',
    'original': 'Original Chic 🌸'
  };
  showBarbieToast(`Filter: ${names[filterName] || filterName}`, '🎨');
}

// --- 14. Barbie Smartphone (B-Phone 16 Pro) Modal & Apps ---
function openBPhone() {
  playSparkleSound();
  const modal = document.getElementById('b-phone-modal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeBPhone() {
  const modal = document.getElementById('b-phone-modal');
  if (modal) {
    modal.classList.remove('active');
    playSparkleSound();
  }
}

function switchBPhoneApp(appName) {
  playSparkleSound();
  document.querySelectorAll('.bphone-screen-tab').forEach(tab => {
    tab.classList.add('hidden');
  });
  const target = document.getElementById('bphone-tab-' + appName);
  if (target) {
    target.classList.remove('hidden');
  }

  document.querySelectorAll('.bphone-nav-btn').forEach(btn => {
    btn.classList.remove('text-[#ff007f]', 'font-bold');
    btn.classList.add('text-stone-400');
  });
  const activeBtn = document.getElementById('bphone-nav-' + appName);
  if (activeBtn) {
    activeBtn.classList.remove('text-stone-400');
    activeBtn.classList.add('text-[#ff007f]', 'font-bold');
  }
}

// Plays Barbie 8-bit Synth Tune inside the B-Phone
function playBarbieBPhoneTune() {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // Catchy Barbie melody notes (Dance The Night / I'm a Barbie Girl vibe)
    const tune = [
      { f: 659.25, d: 0.2 }, // E5
      { f: 523.25, d: 0.2 }, // C5
      { f: 659.25, d: 0.2 }, // E5
      { f: 783.99, d: 0.35 },// G5
      { f: 659.25, d: 0.2 }, // E5
      { f: 523.25, d: 0.2 }, // C5
      { f: 440.00, d: 0.4 }, // A4
    ];

    let offset = 0;
    tune.forEach(note => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, audioCtx.currentTime + offset);

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + offset + note.d);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime + offset);
      osc.stop(audioCtx.currentTime + offset + note.d + 0.05);

      offset += note.d * 1.1;
    });

    showBarbieToast("🎵 Now Playing: 'Dance The Night' (Barbie Synth)", "💖");
  } catch(e) {}
}


// --- 15. Toggle Box Avatar (Real Selfie vs Vector Doll) ---
function toggleBoxAvatar(type) {
  playSparkleSound();
  const photoEl = document.getElementById('box-avatar-photo');
  const vectorEl = document.getElementById('box-avatar-vector');
  const btnPhoto = document.getElementById('btn-box-photo');
  const btnVector = document.getElementById('btn-box-vector');

  if (type === 'photo') {
    if (photoEl) photoEl.classList.remove('hidden');
    if (vectorEl) vectorEl.classList.add('hidden');
    if (btnPhoto) {
      btnPhoto.className = 'text-[10px] font-bold py-1 px-3 rounded-full bg-[#ff007f] text-white shadow-sm border border-white';
    }
    if (btnVector) {
      btnVector.className = 'text-[10px] font-bold py-1 px-3 rounded-full bg-white text-[#ff007f] shadow-sm border border-[#ff007f]';
    }
    showBarbieToast('Real Barbie Selfie Active! 📸', '💖');
  } else {
    if (photoEl) photoEl.classList.add('hidden');
    if (vectorEl) vectorEl.classList.remove('hidden');
    if (btnPhoto) {
      btnPhoto.className = 'text-[10px] font-bold py-1 px-3 rounded-full bg-white text-[#ff007f] shadow-sm border border-[#ff007f]';
    }
    if (btnVector) {
      btnVector.className = 'text-[10px] font-bold py-1 px-3 rounded-full bg-[#ff007f] text-white shadow-sm border border-white';
    }
    showBarbieToast('Doll Silhouette Active! 🎨', '✨');
  }
}

// --- 16. Live Clock on B-Phone ---
function updateBPhoneClock() {
  const clockEls = document.querySelectorAll('.bphone-live-clock');
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const timeStr = `${hours}:${minutes} ${ampm}`;
  clockEls.forEach(el => { el.textContent = timeStr; });
}
setInterval(updateBPhoneClock, 10000);
updateBPhoneClock();

// --- 17. Interactive Chat with Ken in B-Phone ---
const kenDialogues = {
  'gemini': {
    user: 'Yes! Multimodal Gemini API is connected 💅',
    ken: 'OMG Jhalak you are a genius! Now the crops in Barbieland will never get sick! 🌱💖'
  },
  'beach': {
    user: 'Ken, please go do beach. I am coding in Java ☕',
    ken: 'My job is just beach anyway! Let me know if you need any cheerleading while you solve DSA! 🏄‍♂️✨'
  },
  'leetcode': {
    user: 'Solved 400+ LeetCode problems today! ⚡',
    ken: '400+?! I tried doing Two Sum and my rollerblade fell off! You are literally unstoppable! 👑💅'
  }
};

function sendKenChat(key) {
  const data = kenDialogues[key];
  if (!data) return;

  playSparkleSound();
  const chatContainer = document.getElementById('bphone-chat-messages');
  if (!chatContainer) return;

  // Add User Bubble
  const userDiv = document.createElement('div');
  userDiv.className = 'bg-[#ff007f] text-white p-2.5 rounded-2xl rounded-tr-sm max-w-[85%] ml-auto shadow-sm text-[11px] animate-bounce';
  userDiv.textContent = data.user;
  chatContainer.appendChild(userDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Simulate Ken Typing
  setTimeout(() => {
    playFanfareSound();
    const kenDiv = document.createElement('div');
    kenDiv.className = 'bg-stone-200 text-[#3b0d27] p-2.5 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm text-[11px]';
    kenDiv.innerHTML = `<strong>Ken:</strong> ${data.ken}`;
    chatContainer.appendChild(kenDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    showBarbieToast('New message from Ken! 💬', '💖');
  }, 700);
}

// --- 18. Interactive Barbie Job Offer Builder ---
let selectedRole = 'Full-Stack Software Engineer (Java & React)';
let selectedPerks = ['High-Impact AI Projects 🚀', '100% Mojo Dojo Free Workplace 💅'];

function selectOfferRole(btn, role) {
  playSparkleSound();
  document.querySelectorAll('.role-chip').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedRole = role;
}

function toggleOfferPerk(btn, perk) {
  playSparkleSound();
  btn.classList.toggle('selected');
  if (selectedPerks.includes(perk)) {
    selectedPerks = selectedPerks.filter(p => p !== perk);
  } else {
    selectedPerks.push(perk);
  }
}

function sendDreamOffer() {
  playFanfareSound();
  triggerBarbieConfetti(0.5, 0.4);

  const company = document.getElementById('offer-company-name')?.value || 'Our Company';
  const notes = document.getElementById('offer-custom-notes')?.value || 'We would love to discuss exciting opportunities with you!';

  const subject = encodeURIComponent(`Dreamhouse Job Offer: ${selectedRole} for Jhalak Saini`);
  const body = encodeURIComponent(
`Hi Jhalak,

We were blown away by your Barbie Dreamhouse Portfolio, your 400+ LeetCode DSA skills, and your AI projects (Vayalum & RAG Chatbot)!

Company / Team: ${company}
Proposed Role: ${selectedRole}
Perks Offered:
${selectedPerks.map(p => `• ${p}`).join('\n')}

Personal Note:
${notes}

Let's schedule a chat to discuss bringing your engineering magic to our team!

Best regards,
${company}`
  );

  showBarbieToast('Preparing your Dream Offer email to Jhalak! 💌', '💖');
  setTimeout(() => {
    window.location.href = `mailto:sainijhalak015@gmail.com?subject=${subject}&body=${body}`;
  }, 1000);
}

// --- 19. Funny Barbie Dev Quote Machine ---
const barbieQuotes = [
  "In Barbieland, every merge conflict resolves itself without a scratch! 💅",
  "He's just Ken. She's building autonomous LangChain multi-agent workflows! 🤖✨",
  "There are no runtime exceptions in the Dreamhouse, only learning opportunities! 🌸",
  "400+ LeetCode problems down. Ken couldn't even invert a binary tree! ⚡",
  "Because software engineering looks 100x prettier in hot pink! 💖"
];
let quoteIdx = 0;

function nextBarbieQuote() {
  playSparkleSound();
  triggerBarbieConfetti(0.5, 0.5);
  quoteIdx = (quoteIdx + 1) % barbieQuotes.length;
  const el = document.getElementById('barbie-quote-text');
  if (el) {
    el.textContent = `"${barbieQuotes[quoteIdx]}"`;
  }
}

// ==========================================================================
// B-PHONE 16 PRO MAX INTERACTIVE OS ENGINE
// ==========================================================================

let bphoneMusicPlaying = false;
let currentBPhoneApp = 'home';
let bugGameScore = 0;
let bugGameTimer = null;
let bphoneScreenOn = true;

// 1. Launch App from Homescreen
function openBPhoneApp(appName) {
  playSparkleSound();
  currentBPhoneApp = appName;

  // Hide Homescreen
  const homescreen = document.getElementById('bphone-homescreen');
  if (homescreen) homescreen.classList.add('hidden');

  // Hide all other apps
  document.querySelectorAll('.bphone-app-view').forEach(app => {
    app.classList.add('hidden');
  });

  // Show target app
  const targetApp = document.getElementById('bphone-app-' + appName);
  if (targetApp) {
    targetApp.classList.remove('hidden');
  }

  // If opening music app and music is playing, spin vinyl
  if (appName === 'music') {
    const vinyl = document.getElementById('bphone-vinyl-disk');
    if (vinyl && bphoneMusicPlaying) vinyl.classList.add('spinning');
  }

  // If opening bug game, start spawner
  if (appName === 'game') {
    startBugGame();
  }

  showBarbieToast(`Launched ${appName.toUpperCase()} App ✨`, '📱');
}

// 2. Return to Homescreen (Swipe up Home Bar)
function closeBPhoneApp() {
  playSparkleSound();
  currentBPhoneApp = 'home';

  // Hide all app views
  document.querySelectorAll('.bphone-app-view').forEach(app => {
    app.classList.add('hidden');
  });

  // Show homescreen
  const homescreen = document.getElementById('bphone-homescreen');
  if (homescreen) homescreen.classList.remove('hidden');

  if (bugGameTimer) clearInterval(bugGameTimer);
}

// 3. Dynamic Island Expand / Collapse
function toggleDynamicIsland() {
  playSparkleSound();
  const island = document.getElementById('bphone-island');
  if (island) {
    island.classList.toggle('expanded');
    const content = document.getElementById('bphone-island-content');
    if (island.classList.contains('expanded')) {
      if (content) content.innerHTML = `
        <div class="flex items-center gap-2 text-left">
          <span class="text-base">🎵</span>
          <div>
            <div class="text-[10px] font-bold text-white leading-tight">Dance The Night</div>
            <div class="text-[8px] text-pink-300">Barbie Album • Playing</div>
          </div>
        </div>
        <div class="sound-bars !h-3">
          <span class="sound-bar !w-1"></span>
          <span class="sound-bar !w-1"></span>
          <span class="sound-bar !w-1"></span>
        </div>
      `;
    } else {
      if (content) content.innerHTML = `
        <span class="bphone-live-clock font-bold text-white text-[10px]">11:11 PM</span>
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span class="text-pink-300 font-bold text-[10px]">100% 💖</span>
      `;
      updateBPhoneClock();
    }
  }
}

// 4. Volume Buttons Click
function triggerBPhoneVolume(dir) {
  playSparkleSound();
  const hud = document.getElementById('bphone-vol-hud');
  if (hud) {
    hud.classList.remove('hidden');
    clearTimeout(window.volTimer);
    window.volTimer = setTimeout(() => { hud.classList.add('hidden'); }, 1500);
  }
  showBarbieToast(`Volume ${dir.toUpperCase()} 🔊`, '🎶');
}

// 5. Power Button (Screen Sleep / Wake)
function toggleBPhonePower() {
  bphoneScreenOn = !bphoneScreenOn;
  const screen = document.getElementById('bphone-screen-container');
  if (screen) {
    if (bphoneScreenOn) {
      screen.style.filter = 'brightness(1)';
      playSparkleSound();
      showBarbieToast('B-Phone Unlocked 💖', '✨');
    } else {
      screen.style.filter = 'brightness(0)';
      showBarbieToast('B-Phone Locked 🔒', '🌙');
    }
  }
}

// 6. Bug Smasher Mini-Game Engine
function startBugGame() {
  bugGameScore = 0;
  updateBugScore();
  spawnNextBug();
}

function updateBugScore() {
  const scoreEl = document.getElementById('bphone-bug-score');
  if (scoreEl) scoreEl.textContent = bugGameScore;
}

function spawnNextBug() {
  const grid = document.getElementById('bphone-bug-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const bugEmojis = ['🐛', '🪲', '🐞', '🦗'];
  const bug = document.createElement('div');
  bug.className = 'bphone-bug';
  bug.textContent = bugEmojis[Math.floor(Math.random() * bugEmojis.length)];

  // Random coordinates within grid
  const maxW = 240;
  const maxH = 200;
  bug.style.left = Math.floor(Math.random() * maxW) + 'px';
  bug.style.top = Math.floor(Math.random() * maxH) + 'px';

  bug.onclick = () => {
    playSparkleSound();
    bugGameScore += 100;
    updateBugScore();
    bug.textContent = '✨';
    bug.style.transform = 'scale(1.8)';
    setTimeout(() => {
      spawnNextBug();
      if (bugGameScore >= 500 && bugGameScore % 500 === 0) {
        triggerBarbieConfetti(0.5, 0.5);
        showBarbieToast('Senior Developer Level! 500+ Bugs Smashed! 🎉', '👑');
      }
    }, 250);
  };

  grid.appendChild(bug);
}

// 7. B-Phone Wallpaper Switcher
function setBPhoneWallpaper(type) {
  playSparkleSound();
  const screen = document.getElementById('bphone-screen-container');
  if (!screen) return;

  const wallpapers = {
    'dreamhouse': 'radial-gradient(circle at top, #ffe4f3 0%, #ffc2df 50%, #ffa8d2 100%)',
    'cyber': 'radial-gradient(circle at top, #2b0230 0%, #15001c 60%, #08000b 100%)',
    'sunset': 'radial-gradient(circle at top, #ffedd5 0%, #fed7aa 40%, #f472b6 100%)',
    'glitter': 'radial-gradient(circle at top, #fff0f7 0%, #ffd6eb 45%, #ffb3d9 100%)'
  };

  screen.style.background = wallpapers[type] || wallpapers['dreamhouse'];
  showBarbieToast(`Wallpaper: ${type.toUpperCase()} 🎨`, '✨');
}

// 8. Barbie Music Turntable Toggle
function toggleBarbieMusic() {
  const vinyl = document.getElementById('bphone-vinyl-disk');
  const btn = document.getElementById('bphone-play-btn');

  bphoneMusicPlaying = !bphoneMusicPlaying;
  if (bphoneMusicPlaying) {
    if (vinyl) vinyl.classList.add('spinning');
    if (btn) btn.innerHTML = '<i class="fa-solid fa-pause"></i> <span>Pause Track</span>';
    playBarbieBPhoneTune();
  } else {
    if (vinyl) vinyl.classList.remove('spinning');
    if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i> <span>Play Track</span>';
    showBarbieToast('Music Paused ⏸️', '🎵');
  }
}
