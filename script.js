/* =============================================
   PREMIUM PORTFOLIO SCRIPTS — ATHEEN SUAAD
   ============================================= */

'use strict';

/* ─── Loading Screen ─── */
document.documentElement.classList.add('loading');
document.body.classList.add('loading');

(function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    // Minimum display time so the animation completes gracefully
    const MIN_DURATION = 2000; // ms
    const startTime = performance.now();

    function hideLoader() {
        const elapsed = performance.now() - startTime;
        const remaining = Math.max(MIN_DURATION - elapsed, 0);

        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
            document.documentElement.classList.remove('loading');

            // Remove from DOM after transition ends to free memory
            loader.addEventListener('transitionend', () => loader.remove(), { once: true });
        }, remaining);
    }

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader, { once: true });
    }
})();

/* ─── Typing Effect ─── */
const typedTextSpan = document.querySelector('.typed-text');
const cursorSpan    = document.querySelector('.cursor');

const textArray   = ['Web Developer', 'UI/UX Designer', 'Full-Stack Developer', 'Creative Thinker'];
const typingDelay = 95;
const erasingDelay = 45;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex      = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if (!cursorSpan.classList.contains('typing')) cursorSpan.classList.add('typing');
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        cursorSpan.classList.remove('typing');
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if (!cursorSpan.classList.contains('typing')) cursorSpan.classList.add('typing');
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        cursorSpan.classList.remove('typing');
        textArrayIndex = (textArrayIndex + 1) % textArray.length;
        setTimeout(type, typingDelay + 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (textArray.length) setTimeout(type, newTextDelay + 250);
});

/* ─── Navbar Scroll Effect ─── */
const navbar   = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

let lastScrollY = 0;
let ticking     = false;

function onScroll() {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}

function updateNavbar() {
    const scrollY = window.scrollY;

    // Toggle scrolled state
    navbar.classList.toggle('scrolled', scrollY > 60);

    // Active link tracking
    let current = '';
    sections.forEach(section => {
        if (scrollY >= section.offsetTop - 250) {
            current = section.getAttribute('id') || '';
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    lastScrollY = scrollY;
    ticking = false;
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ─── Mobile Menu ─── */
const hamburger = document.querySelector('.hamburger');
const navMenu   = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

/* ─── Smooth Scroll ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ─── Intersection Observer — Scroll Reveal ─── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');

            // Trigger skill bars
            if (entry.target.classList.contains('skill-category')) {
                requestAnimationFrame(() => animateSkillBars(entry.target));
            }
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.skill-category, .project-card, .stat-item, .contact-action-card').forEach(el => {
    revealObserver.observe(el);
});

/* ─── Skill Bar Animation ─── */
function animateSkillBars(skillCategory) {
    skillCategory.querySelectorAll('.progress-fill').forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        setTimeout(() => {
            bar.style.width = `${progress}%`;
        }, 150);
    });
}

/* ─── Counter Animation for Stats ─── */
function animateCounter(el, target, duration = 1800) {
    let start = null;
    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target) + '+';
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-item h4').forEach(item => {
                const num = parseInt(item.textContent);
                if (num) {
                    item.textContent = '0+';
                    setTimeout(() => animateCounter(item, num), 200);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statsObserver.observe(statsGrid);

/* ─── 3D Tilt on Project Cards ─── */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect      = card.getBoundingClientRect();
        const x         = e.clientX - rect.left;
        const y         = e.clientY - rect.top;
        const centerX   = rect.width  / 2;
        const centerY   = rect.height / 2;
        const rotateX   = ((y - centerY) / centerY) * -6;
        const rotateY   = ((x - centerX) / centerX) *  6;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s linear, box-shadow 0.35s, border-color 0.35s';
    });
});

/* ─── Magnetic Buttons ─── */
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect  = btn.getBoundingClientRect();
        const x     = e.clientX - rect.left - rect.width  / 2;
        const y     = e.clientY - rect.top  - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px) scale(1.04)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.1s linear, box-shadow 0.3s';
    });
});

