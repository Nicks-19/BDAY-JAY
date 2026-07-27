// --- Web Audio API Synth Beat Player ---
let audioCtx;
const initAudio = () => {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
};

const playDholBeat = (ctx, time, pitch) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);

    gain.gain.setValueAtTime(0.5, time);
    gain.gain.linearRampToValueAtTime(0.01, time + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.2);
};

const playMelodyNote = (ctx, time, freq, duration) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle'; // Use triangle or sine for piano-ish tune
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.2, time);
    gain.gain.linearRampToValueAtTime(0.01, time + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + duration);
};

const playDrumsOnly = () => {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Play a longer Bhangra drum beat on unlock
    for (let i = 0; i < 8; i++) {
        const t = now + i * 0.4;
        playDholBeat(ctx, t, 120);
        playDholBeat(ctx, t + 0.1, 90);
        if (i % 2 === 0) playDholBeat(ctx, t + 0.25, 100);
    }
};

const playFullHappyBirthday = () => {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Full Happy Birthday melody
    const melody = [
        { f: 261.63, d: 0.25, t: 0.0 }, // C4
        { f: 261.63, d: 0.25, t: 0.25 },// C4
        { f: 293.66, d: 0.5,  t: 0.5 }, // D4
        { f: 261.63, d: 0.5,  t: 1.0 }, // C4
        { f: 349.23, d: 0.5,  t: 1.5 }, // F4
        { f: 329.63, d: 1.0,  t: 2.0 }, // E4

        { f: 261.63, d: 0.25, t: 3.0 }, // C4
        { f: 261.63, d: 0.25, t: 3.25 },// C4
        { f: 293.66, d: 0.5,  t: 3.5 }, // D4
        { f: 261.63, d: 0.5,  t: 4.0 }, // C4
        { f: 392.00, d: 0.5,  t: 4.5 }, // G4
        { f: 349.23, d: 1.0,  t: 5.0 }, // F4

        { f: 261.63, d: 0.25, t: 6.0 }, // C4
        { f: 261.63, d: 0.25, t: 6.25 },// C4
        { f: 523.25, d: 0.5,  t: 6.5 }, // C5
        { f: 440.00, d: 0.5,  t: 7.0 }, // A4
        { f: 349.23, d: 0.5,  t: 7.5 }, // F4
        { f: 329.63, d: 0.5,  t: 8.0 }, // E4
        { f: 293.66, d: 0.5,  t: 8.5 }, // D4

        { f: 466.16, d: 0.25, t: 9.5 }, // Bb4
        { f: 466.16, d: 0.25, t: 9.75 },// Bb4
        { f: 440.00, d: 0.5,  t: 10.0 }, // A4
        { f: 349.23, d: 0.5,  t: 10.5 }, // F4
        { f: 392.00, d: 0.5,  t: 11.0 }, // G4
        { f: 349.23, d: 1.0,  t: 11.5 }, // F4
    ];

    melody.forEach((note) => {
        playMelodyNote(ctx, now + note.t, note.f, note.d);
    });
};
// Canvas animation loop removed
// --- Interactive Events ---

// Candle Interaction
const flame = document.getElementById('candle-flame');
const statusMsg = document.getElementById('cake-status-msg');
let isBlowedOut = false;

