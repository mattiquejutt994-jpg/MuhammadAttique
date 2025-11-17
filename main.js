(() => {
  // Helpers
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  // Footer year
  const yr2 = document.getElementById('yr2');
  if (yr2) yr2.textContent = new Date().getFullYear();

  // THEME: persisted
  const themeToggle = $('#themeToggle');
  const themeLabel = $('#themeLabel');
  const stored = localStorage.getItem('theme-mode');
  const applyTheme = (mode) => {
    document.documentElement.setAttribute('data-theme', mode);
    themeToggle.checked = (mode === 'light');
    themeLabel.innerHTML = (mode === 'light') ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
    localStorage.setItem('theme-mode', mode);
  };
  if (stored) { applyTheme(stored); } else { applyTheme('dark'); }
  themeToggle.addEventListener('change', e => applyTheme(e.target.checked ? 'light' : 'dark'));

  // Lenis smooth scroll
  const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // Navbar scrolled class
  const navbar = document.getElementById('mainNav');
  if (navbar) {
    lenis.on('scroll', (e) => {
      if (e.scroll > 20) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
    });
  }
  // GSAP scroll animations
  gsap.registerPlugin(ScrollTrigger);

  // Animate general text elements
  gsap.utils.toArray('.section-title, .display-4, .lead, .eyebrow').forEach((el, i) => {
    gsap.from(el, {
      y: 30, opacity: 0, duration: 0.8, delay: i * 0.06,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
  
  // Animate project cards (replaces AOS zoom-in)
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
      scale: 0.9, y: 40, opacity: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: card, start: 'top 85%' }
    });
  });
  
  // Animate sections with a fade-in-from-left effect
  const animateSectionChildren = (selector) => {
    gsap.from(`${selector} > *`, {
      x: -40, opacity: 0, stagger: 0.2, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: selector, start: 'top 80%' }
    });
  };
  animateSectionChildren('#about-section');
  animateSectionChildren('#contact-section');

  // Animate skill bars on scroll
  gsap.utils.toArray('.skill-card .progress-bar').forEach((bar) => {
    const width = bar.style.width || bar.getAttribute('data-width') || '0%';
    gsap.fromTo(bar, { width: '0%' }, {
      width: width,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: bar, start: 'top 80%' }
    });
  });

  // VanillaTilt
  VanillaTilt.init(document.querySelectorAll(".tilt-card"), { max: 12, speed: 400, glare: true, "max-glare": 0.12 });

  // Particles
  if (window.particlesJS) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: ["#7b5cff", "#4be1ac", "#ffffff"] },
        shape: { type: "circle" },
        opacity: { value: 0.6 },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 140, color: "#ffffff", opacity: 0.06, width: 1 },
        move: { enable: true, speed: 1.2, out_mode: "out" }
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
        modes: { repulse: { distance: 80 }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    });
  }

  // Contact form (demo)
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const data = new FormData(form);
      
      try {
        formStatus.textContent = 'Sending...';
        formStatus.style.color = 'inherit';
        const response = await fetch(form.action, {
          method: form.method,
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formStatus.textContent = "Thanks for your message!";
          formStatus.style.color = 'var(--accent2)';
          form.reset();
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        formStatus.textContent = "Oops! There was a problem submitting your form.";
        formStatus.style.color = 'red';
      }
    });
  }

  // "See More" projects button
  const seeMoreBtn = document.getElementById('seeMoreBtn');
  if (seeMoreBtn) {
    seeMoreBtn.addEventListener('click', function() {
      const hiddenProjects = document.querySelectorAll('.extra-project');
      const isShowingMore = this.textContent.includes('More');

      if (isShowingMore) {
        // Show the projects
        hiddenProjects.forEach(project => {
          // Clear GSAP's inline styles before showing
          gsap.set(project, { clearProps: "all" });
          project.classList.remove('d-none');
        });

        // Animate them in
        gsap.fromTo(hiddenProjects, 
          { y: 50, opacity: 0 }, 
          { y: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: 'power2.out' });

        this.textContent = 'See Less';
      } else {
        // Animate projects out
        gsap.to(hiddenProjects, {
          y: 50, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power2.in',
          onComplete: () => {
            hiddenProjects.forEach(project => {
              project.classList.add('d-none');
            });
            // Scroll user to the top of the projects section for better UX
            lenis.scrollTo('#projects', { offset: -80, duration: 1.5 });
          }
        });
        this.textContent = 'See More';
      }
    });
  }

  // "See More" skills button
  const seeMoreSkillsBtn = document.getElementById('seeMoreSkillsBtn');
  if (seeMoreSkillsBtn) {
    seeMoreSkillsBtn.addEventListener('click', function() {
      const hiddenSkills = document.querySelectorAll('.extra-skill');
      const isShowingMore = this.textContent.includes('More');

      if (isShowingMore) {
        // Show the skills
        hiddenSkills.forEach(skill => {
          // Clear GSAP's inline styles before showing
          gsap.set(skill, { clearProps: "all" });
          skill.classList.remove('d-none');
        });

        // Animate them in
        gsap.fromTo(hiddenSkills, 
          { y: 50, opacity: 0 }, 
          { y: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: 'power2.out' });

        this.textContent = 'See Less';
      } else {
        // Animate skills out
        gsap.to(hiddenSkills, {
          y: 50, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power2.in',
          onComplete: () => {
            hiddenSkills.forEach(skill => {
              skill.classList.add('d-none');
            });
            lenis.scrollTo('#skills', { offset: -80, duration: 1.5 });
          }
        });
        this.textContent = 'See More';
      }
    });
  }

  // Smooth anchor links via Lenis
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      const el = document.querySelector(href);
      if (!el) return;
      lenis.scrollTo(el, { offset: -72, duration: 1.0 });
    });
  });

  // Active nav link on scroll
  const sections = gsap.utils.toArray('section[id]');
  const navLinks = gsap.utils.toArray('.navbar-nav .nav-link');

  sections.forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onToggle: self => {
        if (self.isActive) {
          const id = section.getAttribute('id');
          navLinks.forEach(link => link.classList.remove('active'));
          const activeLink = $(`.navbar-nav .nav-link[href="#${id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      }
    });
  });
})();
// Mousemove 3D tilt for logo
const logo = document.getElementById('logo3d');
if (logo) {
  document.addEventListener('mousemove', e => {
    const x = (window.innerWidth / 2 - e.clientX) / 40;
    const y = (window.innerHeight / 2 - e.clientY) / 40;
    logo.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  });
}