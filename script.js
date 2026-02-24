(function () {
  'use strict'; 
  const header      = document.getElementById('header');
  const hamburger   = document.getElementById('hamburger');
  const navMenu     = document.getElementById('navMenu');
  const navLinks    = document.querySelectorAll('.nav__link, .nav__cta'); /* Todos os links e o CTA */
  const revealEls   = document.querySelectorAll('.reveal');               /* Elementos com animação de entrada */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  /* -------------------------------------------------------
     NAVBAR — sombra dinâmica ao rolar a página
     Aumenta a sombra quando o usuário não está no topo
  ------------------------------------------------------- */
  window.addEventListener('scroll', function () {
    header.style.boxShadow = window.scrollY > 20
      ? '0 4px 30px rgba(0,0,0,.35)'   /* Sombra forte quando rolado */
      : '0 2px 20px rgba(0,0,0,.2)';   /* Sombra suave no topo */
  }, { passive: true }); /* passive: melhora performance em eventos de scroll */

  /* -------------------------------------------------------
     MENU HAMBÚRGUER (mobile)
     Alterna as classes que controlam abertura/fechamento
  ------------------------------------------------------- */
  hamburger.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('open');       /* Abre ou fecha */
    hamburger.classList.toggle('active', isOpen);          /* Anima o X */
    hamburger.setAttribute('aria-expanded', isOpen);       /* Acessibilidade */
    document.body.style.overflow = isOpen ? 'hidden' : ''; /* Trava o scroll do body quando aberto */
  });

  /* Fecha o menu ao clicar em qualquer link dentro dele */
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Fecha o menu ao clicar fora dele (qualquer área da página) */
  document.addEventListener('click', function (e) {
    /* Verifica se o clique foi fora do menu E fora do hambúrguer */
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  /* -------------------------------------------------------
     SCROLL REVEAL — animação de entrada dos elementos
     Usa IntersectionObserver para detectar quando cada
     elemento entra na área visível da tela (viewport)
  ------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          /* Adiciona a classe que dispara a transição CSS */
          entry.target.classList.add('visible');
          /* Para de observar após animar — evita re-trigger */
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,               /* Aciona quando 12% do elemento está visível */
      rootMargin: '0px 0px -40px 0px' /* Margem negativa: aciona um pouco antes do final */
    }
  );

  /* Registra todos os elementos .reveal para serem observados */
  revealEls.forEach(el => revealObserver.observe(el));

  /* -------------------------------------------------------
     LINK ATIVO NA NAVBAR
     Detecta qual seção está visível e destaca o link
     correspondente no menu de navegação
  ------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    /* Offset de 100px para acionar um pouco antes do topo da seção */
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav__link[href="#${id}"]`);

      if (link) {
        /* Verifica se o scroll está dentro dos limites desta seção */
        if (scrollY >= top && scrollY < top + height) {
          /* Remove destaque de todos os links antes de destacar o atual */
          document.querySelectorAll('.nav__link').forEach(l => l.removeAttribute('style'));
          link.style.color = '#FEC422'; /* Destaca com a cor amarela */
        }
      }
    });
  }

  /* Atualiza ao rolar e também na carga inicial da página */
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* -------------------------------------------------------
     FORMULÁRIO DE CONTATO
     Validação customizada + feedback visual + simulação de envio
     Nota: integrar com Formspree, EmailJS ou backend real
  ------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault(); /* Evita o envio padrão do browser */

      /* Captura os campos obrigatórios */
      const nome     = document.getElementById('nome');
      const email    = document.getElementById('email');
      const mensagem = document.getElementById('mensagem');
      let valid = true;

      /* Valida se os campos obrigatórios estão preenchidos */
      [nome, email, mensagem].forEach(field => {
        field.style.borderColor = ''; /* Reseta a borda antes de revalidar */
        if (!field.value.trim()) {
          field.style.borderColor = '#FC8181'; /* Borda vermelha nos inválidos */
          valid = false;
        }
      });

      /* Validação específica do formato de e-mail via regex */
      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = '#FC8181';
        valid = false;
      }

      /* Se inválido: aplica animação de shake nos campos com erro */
      if (!valid) {
        contactForm.querySelectorAll('[style*="FC8181"]').forEach(field => {
          /* Web Animations API: shake lateral rápido */
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
        return; /* Interrompe o processo de envio */
      }

      /* Feedback de carregamento: desabilita o botão e muda o texto */
      const submitBtn   = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando...';

      /* =====================================================
         SIMULAÇÃO DE ENVIO (1.8s de delay)
         Substituir este setTimeout pela integração real:
         - Formspree: mudar action do form
         - EmailJS: emailjs.sendForm(...)
         - Backend: fetch('/api/contato', { method: 'POST', body: formData })
         ===================================================== */
      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;  /* Restaura o texto original */
        contactForm.reset();                 /* Limpa todos os campos */

        /* Exibe a mensagem de sucesso por 5 segundos */
        formSuccess.classList.add('active');
        setTimeout(() => formSuccess.classList.remove('active'), 5000);
      }, 1800);
    });
  }

  /* -------------------------------------------------------
     SCROLL SUAVE PARA ÂNCORAS
     Complementa o scroll-behavior: smooth do CSS,
     descontando a altura do header fixo para não
     esconder o título da seção
  ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return; /* Ignora links que apontam apenas para '#' */

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('header').offsetHeight;
        /* Calcula a posição correta descontando o header */
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

})(); /* Fim da IIFE — executa imediatamente */