// =====================================================================
// UTILITIES
// =====================================================================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function typewrite(el, text, speed = 45) {
  return new Promise((resolve) => {
    el.textContent = "";
    el.classList.add("typed");
    let i = 0;
    if (prefersReducedMotion) { el.textContent = text; resolve(); return; }
    const tick = () => {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        requestAnimationFrame(() => setTimeout(tick, speed));
      } else {
        resolve();
      }
    };
    tick();
  });
}

// =====================================================================
// LOADER SEQUENCE
// =====================================================================
function runLoader() {
  const loader = $("#loader");
  const loaderText = $("#loader-text");
  const bar = $("#loader-bar");
  const main = $("#main-content");

  requestAnimationFrame(() => { bar.style.width = "55%"; });

  setTimeout(() => {
    loaderText.style.opacity = 0;
    setTimeout(() => {
      loaderText.textContent = "Loading your surprise...";
      loaderText.style.opacity = 1;
      bar.style.width = "100%";
    }, 400);
  }, 2000);

  setTimeout(() => {
    loader.classList.add("fade-out");
    main.classList.remove("hidden");
    startHeroTyping();
    initScrollReveal();
  }, 3600);
}

// =====================================================================
// HERO TYPEWRITER SEQUENCE
// =====================================================================
async function startHeroTyping() {
  await typewrite($("#type-line-1"), "Happy Girlfriend's Day ❤️", 55);
  await typewrite($("#type-line-2"), "For", 70);
  await typewrite($("#type-line-3"), "Purity Chepchumba", 60);
  await typewrite($("#type-line-4"), "(My Beautiful Mkissi 🌸)", 45);
  $$(".hero-inner [data-reveal]").forEach((el) => el.classList.add("in-view"));
}

$("#open-surprise-btn").addEventListener("click", () => {
  $("#letter").scrollIntoView({ behavior: "smooth" });
});

// =====================================================================
// SCROLL REVEAL
// =====================================================================
function initScrollReveal() {
  const items = $$("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => observer.observe(el));
}

// =====================================================================
// AMBIENT BACKGROUND: HEARTS, PETALS, SPARKLES
// =====================================================================
function spawnAmbient() {
  if (prefersReducedMotion) return;

  const heartsLayer = $("#hearts-layer");
  const petalsLayer = $("#petals-layer");
  const sparkleLayer = $("#sparkle-layer");

  setInterval(() => {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = "❤";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
    heart.style.animationDuration = 9 + Math.random() * 6 + "s";
    heart.style.fontSize = 0.9 + Math.random() * 1.2 + "rem";
    heartsLayer.appendChild(heart);
    setTimeout(() => heart.remove(), 16000);
  }, 1400);

  setInterval(() => {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = 10 + Math.random() * 6 + "s";
    petalsLayer.appendChild(petal);
    setTimeout(() => petal.remove(), 17000);
  }, 2200);

  setInterval(() => {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = Math.random() * 100 + "vw";
    sparkle.style.top = Math.random() * 100 + "vh";
    sparkle.style.animationDelay = Math.random() * 2 + "s";
    sparkleLayer.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 3000);
  }, 900);
}

// =====================================================================
// CURSOR HEART TRAIL
// =====================================================================
function initCursorTrail() {
  const canvas = $("#cursor-canvas");
  const ctx = canvas.getContext("2d");
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);
  window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  let trail = [];
  const addPoint = (x, y) => {
    trail.push({ x, y, life: 1 });
    if (trail.length > 24) trail.shift();
  };

  window.addEventListener("pointermove", (e) => addPoint(e.clientX, e.clientY));

  function loop() {
    ctx.clearRect(0, 0, w, h);
    trail.forEach((p, i) => {
      p.life -= 0.045;
      if (p.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.translate(p.x, p.y);
      ctx.scale(p.life * 0.5, p.life * 0.5);
      ctx.fillStyle = "#B76E79";
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.bezierCurveTo(-6, -4, -14, 4, 0, 12);
      ctx.bezierCurveTo(14, 4, 6, -4, 0, 4);
      ctx.fill();
      ctx.restore();
    });
    trail = trail.filter((p) => p.life > 0);
    requestAnimationFrame(loop);
  }
  if (!prefersReducedMotion) loop();
}

