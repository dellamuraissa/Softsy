
(function () {
  'use strict';

  // ── Elementos ──────────────────────────────────────────
  const header      = document.getElementById('header');
  const hamburger   = document.getElementById('hamburger');
  const navMenu     = document.getElementById('navMenu');
  const navLinks    = document.querySelectorAll('.nav__link, .nav__cta');
  const revealEls   = document.querySelectorAll('.reveal');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  // ── Navbar: sombra ao rolar ─────────────────────────────
  function handleScroll() {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 30px rgba(0,0,0,.35)';
    } else {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,.2)';
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ── Menu Hambúrguer ─────────────────────────────────────
  hamburger.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fechar menu ao clicar em link
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Fechar menu ao clicar fora
  document.addEventListener('click', function (e) {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // ── Scroll Reveal ───────────────────────────────────────
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  // ── Active Nav Link on Scroll ───────────────────────────
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav__link[href="#${id}"]`);

      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          document.querySelectorAll('.nav__link').forEach(l => l.removeAttribute('style'));
          link.style.color = '#FEC422';
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // ── Formulário de Contato ───────────────────────────────
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validação simples
      const nome     = document.getElementById('nome');
      const email    = document.getElementById('email');
      const mensagem = document.getElementById('mensagem');

      let valid = true;

      [nome, email, mensagem].forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#FC8181';
          valid = false;
        }
      });

      // Validação básica de e-mail
      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = '#FC8181';
        valid = false;
      }

      if (!valid) {
        // Shake animation nos campos inválidos
        const invalids = contactForm.querySelectorAll('[style*="FC8181"]');
        invalids.forEach(field => {
          field.animate(
            [
              { transform: 'translateX(0)' },
              { transform: 'translateX(-6px)' },
              { transform: 'translateX(6px)' },
              { transform: 'translateX(-4px)' },
              { transform: 'translateX(0)' }
            ],
            { duration: 300, easing: 'ease-in-out' }
          );
        });
        return;
      }

      // Simula envio
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin .6s linear infinite">
          <path d="M21 12a9 9 0 1 1-9-9" stroke-linecap="round"/>
        </svg>
        Enviando...
      `;

      // Adiciona estilo de spin inline uma vez
      if (!document.getElementById('spin-style')) {
        const style = document.createElement('style');
        style.id = 'spin-style';
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
      }

      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        formSuccess.classList.add('active');
        setTimeout(() => formSuccess.classList.remove('active'), 5000);
      }, 1800);
    });
  }

  // ── Scroll suave para links âncora ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('header').offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ── Animação de entrada hero já gerenciada via CSS ──────
  // (fade-in class no HTML + keyframes no CSS)

  console.log('%cSoftsy 🚀', 'color:#FEC422; font-size:18px; font-weight:bold; background:#031E3B; padding:8px 16px; border-radius:6px;');

})();
