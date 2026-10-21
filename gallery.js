(function () {
  var GROUPS = ['Conferences and awards', 'Lab work', 'Past roles', 'More moments'];
  var root = document.getElementById('gallery');
  var dlg = document.getElementById('lightbox');
  var big = dlg.querySelector('img'), cap = dlg.querySelector('p');
  var by = {}; GROUPS.forEach(function (g) { by[g] = []; });
  (window.PHOTOS || []).forEach(function (p) { (by[p.group] || by['More moments']).push(p); });
  var total = 0;
  GROUPS.forEach(function (g) {
    if (!by[g].length) return;
    total += by[g].length;
    var sec = document.createElement('section'); sec.className = 'gsec';
    var h = document.createElement('h2'); h.textContent = g; sec.appendChild(h);
    var grid = document.createElement('div'); grid.className = 'ggrid'; sec.appendChild(grid);
    by[g].forEach(function (p) {
      var fig = document.createElement('figure');
      var b = document.createElement('button'); b.type = 'button';
      b.setAttribute('aria-label', 'Enlarge photo: ' + (p.caption || p.file));
      var im = document.createElement('img');
      im.loading = 'lazy'; im.src = 'assets/gallery/' + p.file; im.alt = p.caption || '';
      im.onerror = function () { fig.remove(); if (!grid.children.length) sec.remove(); };
      b.appendChild(im);
      b.onclick = function () { big.src = im.src; big.alt = im.alt; cap.textContent = p.caption || ''; dlg.showModal(); };
      fig.appendChild(b);
      if (p.caption) { var fc = document.createElement('figcaption'); fc.textContent = p.caption; fig.appendChild(fc); }
      grid.appendChild(fig);
    });
    root.appendChild(sec);
  });
  if (!total) root.innerHTML = '<p class="lead">Photos coming soon.</p>';
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.querySelector('.x').onclick = function () { dlg.close(); };
})();
