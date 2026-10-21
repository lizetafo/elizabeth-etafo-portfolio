(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Light / dark switch (remembers the choice on this device)
  var btn = document.querySelector('.theme');
  function setTheme(t, save) {
    root.dataset.theme = t;
    if (btn) {
      btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    if (save) { try { localStorage.setItem('theme', t); } catch (e) {} }
    document.dispatchEvent(new Event('themechange'));
  }
  setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light', false);
  if (btn) btn.addEventListener('click', function () {
    root.classList.add('theming');
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
    setTimeout(function () { root.classList.remove('theming'); }, 450);
  });
  if (window.matchMedia) {
    var mq = matchMedia('(prefers-color-scheme: dark)');
    var follow = function (e) {
      var saved = null; try { saved = localStorage.getItem('theme'); } catch (x) {}
      if (!saved) setTheme(e.matches ? 'dark' : 'light', false);
    };
    if (mq.addEventListener) mq.addEventListener('change', follow);
  }

  // ---- About photos: use each caption as the photo's description for screen readers
  document.querySelectorAll('.photos figure').forEach(function (fg) {
    var cap = fg.querySelector('figcaption'), im = fg.querySelector('img');
    if (cap && im && cap.textContent.trim()) im.alt = cap.textContent.trim();
  });

  // ---- Reading progress bar
  if (!reduce) {
    var bar = document.createElement('div'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var tick = false;
    var upd = function () {
      var h = root.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')'; tick = false;
    };
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  // ---- Hide "Download CV" if no CV file has been uploaded yet (live site only)
  if (location.protocol.indexOf('http') === 0) {
    document.querySelectorAll('[data-cv]').forEach(function (a) {
      fetch(a.getAttribute('href'), { method: 'HEAD' }).then(function (r) { if (!r.ok) a.hidden = true; })
        .catch(function () { a.hidden = true; });
    });
  }

  // ---- Count-up numbers
  function count(el) {
    var n = +el.dataset.count, t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / 900, 1);
      el.textContent = Math.round(n * p);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = 0; requestAnimationFrame(step);
  }

  // ---- Fade-in on scroll
  var els = document.querySelectorAll('.stats li,.tl-item,.grid article,.card,.skills > div,.edsplit > *,.contact li,.awards article,.photos figure');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in'); io.unobserve(e.target);
        e.target.querySelectorAll('[data-count]').forEach(count);
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) {
      el.classList.add('reveal');
      el.style.transitionDelay = (Array.prototype.indexOf.call(el.parentNode.children, el) % 4) * 70 + 'ms';
      io.observe(el);
    });
  }

  // ---- Contact form (shown only after a real Formspree ID is added in contact.html)
  var f = document.getElementById('msgform');
  if (f) {
    if (f.action.indexOf('YOUR_FORM_ID') === -1) document.getElementById('message').hidden = false;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var s = f.querySelector('.status'), b = f.querySelector('button');
      b.disabled = true; s.textContent = 'Sending…';
      fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) { f.reset(); s.textContent = 'Thank you. Your message was sent.'; }
          else s.textContent = 'Something went wrong. Please message me on LinkedIn instead.';
        })
        .catch(function () { s.textContent = 'Something went wrong. Please message me on LinkedIn instead.'; })
        .then(function () { b.disabled = false; });
    });
  }
})();
