/*
  script.js — cleaned and wrapped external JS
  - Removed surrounding <script> tags
  - Wrapped in DOMContentLoaded to ensure elements exist
  - Small defensive fixes for edge cases
*/

document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     MOBILE MENU
  ========================= */

  const ham = document.getElementById('ham');
  const mobPanel = document.getElementById('mobPanel');
  const mobBg = document.getElementById('mobBg');
  const mobX = document.getElementById('mobX');

  if (ham && mobPanel && mobBg && mobX) {

    ham.addEventListener('click', () => {
      mobPanel.classList.add('open');
      mobBg.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeMob = () => {
      mobPanel.classList.remove('open');
      mobBg.classList.remove('open');
      document.body.style.overflow = '';
    };

    mobX.addEventListener('click', closeMob);
    mobBg.addEventListener('click', closeMob);
  }


  /* =========================
     SCROLL REVEAL
  ========================= */

  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('in');
          }, index * 80);
        }
      });
    }, { threshold: 0.08 });

    revealElements.forEach(el => obs.observe(el));
  }


  /* =========================
     PREMIUM 3D VIDEO SCROLL
  ========================= */

  const scrollSection = document.querySelector('.scroll-video-section');
  const video = document.querySelector('.scroll-video');
  const videoContent = document.querySelector('.video-content');

  if (scrollSection && video) {

    let ticking = false;

    const animate3DVideo = () => {
      const rect = scrollSection.getBoundingClientRect();
      const sectionHeight = scrollSection.offsetHeight;

      // Avoid division by zero when section is same height as viewport
      const denom = sectionHeight - window.innerHeight;
      const rawProgress = denom === 0 ? 0 : (-rect.top) / denom;
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      const scale = 0.72 + (progress * 0.38);
      const rotateX = 18 - (progress * 18);
      const translateY = 180 - (progress * 180);
      const radius = 32 - (progress * 32);
      const opacity = 0.55 + (progress * 0.45);

      video.style.transform = `perspective(1800px) rotateX(${rotateX}deg) scale(${scale}) translateY(${translateY}px)`;
      video.style.borderRadius = `${radius}px`;
      video.style.opacity = `${opacity}`;

      if (videoContent) {
        videoContent.classList.toggle('active', progress > 0.28);
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(animate3DVideo);
        ticking = true;
      }
    });

    // initial call
    animate3DVideo();
  }

});

// Fallback for browsers without IntersectionObserver
// (If IntersectionObserver is supported above, elements are already observed.)
if (!('IntersectionObserver' in window)) {
  const reveals = document.querySelectorAll('.reveal');

  function revealSections() {
    const windowHeight = window.innerHeight;
    reveals.forEach((section) => {
      const revealTop = section.getBoundingClientRect().top;
      if (revealTop < windowHeight - 120) {
        section.classList.add('in');
      }
    });
  }

  window.addEventListener('scroll', revealSections);
  revealSections();
}