// =====================================================================
// LOVE LETTER ENVELOPE
// =====================================================================
function initEnvelope() {
  const envelope = $("#envelope");
  const seal = $("#envelope-seal");
  const hint = $("#envelope-hint");
  const letterText = $("#letter-text");
  const fullLetter = `Dear Mkissi,

Happy Girlfriend's Day ❤️

Today, I just wanted to take a moment to remind you how much I appreciate having you in my life. Your kindness, your smile, your strength, and the wonderful person you are make every conversation and every shared moment feel special.

Thank you for being yourself. Thank you for bringing warmth, laughter, and positivity wherever you go. I hope today reminds you just how valued and appreciated you are.

No website could ever fully express how much someone can mean, but I hope this little surprise makes you smile.

Wishing you a beautiful Girlfriend's Day filled with happiness.

With love,
❤️`;

  let opened = false;
  seal.addEventListener("click", async () => {
    if (opened) return;
    opened = true;
    seal.classList.add("broken");
    hint.style.opacity = "0";
    setTimeout(async () => {
      envelope.classList.add("open");
      await new Promise((r) => setTimeout(r, 1300));
      typewrite(letterText, fullLetter, 22);
    }, 250);
  });
}

// =====================================================================
// FLIP CARDS
// =====================================================================
function initFlipCards() {
  $$(".flip-card").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("flipped"));
  });
}

// =====================================================================
// GALLERY LIGHTBOX
// =====================================================================
function initGallery() {
  const lightbox = $("#lightbox");
  const lightboxPhoto = $("#lightbox-photo");

  $$(".polaroid").forEach((pol) => {
    pol.addEventListener("click", () => {
      const photoClass = $(".polaroid-photo", pol).className.split(" ").find((c) => c.startsWith("photo-"));
      lightboxPhoto.className = "lightbox-photo " + photoClass;
      lightbox.classList.add("show");
    });
  });

  lightbox.addEventListener("click", () => lightbox.classList.remove("show"));
}

// =====================================================================
// VINYL RECORD PLAYER (Web Audio API generated instrumental)
// =====================================================================
function initRecordPlayer() {
  const playBtn = $("#play-btn");
  const playIcon = $("#play-icon");
  const pauseIcon = $("#pause-icon");
  const vinyl = $("#vinyl");
  const tonearm = $("#tonearm");
  const volumeSlider = $("#volume-slider");

  let audioCtx = null;
  let masterGain = null;
  let noteInterval = null;
  let playing = false;

  const melody = [523.25, 587.33, 659.25, 587.33, 523.25, 493.88, 440, 493.88, 523.25];
  let noteIndex = 0;

  function ensureAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = volumeSlider.value / 100 * 0.25;
      masterGain.connect(audioCtx.destination);
    }
  }

  function playNote(freq) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.1);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);
  }

  function startMusic() {
    ensureAudio();
    if (audioCtx.state === "suspended") audioCtx.resume();
    playNote(melody[noteIndex % melody.length]);
    noteIndex++;
    noteInterval = setInterval(() => {
      playNote(melody[noteIndex % melody.length]);
      noteIndex++;
    }, 750);
  }

  function stopMusic() {
    clearInterval(noteInterval);
  }

  playBtn.addEventListener("click", () => {
    playing = !playing;
    playIcon.style.display = playing ? "none" : "block";
    pauseIcon.style.display = playing ? "block" : "none";
    vinyl.classList.toggle("spinning", playing);
    tonearm.classList.toggle("playing", playing);
    if (playing) startMusic(); else stopMusic();
  });

  volumeSlider.addEventListener("input", () => {
    if (masterGain) masterGain.gain.value = (volumeSlider.value / 100) * 0.25;
  });
}

