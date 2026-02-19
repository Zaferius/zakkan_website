/* ============================================================
   script.js — Portfolio interactions
   ============================================================ */

/* ── Dynamic footer year ── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Nav: add "scrolled" class after user scrolls down ── */
const nav = document.getElementById('nav');

function handleNavScroll() {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run once on load

/* ── Fade-in on scroll (IntersectionObserver) ──
   Elements with class "fade-in" animate in when they enter the viewport.
   Add class "fade-in" to any element you want to animate.
   ── */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once only
      }
    });
  },
  {
    threshold: 0.12,    // trigger when 12% of the element is visible
    rootMargin: '0px 0px -40px 0px', // slight bottom offset for a nicer feel
  }
);

fadeEls.forEach((el) => observer.observe(el));

/* ── Smooth active-link highlight in nav ──
   Highlights the nav link whose section is currently in view.
   ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

function updateActiveLink() {
  let currentId = '';

  sections.forEach((section) => {
    const top = section.getBoundingClientRect().top;
    if (top <= 120) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();


/* ── Video Switcher (landscape project cards) ──
   Reads data-videos JSON array from .vswitcher.
   Prev/Next buttons swap the video src and update the counter.
   ── */
document.querySelectorAll('.vswitcher').forEach((sw) => {
  const videos  = JSON.parse(sw.dataset.videos || '[]');
  const video   = sw.querySelector('.vswitcher__video');
  const btnPrev = sw.querySelector('.vswitcher__btn--prev');
  const btnNext = sw.querySelector('.vswitcher__btn--next');
  const counter = sw.querySelector('.vswitcher__counter');
  const total   = videos.length;
  let current   = 0;

  function go(index) {
    video.pause();
    current = (index + total) % total;
    video.src = videos[current];
    video.load();
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }

  if (counter) counter.textContent = `1 / ${total}`;
  if (btnPrev) btnPrev.addEventListener('click', () => go(current - 1));
  if (btnNext) btnNext.addEventListener('click', () => go(current + 1));
});

/* ── Portrait video overlay ──
   Clicking the expand button opens the video in a tall portrait overlay.
   The card's video is paused; the overlay video plays from the same timestamp.
   ── */
const overlay      = document.getElementById('videoOverlay');
const overlayVideo = document.getElementById('overlayVideo');
const overlayClose = document.getElementById('overlayClose');
const backdrop     = overlay.querySelector('.video-overlay__backdrop');

document.querySelectorAll('.expand-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const cardVideo = btn.closest('.project-card__media--portrait').querySelector('video');
    const src       = cardVideo.querySelector('source').src;
    const time      = cardVideo.currentTime;

    cardVideo.pause();

    overlayVideo.src = src;
    overlayVideo.currentTime = time;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    overlayVideo.play();
  });
});

function closeOverlay() {
  overlay.classList.remove('active');
  overlayVideo.pause();
  overlayVideo.src = '';
  document.body.style.overflow = '';
}

overlayClose.addEventListener('click', closeOverlay);
backdrop.addEventListener('click', closeOverlay);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeOverlay();
});
