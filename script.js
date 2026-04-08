(function () {
  'use strict';

  const WHATSAPP_NUMBER = '5511912918078';

  const header      = document.getElementById('header');
  const hamburger   = document.getElementById('hamburger');
  const navMenu     = document.getElementById('navMenu');
  const navLinks    = document.querySelectorAll('.nav__link, .nav__cta');
  const revealEls   = document.querySelectorAll('.reveal');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  /* NAVBAR — sombra dinâmica */
  window.addEventListener('scroll', function () {
    header.style.boxShadow = window.scrollY > 20
      ? '0 4px 30px rgba(0,0,0,.35)'
      : '0 2px 20px rgba(0,0,0,.2)';
  }, { passive: true });

  /* MENU HAMBÚRGUER */
  hamburger.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', function (e) {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  /* SCROLL REVEAL */
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

  /* LINK ATIVO NA NAVBAR */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector('.nav__link[href="#' + id + '"]');
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

  /* ARMAZENAMENTO LOCAL */
  function salvarContato(dados) {
    var contatos = JSON.parse(localStorage.getItem('softsy_contatos') || '[]');
    var novo = Object.assign({ id: Date.now(), data: new Date().toLocaleString('pt-BR') }, dados);
    contatos.unshift(novo);
    localStorage.setItem('softsy_contatos', JSON.stringify(contatos));
    return novo;
  }

  /* FORMULÁRIO — validação + salva + abre WhatsApp */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nome     = document.getElementById('nome');
      var empresa  = document.getElementById('empresa');
      var email    = document.getElementById('email');
      var mensagem = document.getElementById('mensagem');
      var valid = true;

      [nome, email, mensagem].forEach(function(field) {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#FC8181';
          valid = false;
        }
      });

      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = '#FC8181';
        valid = false;
      }

      if (!valid) {
        contactForm.querySelectorAll('[style*="FC8181"]').forEach(function(field) {
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

      var submitBtn    = contactForm.querySelector('button[type="submit"]');
      var originalHTML = submitBtn.innerHTML;
      submitBtn.disabled  = true;
      submitBtn.innerHTML = 'Enviando...';

      var dados = {
        nome:     nome.value.trim(),
        empresa:  empresa.value.trim() || '\u2014',
        email:    email.value.trim(),
        mensagem: mensagem.value.trim()
      };

      salvarContato(dados);

      var texto =
        '\ud83d\udce9 *Nova mensagem pelo site Softsy*\n\n' +
        '\ud83d\udc64 *Nome:* ' + dados.nome + '\n' +
        '\ud83c\udfe2 *Empresa:* ' + dados.empresa + '\n' +
        '\ud83d\udce7 *E-mail:* ' + dados.email + '\n\n' +
        '\ud83d\udcac *Mensagem:*\n' + dados.mensagem;

      var urlWA = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(texto);

      setTimeout(function () {
        submitBtn.disabled  = false;
        submitBtn.innerHTML = originalHTML;
        contactForm.reset();

        formSuccess.classList.add('active');
        setTimeout(function() { formSuccess.classList.remove('active'); }, 5000);

        window.open(urlWA, '_blank', 'noopener');
      }, 800);
    });
  }

  /* SCROLL SUAVE PARA ÂNCORAS */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = document.getElementById('header').offsetHeight;
        var targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

})();