// =====================================================================
// NIGHT SKY / STARS
// =====================================================================
function initStars() {
  const canvas = $("#stars-canvas");
  const ctx = canvas.getContext("2d");
  const section = $("#stars-section");
  let w, h, stars = [];
  let brightStar = null;

  function resize() {
    w = canvas.width = section.offsetWidth;
    h = canvas.height = section.offsetHeight;
    buildStars();
  }

  function buildStars() {
    stars = [];
    const count = Math.floor((w * h) / 6000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
      });
    }
    brightStar = {
      x: w * (0.25 + Math.random() * 0.5),
      y: h * (0.2 + Math.random() * 0.35),
      r: 5,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach((s) => {
      s.phase += s.speed;
      const alpha = 0.4 + Math.sin(s.phase) * 0.4;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.max(alpha,0.1)})`;
      ctx.fill();
    });

    if (brightStar) {
      const glow = ctx.createRadialGradient(brightStar.x, brightStar.y, 0, brightStar.x, brightStar.y, 26);
      glow.addColorStop(0, "rgba(255,240,200,0.95)");
      glow.addColorStop(1, "rgba(255,240,200,0)");
      ctx.beginPath();
      ctx.arc(brightStar.x, brightStar.y, 26, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(brightStar.x, brightStar.y, brightStar.r, 0, Math.PI * 2);
      ctx.fillStyle = "#fff8e0";
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (brightStar && Math.hypot(x - brightStar.x, y - brightStar.y) < 30) {
      $("#star-message").classList.remove("hidden");
    }
  });

  window.addEventListener("resize", resize);
  resize();
  draw();
}

// =====================================================================
// FINAL GIFT BOX + CONFETTI + BLACKOUT
// =====================================================================
function initGiftBox() {
  const giftBox = $("#gift-box");
  const giftHint = $("#gift-hint");
  const thankYou = $("#thank-you");
  let opened = false;

  giftBox.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    giftBox.classList.add("open");
    giftHint.style.opacity = "0";
    launchConfetti();
    setTimeout(() => {
      thankYou.classList.remove("hidden");
      requestAnimationFrame(() => (thankYou.style.opacity = "1"));
    }, 900);
  });

  $("#one-more-thing-btn").addEventListener("click", () => {
    const blackout = $("#blackout");
    blackout.classList.remove("hidden");
    requestAnimationFrame(() => blackout.classList.add("show"));
    const finalMsg =
      "Of all the surprises on this page, my favorite one is getting to know someone as wonderful as you.\n\nHappy Girlfriend's Day, Mkissi. ❤️";
    setTimeout(() => typewrite($("#blackout-text"), finalMsg, 40), 900);
  });
}

function launchConfetti() {
  const canvas = $("#confetti-canvas");
  const ctx = canvas.getContext("2d");
  const w = (canvas.width = window.innerWidth);
  const h = (canvas.height = window.innerHeight);
  const colors = ["#FADADD", "#B76E79", "#E6E6FA", "#FFF8F0"];
  const pieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * w,
    y: -20 - Math.random() * h * 0.5,
    size: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: 2 + Math.random() * 3,
    speedX: Math.random() * 2 - 1,
    rotation: Math.random() * 360,
    rotSpeed: Math.random() * 6 - 3,
  }));

  let frame = 0;
  function loop() {
    frame++;
    ctx.clearRect(0, 0, w, h);
    pieces.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (frame < 260) requestAnimationFrame(loop);
    else ctx.clearRect(0, 0, w, h);
  }
  loop();
}

// =====================================================================
// INIT
// =====================================================================
window.addEventListener("DOMContentLoaded", () => {
  runLoader();
  spawnAmbient();
  initCursorTrail();
  initEnvelope();
  initFlipCards();
  initGallery();
  initRecordPlayer();
  initStars();
  initGiftBox();
});
