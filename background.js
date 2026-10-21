// Site-wide "science" background: drifting molecular network, benzene-style rings and a DNA helix.
// Drawn on one fixed canvas behind every page. Respects reduced-motion and pauses when the tab is hidden.
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cv = document.createElement('canvas');
  cv.id = 'bg'; cv.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(cv, document.body.firstChild);
  var ctx = cv.getContext('2d');
  if (!ctx) return;

  var W = 0, H = 0, dpr = 1, nodes = [], rings = [];
  var net = '15,92,82', amb = '208,138,46';
  var mouse = { x: -9999, y: -9999 };
  var t = 0, last = 0, running = false;

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function colors() {
    var s = getComputedStyle(document.documentElement);
    net = s.getPropertyValue('--net').trim() || net;
    amb = s.getPropertyValue('--net-amber').trim() || amb;
  }

  function build() {
    var small = W < 700;
    var n = Math.max(18, Math.min(62, Math.round(W * H / (small ? 17000 : 21000))));
    nodes = [];
    for (var i = 0; i < n; i++) {
      nodes.push({ x: rnd(0, W), y: rnd(0, H), vx: rnd(-.18, .18), vy: rnd(-.18, .18), r: rnd(1.4, 3.2), a: Math.random() < .08 });
    }
    rings = [];
    for (var j = 0; j < (small ? 3 : 6); j++) {
      rings.push({ x: rnd(0, W), y: rnd(0, H), s: rnd(22, 50), rot: rnd(0, 6.28), vr: rnd(-.0025, .0025), vx: rnd(-.1, .1), vy: rnd(-.1, .1), a: Math.random() < .3 });
    }
  }

  function resize() {
    var w = window.innerWidth, h = window.innerHeight, widthChanged = w !== W;
    W = w; H = h;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (widthChanged || !nodes.length) build();
    if (reduce) draw(0);
  }

  function ring(r) {
    ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(r.rot);
    var c = r.a ? amb : net, i, a, px, py;
    ctx.beginPath();
    for (i = 0; i < 6; i++) { a = i * Math.PI / 3; px = Math.cos(a) * r.s; py = Math.sin(a) * r.s; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
    ctx.closePath(); ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(' + c + ',.22)'; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r.s * .58, 0, 6.2832); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(' + c + ',.13)'; ctx.stroke();
    ctx.fillStyle = 'rgba(' + c + ',.4)';
    for (i = 0; i < 6; i++) { a = i * Math.PI / 3; ctx.beginPath(); ctx.arc(Math.cos(a) * r.s, Math.sin(a) * r.s, 2.4, 0, 6.2832); ctx.fill(); }
    ctx.restore();
  }

  function helix(cx, y0, h, amp, ph) {
    var step = 15, count = Math.floor(h / step), i, y, p, s, z, f, x1, x2, p1 = [], p2 = [];
    for (i = 0; i <= count; i++) {
      y = y0 + i * step; p = ph + i * .5; s = Math.sin(p); z = Math.cos(p);
      f = Math.sin(Math.PI * i / count);
      x1 = cx + amp * s; x2 = cx - amp * s;
      ctx.strokeStyle = 'rgba(' + net + ',' + (.16 * f).toFixed(3) + ')'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
      p1.push([x1, y, z, f]); p2.push([x2, y, -z, f]);
    }
    [[p1, net], [p2, amb]].forEach(function (pair) {
      var pts = pair[0], c = pair[1], k;
      ctx.beginPath();
      for (k = 0; k < pts.length; k++) { if (k) ctx.lineTo(pts[k][0], pts[k][1]); else ctx.moveTo(pts[k][0], pts[k][1]); }
      ctx.strokeStyle = 'rgba(' + c + ',.2)'; ctx.lineWidth = 1.4; ctx.stroke();
      for (k = 0; k < pts.length; k++) {
        ctx.fillStyle = 'rgba(' + c + ',' + (.42 * pts[k][3]).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(pts[k][0], pts[k][1], 2.4 + 1.3 * pts[k][2], 0, 6.2832); ctx.fill();
      }
    });
  }

  function draw(dt) {
    var k = Math.min(dt / 16.7, 3), i, j, n, m, dx, dy, d, L = W < 700 ? 105 : 145, L2 = L * L, M = 150;
    ctx.clearRect(0, 0, W, H);
    if (W >= 1208) helix(W - 52, H * .14, H * .7, 17, t * .0007);
    for (i = 0; i < rings.length; i++) {
      n = rings[i];
      if (dt) { n.x += n.vx * k; n.y += n.vy * k; n.rot += n.vr * k; if (n.x < -80) n.x = W + 80; if (n.x > W + 80) n.x = -80; if (n.y < -80) n.y = H + 80; if (n.y > H + 80) n.y = -80; }
      ring(n);
    }
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      if (dt) {
        dx = mouse.x - n.x; dy = mouse.y - n.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d < M && d > 1) { n.vx += dx / d * .004 * k; n.vy += dy / d * .004 * k; }
        n.vx *= .995; n.vy *= .995;
        if (Math.abs(n.vx) < .03) n.vx += (Math.random() - .5) * .01; if (Math.abs(n.vy) < .03) n.vy += (Math.random() - .5) * .01;
        n.x += n.vx * k; n.y += n.vy * k;
        if (n.x < -10) n.x = W + 10; if (n.x > W + 10) n.x = -10; if (n.y < -10) n.y = H + 10; if (n.y > H + 10) n.y = -10;
      }
    }
    ctx.lineWidth = 1;
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        m = nodes[j]; dx = n.x - m.x; dy = n.y - m.y;
        if (dx * dx + dy * dy < L2) {
          d = Math.sqrt(dx * dx + dy * dy);
          ctx.strokeStyle = 'rgba(' + net + ',' + ((1 - d / L) * .17).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
        }
      }
      dx = n.x - mouse.x; dy = n.y - mouse.y; d = Math.sqrt(dx * dx + dy * dy);
      if (d < M) { ctx.strokeStyle = 'rgba(' + amb + ',' + ((1 - d / M) * .35).toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
    }
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      ctx.fillStyle = 'rgba(' + (n.a ? amb : net) + ',' + (n.a ? .55 : .32) + ')';
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.2832); ctx.fill();
    }
  }

  function frame(ts) {
    if (!running) return;
    var dt = last ? ts - last : 16.7; last = ts; t += dt;
    draw(dt);
    requestAnimationFrame(frame);
  }
  function start() { if (reduce || running) return; running = true; last = 0; requestAnimationFrame(frame); }
  function stop() { running = false; }

  colors(); resize();
  var timer;
  window.addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(resize, 120); });
  window.addEventListener('pointermove', function (e) { if (e.pointerType !== 'touch') { mouse.x = e.clientX; mouse.y = e.clientY; } }, { passive: true });
  document.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  document.addEventListener('themechange', function () { colors(); if (reduce) draw(0); });
  if (reduce) draw(0); else start();
})();
