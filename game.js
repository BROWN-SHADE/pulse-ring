// Game State
const state = {
    score: 0,
    best: localStorage.getItem('neonTapBest') || 0,
    combo: 0,
    isPlaying: false,
    rotation: 0,
    speed: 2,
    targetSize: 60, // degrees
    pointerAngle: 0,
    direction: 1, // 1 or -1 for clockwise/counter-clockwise
    difficulty: 1,
    particles: [],
    targetAngle: 0
};

// Audio Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    // Create oscillator and gain node
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'hit') {
        // High pitch "ding" for successful hit
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    } else if (type === 'combo') {
        // Higher pitch for combo milestones
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1500, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    } else if (type === 'miss') {
        // Low pitch "thud" for miss
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    }
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
}

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const finalScoreEl = document.getElementById('finalScore');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const newBestEl = document.getElementById('newBest');
const comboEl = document.getElementById('combo');

// Canvas Setup
function resizeCanvas() {
    const size = Math.min(window.innerWidth - 40, window.innerHeight - 200, 400);
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Initialize Best Score
bestEl.textContent = state.best;

// Game Loop
let animationId;
let lastTime = 0;

function gameLoop(timestamp) {
    if (!state.isPlaying) return;
    
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    update(deltaTime);
    draw();
    
    animationId = requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    // Rotate pointer
    state.rotation += state.speed * state.direction;
    
    // Keep rotation in 0-360 range
    if (state.rotation >= 360) state.rotation -= 360;
    if (state.rotation < 0) state.rotation += 360;
    
    // Increase difficulty slowly
    if (state.score > 0 && state.score % 5 === 0) {
        state.speed = 2 + (state.score / 5) * 0.3;
    }
    
    // Random direction changes every 10 points (adds unpredictability)
    if (state.score > 0 && state.score % 10 === 0 && Math.random() < 0.001) {
        state.direction *= -1;
    }
}

function draw() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 20;
    
    // Clear canvas
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw outer ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw target zone (the "safe" area)
    const targetStart = (state.targetAngle - state.targetSize / 2) * Math.PI / 180;
    const targetEnd = (state.targetAngle + state.targetSize / 2) * Math.PI / 180;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 10, targetStart, targetEnd);
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00f3ff';
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Glow effect for target
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 10, targetStart, targetEnd);
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.3)';
    ctx.lineWidth = 20;
    ctx.stroke();
    
    // Draw pointer
    const pointerRad = state.rotation * Math.PI / 180;
    const pointerX = centerX + Math.cos(pointerRad) * (radius - 10);
    const pointerY = centerY + Math.sin(pointerRad) * (radius - 10);
    
    // Pointer trail
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(pointerX, pointerY);
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.3)';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Pointer head
    ctx.beginPath();
    ctx.arc(pointerX, pointerY, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff00ff';
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Center decoration
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#00f3ff';
    ctx.fill();
    
    // Draw particles
    state.particles = state.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.vy += 0.1; // gravity
        
        if (p.life > 0) {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            return true;
        }
        return false;
    });
}

// Input Handling
function handleInput(e) {
    if (!state.isPlaying) return;
    e.preventDefault();
    
    // Resume audio context if suspended (browser requirement)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    // Calculate if pointer is in target zone
    let rotation = state.rotation % 360;
    if (rotation < 0) rotation += 360;
    
    let target = state.targetAngle % 360;
    if (target < 0) target += 360;
    
    // Calculate shortest angular distance
    let diff = Math.abs(rotation - target);
    if (diff > 180) diff = 360 - diff;
    
    const isHit = diff <= state.targetSize / 2;
    
    if (isHit) {
        handleHit();
    } else {
        handleMiss();
    }
}

function handleHit() {
    // Score calculation with combo multiplier
    state.combo++;
    const points = 1 * Math.floor(state.combo / 3 + 1);
    state.score += points;
    scoreEl.textContent = state.score;
    
    // Play sound - combo sound for every 5 combo, regular hit otherwise
    if (state.combo > 0 && state.combo % 5 === 0) {
        playSound('combo');
    } else {
        playSound('hit');
    }
    
    // Visual feedback
    createParticles();
    showCombo();
    pulseScreen();
    
    // Move target to new random position (but not too close)
    let newAngle;
    do {
        newAngle = Math.random() * 360;
    } while (Math.abs(newAngle - state.targetAngle) < 90);
    state.targetAngle = newAngle;
    
    // Speed up slightly
    state.speed = Math.min(state.speed + 0.1, 8);
    
    // Haptic feedback if available
    if (navigator.vibrate) navigator.vibrate(50);
}

function handleMiss() {
    // Play miss sound
    playSound('miss');
    
    // Screen shake
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 500);
    
    // Red flash
    canvas.style.boxShadow = '0 0 60px rgba(255, 0, 0, 0.8)';
    setTimeout(() => {
        canvas.style.boxShadow = '';
    }, 300);
    
    endGame();
}

function createParticles() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const colors = ['#00f3ff', '#ff00ff', '#9d00ff', '#ffffff'];
    
    for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 / 20) * i;
        const velocity = 5 + Math.random() * 5;
        state.particles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            life: 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 2 + Math.random() * 4
        });
    }
}

function showCombo() {
    if (state.combo > 1) {
        comboEl.querySelector('.combo-number').textContent = 'x' + state.combo;
        comboEl.classList.add('active');
        setTimeout(() => comboEl.classList.remove('active'), 1000);
    }
}

function pulseScreen() {
    canvas.style.transform = 'scale(1.05)';
    setTimeout(() => canvas.style.transform = 'scale(1)', 100);
}

// Game Control
function startGame() {
    // Resume audio context on user interaction
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    state.score = 0;
    state.combo = 0;
    state.speed = 2;
    state.rotation = 0;
    state.direction = 1;
    state.targetAngle = Math.random() * 360;
    state.isPlaying = true;
    state.particles = [];
    
    scoreEl.textContent = '0';
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    lastTime = performance.now();
    gameLoop(lastTime);
}

function endGame() {
    state.isPlaying = false;
    cancelAnimationFrame(animationId);
    
    // Update best score
    if (state.score > state.best) {
        state.best = state.score;
        localStorage.setItem('neonTapBest', state.best);
        bestEl.textContent = state.best;
        newBestEl.classList.remove('hidden');
    } else {
        newBestEl.classList.add('hidden');
    }
    
    finalScoreEl.textContent = state.score;
    gameOverScreen.classList.remove('hidden');
}

// Event Listeners
canvas.addEventListener('touchstart', handleInput, {passive: false});
canvas.addEventListener('mousedown', handleInput);
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && state.isPlaying) handleInput(e);
});

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);

// Prevent zoom on double tap
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) e.preventDefault();
}, {passive: false});

// Initial draw
draw();