// --- Cinematic Cake Build Sequence ---
const buildCake = () => {
    // Play Happy Birthday song once cake reveal starts
    playFullHappyBirthday();
    
    const tl = gsap.timeline();
    
    // Initial Setup
    gsap.set('.cake-container', { autoAlpha: 1 });
    gsap.set(['#c-plate', '#c-sponge1', '#c-cream', '#c-sponge2', '#c-frosting', '#birthday-candle'], { y: -80, autoAlpha: 0, scale: 0.9 });
    gsap.set('.drip', { scaleY: 0, transformOrigin: "top" });
    gsap.set('#candle-flame', { autoAlpha: 0, scale: 0, opacity: 0 });
    gsap.set('#candle-glow', { autoAlpha: 0 });
    
    // Step-by-step layer building
    tl.fromTo('#c-plate', { y: 200 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" })
      .fromTo('#c-sponge1', { y: 150 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.5, ease: "bounce.out" }, "-=0.3")
      .fromTo('#c-cream', { scaleX: 0, y: 0 }, { scaleX: 1, autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out" }, "-=0.1")
      .fromTo('#c-sponge2', { y: 100 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.5, ease: "bounce.out" }, "-=0.2")
      .fromTo('#c-frosting', { y: 50 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out" }, "-=0.2")
      .to('.drip', { scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.4)", stagger: 0.1 }, "-=0.1")
      .fromTo('#birthday-candle', { y: 50 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(2)" }, "-=0.2")
      .to({}, { duration: 0.4 }) // 400ms pause
      .to('#candle-flame', { autoAlpha: 1, opacity: 1, scale: 1, duration: 0.4, ease: "elastic.out(1.5, 0.5)", onComplete: igniteFlame });
};

const igniteFlame = () => {
    // Subtle glow
    gsap.to('#candle-glow', { autoAlpha: 1, duration: 1 });
    
    // Play the song (moved to start of buildCake)
    // playFullHappyBirthday(); 
    
    // Fire Cinematic Confetti
    fireCinematicConfetti();
    
    // Show Text
    showBirthdayText();
    
    // Reveal Next Button
    gsap.fromTo('#cake-next-action', { autoAlpha: 0, y: 20 }, { display: 'block', autoAlpha: 1, y: 0, duration: 0.8, delay: 1 });
};

const fireCinematicConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ffd700', '#ffffff', '#ff69b4', '#e6e6fa', '#ff0000']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ffd700', '#ffffff', '#ff69b4', '#e6e6fa', '#ff0000']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    };
    frame();
};

const showBirthdayText = () => {
    const nameDisplay = document.getElementById('bday-name-display');
    const inputName = document.getElementById('password-input').value.trim().toUpperCase() || 'JAY';
    nameDisplay.innerText = inputName;
    
    gsap.to('#cinematic-text', { autoAlpha: 1, y: 0, duration: 1.5, ease: "power3.out", delay: 0.2 });
};

// --- Scratch Card Logic ---
const setupCanvas = (wrapper, index) => {
    const canvas = wrapper.querySelector('.scratch-canvas');
    if (canvas.dataset.initialized) return;
    canvas.dataset.initialized = "true";
    
    const sCtx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
    
    // Fill with a nice gold color
    sCtx.fillStyle = '#b8860b';
    sCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text "Scratch me!"
    sCtx.fillStyle = '#fffaf0';
    sCtx.font = 'bold 20px Outfit';
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.fillText('Scratch to Reveal!', canvas.width / 2, canvas.height / 2);
    
    let isScratching = false;
    let isRevealed = false;
    let lastCheck = 0;

    const checkScratchPercentage = () => {
        if (isRevealed) return;
        const pixels = sCtx.getImageData(0, 0, canvas.width, canvas.height).data;
        let cleared = 0;
        const total = pixels.length / 4;
        
        // Sample every 10th pixel for performance
        for (let i = 0; i < pixels.length; i += 40) {
            if (pixels[i + 3] < 128) {
                cleared++;
            }
        }
        const percent = (cleared / (total / 10)) * 100;
        
        // If scratched more than 40%, reveal next card
        if (percent > 40) {
            isRevealed = true;
            
            // Fade out current canvas
            gsap.to(canvas, { opacity: 0, duration: 0.5, onComplete: () => {
                canvas.style.pointerEvents = 'none'; // Allow interacting with text underneath
            }});
            
            const scratchWrappers = document.querySelectorAll('.scratch-card-wrapper');
            // Show Next button if there is a next card
            if (index + 1 < scratchWrappers.length) {
                const track = document.getElementById('scratch-carousel');
                const nextBtnContainer = document.getElementById('next-card-container');
                const nextBtn = document.getElementById('next-card-btn');
                
                // Pop in the Next button
                gsap.fromTo(nextBtnContainer, 
                    { autoAlpha: 0, y: 20 }, 
                    { display: 'block', autoAlpha: 1, y: 0, duration: 0.5 }
                );
                
                // Overwrite onclick to handle this specific transition
                nextBtn.onclick = () => {
                    // Hide button
                    gsap.to(nextBtnContainer, { autoAlpha: 0, duration: 0.3, onComplete: () => {
                        nextBtnContainer.style.display = 'none';
                    }});
                    
                    // Slide the track! (Each slide is 400px wide)
                    const slideWidth = 400; 
                    const targetX = -(index + 1) * slideWidth;
                    
                    gsap.to(track, { x: targetX, duration: 0.8, ease: "power3.inOut" });
                };
            }
        }
    };

    const scratch = (e) => {
        if (!isScratching || isRevealed) return;
        
        const rect = canvas.getBoundingClientRect();
        let clientX = e.clientX;
        let clientY = e.clientY;
        
        if(e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        sCtx.globalCompositeOperation = 'destination-out';
        sCtx.beginPath();
        sCtx.arc(x, y, 25, 0, Math.PI * 2); // Brush size
        sCtx.fill();
        
        // Check percentage occasionally while scratching
        if (Date.now() - lastCheck > 150) {
            lastCheck = Date.now();
            checkScratchPercentage();
        }
    };

    canvas.addEventListener('mousedown', () => isScratching = true);
    window.addEventListener('mouseup', () => {
        if(isScratching) {
            isScratching = false;
            checkScratchPercentage();
        }
    });
    canvas.addEventListener('mousemove', scratch);

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        isScratching = true;
        scratch(e);
    }, {passive: false});
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        scratch(e);
    }, {passive: false});
    window.addEventListener('touchend', () => {
        if(isScratching) {
            isScratching = false;
            checkScratchPercentage();
        }
    });
};

const initScratchCards = () => {
    const scratchWrappers = document.querySelectorAll('.scratch-card-wrapper');
    const track = document.getElementById('scratch-carousel');
    
    // Setup ALL canvases so they are ready as they slide in
    scratchWrappers.forEach((wrapper, i) => {
        setupCanvas(wrapper, i);
    });
    
    // Set track initial position
    gsap.set(track, { x: 0 });
    
    // Animate the whole carousel container in
    const container = document.querySelector('.carousel-container');
    gsap.fromTo(container, 
        { autoAlpha: 0, scale: 0.9, y: 30 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" }
    );
};


// --- Step-by-Step Flow & Password ---
const passwordInput = document.getElementById('password-input');
const unlockBtn = document.getElementById('unlock-btn');
const passwordError = document.getElementById('password-error');
const passwordSection = document.getElementById('password-section');
const mainContent = document.getElementById('main-content');

const checkPassword = () => {
    const val = passwordInput.value.trim().toLowerCase();
    // Accept "nikita" or "jay"
    if (val === 'nikita' || val === 'jay') {
        // Smooth fade out using GSAP
        gsap.to(passwordSection, {
            autoAlpha: 0,
            y: -30,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
                passwordSection.style.display = 'none';
                mainContent.style.display = 'block';
                gsap.set(mainContent, { autoAlpha: 1 }); // Just reveal wrapper
                
                // Play Punjabi Bhangra drums on unlock
                playDrumsOnly();
                
                // Trigger smooth step-1 animation
                window.nextStep(1);
            }
        });
    } else {
        passwordError.textContent = "Oops! Wrong password. Try her name! 😉";
        passwordInput.value = '';
        gsap.fromTo(passwordInput, { x: -10 }, { x: 10, duration: 0.1, yoyo: true, repeat: 3 }); // Shake effect
    }
};

unlockBtn.addEventListener('click', checkPassword);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
});

window.nextStep = (stepNumber) => {
    // Find current active step
    const currentSection = document.querySelector('.step-section[style*="display: block"]');
    const targetSection = document.getElementById(`step-${stepNumber}`);
    
    if (currentSection && targetSection && currentSection !== targetSection) {
        // Transition between steps
        gsap.to(currentSection, {
            autoAlpha: 0, 
            y: -40, 
            duration: 0.5, 
            ease: "power2.in",
            onComplete: () => {
                currentSection.style.display = 'none';
                targetSection.style.display = 'block';
                gsap.fromTo(targetSection, 
                    { autoAlpha: 0, y: 40 }, 
                    { autoAlpha: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" }
                );
                window.scrollTo(0, 0);
                if (stepNumber === 2) {
                    // Trigger the cinematic build sequence
                    buildCake();
                }
                if (stepNumber === 3) {
                    setTimeout(() => {
                        initScratchCards();
                    }, 200);
                }
            }
        });
    } else if (targetSection) { 
        // Initial load for step-1
        targetSection.style.display = 'block';
        gsap.fromTo(targetSection, 
            { autoAlpha: 0, y: 40 }, 
            { autoAlpha: 1, y: 0, duration: 0.8, ease: "back.out(1.5)", delay: 0.2 }
        );
    }
};

// --- Micro-interactions (GSAP) ---
// Magnetic Buttons
const actionBtns = document.querySelectorAll('.action-btn');
actionBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.25; 
        const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
        gsap.to(btn, { x: x, y: y, duration: 0.3, ease: "power2.out" });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    });
});