/* ─── Custom Cursor (Desktop Only) ─── */
if (window.innerWidth > 768 && !window.matchMedia('(pointer: coarse)').matches) {
    const cursorDot  = document.createElement('div');
    const cursorRing = document.createElement('div');

    cursorDot.className  = 'c-dot';
    cursorRing.className = 'c-ring';

    const cursorCSS = `
        .c-dot {
            position: fixed; pointer-events: none; z-index: 99999;
            width: 6px; height: 6px; border-radius: 50%;
            background: hsl(330, 84%, 70%);
            transform: translate(-50%, -50%);
            transition: opacity 0.2s;
            mix-blend-mode: difference;
        }
        .c-ring {
            position: fixed; pointer-events: none; z-index: 99998;
            width: 32px; height: 32px; border-radius: 50%;
            border: 1.5px solid rgba(99,102,241,0.7);
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s, border-color 0.3s;
            mix-blend-mode: difference;
        }
        a:hover ~ .c-ring,
        button:hover ~ .c-ring { width: 50px; height: 50px; border-color: rgba(236,72,153,0.8); }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = cursorCSS;
    document.head.appendChild(styleEl);
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);

    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        cursorDot.style.left = mx + 'px';
        cursorDot.style.top  = my + 'px';
    });

    (function animateRing() {
        rx += (mx - rx) * 0.14;
        ry += (my - ry) * 0.14;
        cursorRing.style.left = rx + 'px';
        cursorRing.style.top  = ry + 'px';
        requestAnimationFrame(animateRing);
    })();

    // Hide default cursor
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button, .btn, .social-icon, .project-link, .hamburger').forEach(el => {
        el.style.cursor = 'none';
    });
}

/* ─── Notification Toast ─── */
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notif-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'notif-toast';
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    const toastStyle = `
        position: fixed; top: 90px; right: 20px;
        display: flex; align-items: center; gap: 0.75rem;
        padding: 1rem 1.5rem;
        background: rgba(8,6,18,0.9);
        border: 1px solid ${type === 'success' ? 'rgba(99,102,241,0.5)' : 'rgba(236,72,153,0.5)'};
        backdrop-filter: blur(20px);
        color: white; border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        font-family: 'Inter', sans-serif; font-weight: 500;
        z-index: 10000; font-size: 0.95rem;
        animation: toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
    `;
    toast.style.cssText = toastStyle;

    const animCSS = `
        @keyframes toastIn {
            from { transform: translateX(120px); opacity: 0; }
            to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes toastOut {
            from { transform: translateX(0); opacity: 1; }
            to   { transform: translateX(120px); opacity: 0; }
        }
    `;
    if (!document.getElementById('toast-styles')) {
        const s = document.createElement('style');
        s.id = 'toast-styles';
        s.textContent = animCSS;
        document.head.appendChild(s);
    }

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastOut 0.35s ease-in forwards';
        setTimeout(() => toast.remove(), 350);
    }, 3500);
}

/* ─── Easter Egg ─── */
let konamiInput = [];
const konamiPattern = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

document.addEventListener('keydown', (e) => {
    konamiInput.push(e.key);
    konamiInput = konamiInput.slice(-konamiPattern.length);
    if (konamiInput.join(',') === konamiPattern.join(',')) {
        showNotification('🎮 Konami Code Activated! You found the secret!', 'success');
    }
});

/* ─── Console Branding ─── */
console.log('%c⚡ Atheen Suaad', 'font-size:22px;font-weight:900;background:linear-gradient(135deg,#6366f1,#ec4899);-webkit-background-clip:text;color:transparent;padding:4px 0');
console.log('%cLooking at the source? Welcome, developer! 😎', 'font-size:13px;color:#8b5cf6;font-family:Inter,sans-serif');
console.log('%c  github.com/Atheens', 'font-size:12px;color:#6b7280;font-style:italic');