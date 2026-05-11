// MATRIX RAIN
(function () {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[]|\\@#$%^&*';
  let width = 0;
  let height = 0;
  let cols = 0;
  let drops = [];

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    cols = Math.floor(width / 16);
    drops = Array(cols).fill(1);
  }

  function paintMatrix() {
    ctx.fillStyle = 'rgba(10,12,10,0.05)';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '13px "Share Tech Mono"';

    drops.forEach((drop, index) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = drop * 16 > height * 0.7 ? '#004d14' : '#00ff41';
      ctx.fillText(char, index * 16, drop * 16);
      if (drop * 16 > height && Math.random() > 0.975) {
        drops[index] = 0;
      }
      drops[index] += 1;
    });

    requestAnimationFrame(paintMatrix);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  requestAnimationFrame(paintMatrix);
})();

// TYPED ROLE
const roles = ['backend_developer','game_developer','software_developer','web_developer ','server_side_coder'];
let roleIndex = 0;
let charIndex = 0;
let removing = false;
const typedRole = document.getElementById('typed-role');

function updateTyping() {
  const currentRole = roles[roleIndex];

  if (!removing) {
    typedRole.textContent = currentRole.substring(0, charIndex + 1);
    charIndex += 1;
    if (charIndex === currentRole.length) {
      removing = true;
      setTimeout(updateTyping, 1800);
      return;
    }
  } else {
    typedRole.textContent = currentRole.substring(0, charIndex - 1);
    charIndex -= 1;
    if (charIndex === 0) {
      removing = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(updateTyping, removing ? 55 : 110);
}

if (typedRole) {
  updateTyping();
}

// THEME TOGGLE
const themeBtn = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let isDark = localStorage.getItem('theme') ? localStorage.getItem('theme') === 'dark' : prefersDark;

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeBtn.textContent = isDark ? '[light_mode]' : '[dark_mode]';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    applyTheme();
  });
}

applyTheme();

// MOBILE MENU
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    mobileMenu.setAttribute('aria-hidden', expanded ? 'false' : 'true');
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

// SCROLL REVEAL
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((element) => revealObserver.observe(element));

// SKILL BARS
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((bar) => {
          bar.style.width = `${bar.dataset.w}%`;
        });
      }
    });
  },
  { threshold: 0.35 }
);

document.querySelectorAll('.skill-panel').forEach((panel) => skillObserver.observe(panel));

// SKILL TABS
const skillButtons = document.querySelectorAll('.skill-cat-btn');
if (skillButtons.length) {
  skillButtons.forEach((button) => {
    button.addEventListener('click', () => {
      skillButtons.forEach((btn) => btn.classList.remove('active'));
      document.querySelectorAll('.skill-panel').forEach((panel) => panel.classList.remove('active'));

      button.classList.add('active');
      const panel = document.getElementById(`panel-${button.dataset.panel}`);
      if (panel) {
        panel.classList.add('active');
        panel.querySelectorAll('.skill-fill').forEach((bar) => {
          bar.style.width = `${bar.dataset.w}%`;
        });
      }
    });
  });
}

// PROJECT FILTER
const filterButtons = document.querySelectorAll('.filter-btn');
if (filterButtons.length) {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      document.querySelectorAll('.project-card').forEach((card) => {
        const visible = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('hidden', !visible);
      });
    });
  });
}

// NAVIGATION ACTIVE STATE
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const offset = window.scrollY + 120;
  let currentId = 'home';
  sections.forEach((section) => {
    if (offset >= section.offsetTop) {
      currentId = section.id;
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// CONTACT FORM
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = document.getElementById('formStatus');
    const submitButton = contactForm.querySelector('button[type=submit]');

    if (!status || !submitButton) return;

    submitButton.textContent = '// sending...';
    submitButton.disabled = true;

    setTimeout(() => {
      status.textContent = '✓ message_sent. response_ETA: 24h';
      contactForm.reset();
      submitButton.textContent = './send_message';
      submitButton.disabled = false;
      setTimeout(() => {
        status.textContent = '';
      }, 4000);
    }, 1200);
  });
}