// 3D Tilt for Scratch Cards
const scratchWrappers = document.querySelectorAll('.scratch-card-wrapper');
scratchWrappers.forEach(wrapper => {
    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -12; 
        const rotateY = ((x - centerX) / centerX) * 12;
        
        gsap.to(wrapper, { 
            rotateX: rotateX, 
            rotateY: rotateY, 
            transformPerspective: 800,
            duration: 0.4, 
            ease: "power2.out" 
        });
    });
    wrapper.addEventListener('mouseleave', () => {
        gsap.to(wrapper, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    });
});

// --- Infinite Confetti Shooter ---
// Custom shapes from emojis (Pizza, Coffee, Laptop, Bug)
const pizza = confetti.shapeFromText({ text: '🍕', scalar: 3 });
const coffee = confetti.shapeFromText({ text: '☕', scalar: 3 });
const laptop = confetti.shapeFromText({ text: '💻', scalar: 3 });
const bug = confetti.shapeFromText({ text: '🐛', scalar: 3 });

document.addEventListener('click', (e) => {
    // Don't shoot confetti when clicking important UI elements
    const ignoreTags = ['BUTTON', 'INPUT', 'CANVAS', 'A'];
    if (ignoreTags.includes(e.target.tagName)) return;
    
    // Convert click coordinates to confetti origin format (0 to 1)
    const originX = e.clientX / window.innerWidth;
    const originY = e.clientY / window.innerHeight;
    
    // Shoot custom emoji confetti!
    confetti({
        particleCount: 12,
        spread: 60,
        startVelocity: 25,
        origin: { x: originX, y: originY },
        shapes: [pizza, coffee, laptop, bug],
        scalar: 1.2,
        ticks: 60
    });
});
