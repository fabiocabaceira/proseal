/* ProSeal Construction, all four pages. No dependencies.
   Scroll work is kept small on purpose: bar state, the hero window and the site tape (only while it is on screen).
   The transition between pages is CSS (view transitions, end of site.css). */
(() => {
  const d = document, root = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const store = box => ({ get: k => { try { return box().getItem(k); } catch { return null; } }, set: (k, v) => { try { box().setItem(k, v); } catch {} } });
  const local = store(() => localStorage), session = store(() => sessionStorage);
  const track = (event, data = {}) => { (window.dataLayer = window.dataLayer || []).push({ event, ...data }); };
  const clamp = v => Math.min(1, Math.max(0, v));
  const desktop = window.matchMedia('(min-width:900px)');
  const home = d.body.classList.contains('home');

  /* calm switch */
  const calmBox = $('#calm');
  const isCalm = () => root.classList.contains('calm');
  /* the reduce motion switch left the footer on 19/11; a choice saved before then is forgotten */
  local.set('calm', '0');
  if (calmBox) calmBox.addEventListener('change', () => { root.classList.toggle('calm', calmBox.checked); local.set('calm', calmBox.checked ? '1' : '0'); });

  /* opening, landing only and once per visit: the logo is laid over the photograph, then flies to its place in the bar */
  const seal = $('#seal'), logoBox = $('#logoBox'), dock = $('#dock');
  const E = 'cubic-bezier(.16,1,.3,1)';
  const finish = () => { root.classList.remove('opening'); root.classList.add('titled'); dock.classList.add('show'); };
  const NS = 'http://www.w3.org/2000/svg';
  const wait = ms => new Promise(r => setTimeout(r, ms));
  function spark(host, x, y, k) {
    const a = Math.random() * Math.PI * 2, r = (8 + Math.random() * 22) * k, l = document.createElementNS(NS, 'line');
    l.setAttribute('class', 'spk'); l.setAttribute('x1', x); l.setAttribute('y1', y);
    l.setAttribute('x2', x + Math.cos(a) * 3 * k); l.setAttribute('y2', y + Math.sin(a) * 3 * k);
    host.append(l);
    l.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${Math.cos(a) * r}px,${Math.sin(a) * r + 14 * k}px)`, opacity: 0 }],
      { duration: 320 + Math.random() * 380, easing: 'cubic-bezier(.2,.6,.4,1)' }).onfinish = () => l.remove();
  }
  async function opening() {
    const weld = seal && $('.weld', seal);
    /* plays every time the home page loads: arrival, every refresh, coming back from another page */
    if (!seal || !weld || isCalm() || !weld.animate) return finish();
    const target = location.hash;
    history.scrollRestoration = 'manual';
    root.classList.add('opening');
    window.scrollTo(0, 0);
    try {
      /* the plate edge and every stroke of every letter are welded at the same time, each with its own torch:
         behind the torch the bead is left, so the letters are built as it goes */
      const k = weld.viewBox.baseVal.width / weld.getBoundingClientRect().width;
      weld.style.setProperty('--k', k);
      const beads = $$('.bead', weld), hots = $$('.hot', weld);
      const lens = beads.map(p => p.getTotalLength());
      const heads = beads.map(p => { const h = document.createElementNS(NS, 'circle'); h.setAttribute('class', 'hd'); h.setAttribute('r', 2.6 * k); const p0 = p.getPointAtLength(0); h.setAttribute('cx', p0.x); h.setAttribute('cy', p0.y); p.parentNode.append(h); return h; });
      const D = 1500, t0 = performance.now() + 150;
      await new Promise(done => {
        const f = now => {
          const raw = Math.max(0, Math.min(1, (now - t0) / D)), p = raw < .5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
          if (now >= t0) beads.forEach((s, i) => {
            s.style.strokeDashoffset = 1 - p;
            hots[i].style.strokeDashoffset = .045 - p;
            const pt = s.getPointAtLength(p * lens[i]);
            heads[i].setAttribute('cx', pt.x); heads[i].setAttribute('cy', pt.y);
            if (raw < 1 && Math.random() < .3) spark(s.parentNode, pt.x, pt.y, k);
          });
          if (raw < 1) requestAnimationFrame(f); else done();
        };
        requestAnimationFrame(f);
      });
      heads.forEach(h => h.remove());
      /* the seams cool from orange to steel, then the plate is simply there */
      seal.classList.add('cool');
      await wait(650);
      const a = weld.getBoundingClientRect(), b = logoBox.getBoundingClientRect();
      const s = b.width / a.width;
      const dx = (b.left + b.width / 2) - (a.left + a.width / 2), dy = (b.top + b.height / 2) - (a.top + a.height / 2);
      root.classList.add('seal-out', 'scaf-go', 'titled');
      await weld.animate([{ transform: 'none' }, { transform: `translate(${dx}px,${dy}px) scale(${s})` }], { duration: 850, easing: 'cubic-bezier(.6,0,.15,1)', fill: 'forwards' }).finished;
    } catch {}
    finish();
    if (target) { const el = d.getElementById(target.slice(1)); if (el) el.scrollIntoView(); }
  }
  opening();
  /* back/forward from the page cache: play it again too */
  window.addEventListener('pageshow', e => { if (e.persisted && seal) location.reload(); });
  window.addEventListener('load', () => root.classList.add('smooth'));

  /* where we are, in the bar */
  const here = location.pathname.split('/').pop() || 'index.html';
  $$('.nav a, .menu nav a').forEach(a => { if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page'); });

  /* three site tapes behind the stack: each one unrolls with the scroll, one after the other, eased so it glides */
  const works = home && $('.works');
  let tape = null;
  if (works) {
    const bands = $$('.tapes i', works);
    tape = { cur: 0, to: 0, raf: 0, seen: false };
    const paint = () => bands.forEach((el, k) => {
      const p = clamp((tape.cur - k * 0.2) / 0.6), cut = ((1 - p) * 100).toFixed(2) + '%';
      el.style.clipPath = k % 2 ? `inset(-20px 0 -20px ${cut})` : `inset(-20px ${cut} -20px 0)`;
    });
    const glide = () => {
      tape.raf = 0;
      tape.cur += (tape.to - tape.cur) * 0.034;
      if (Math.abs(tape.to - tape.cur) < 0.0006) tape.cur = tape.to; else tape.raf = requestAnimationFrame(glide);
      paint();
    };
    tape.aim = v => { if (isCalm()) return; tape.to = v; if (!tape.raf && tape.cur !== v) tape.raf = requestAnimationFrame(glide); };
    new IntersectionObserver(es => es.forEach(e => { tape.seen = e.isIntersecting; works.classList.toggle('seen', tape.seen); }), { threshold: 0 }).observe(works);
  }

  /* hero (Scroll Expansion Hero, 21st.dev): progress through the tall section, written to CSS as --p and --e */
  const xh = home && $('#top.xh');
  let xhP = -1;
  const xhPaint = vh => {
    const r = xh.getBoundingClientRect(), run = r.height - vh;
    const p = run > 0 && !isCalm() ? clamp(-r.top / run) : 0;
    if (Math.abs(p - xhP) < 0.0005) return;
    xhP = p;
    xh.style.setProperty('--p', p.toFixed(4));
    xh.style.setProperty('--e', (p * p * (3 - 2 * p)).toFixed(4));
    xh.classList.toggle('run', p > 0.12);
    xh.classList.toggle('done', p > 0.94);
  };

  /* scroll: bar, hero and tape. Nothing else listens to the scroll. */
  const bar = $('#bar');
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = window.scrollY, vh = window.innerHeight;
    if (xh) xhPaint(vh);
    if (home) bar.classList.toggle('solid', y > (xh ? xh.offsetHeight : Math.min(vh * .92, 900)) - 90);
    if (tape && (tape.seen || isCalm())) {
      const r = works.getBoundingClientRect();
      tape.aim(clamp((vh * 0.9 - r.top) / (r.height * 0.7 + vh * 0.15)));
    }
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* things that enter once, when seen */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0 });
  $$('.draw, .what').forEach(el => io.observe(el));
  /* development renders: one picture at a time, chosen from the index; it moves on by itself while on screen */
  const devShow = $('#devShow');
  if (devShow) {
    const pics = $$('.dev-pic img', devShow), btns = $$('.dev-index button', devShow);
    let k = 0, timer = 0, seen = false;
    const show = i => {
      k = i; devShow.dataset.on = i;
      pics.forEach((p, n) => p.classList.toggle('is-on', n === i));
      btns.forEach((b, n) => { b.classList.toggle('is-on', n === i); b.setAttribute('aria-pressed', n === i); });
      const run = btns[i]; if (run) { run.classList.remove('is-on'); void run.offsetWidth; run.classList.add('is-on'); }
    };
    const stop = () => { clearInterval(timer); timer = 0; devShow.classList.remove('auto'); };
    const go = () => { if (timer || isCalm() || !seen) return; devShow.classList.add('auto'); show(k); timer = setInterval(() => show((k + 1) % pics.length), 6000); };
    btns.forEach((b, i) => b.addEventListener('click', () => { stop(); show(i); }));
    devShow.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') stop(); });
    devShow.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') go(); });
    new IntersectionObserver(es => es.forEach(e => { seen = e.isIntersecting; if (seen) go(); else stop(); }), { threshold: 0.3 }).observe(devShow);
  }

  /* hero film: the time-lapse starts when the title appears, plays once and rests on the last frame (the finished houses);
     with the calm switch on it simply shows the finished houses */
  /* films: the right size for the screen, and none at all on save-data or a slow network (the poster stays) */
  const wide = matchMedia('(min-width:900px), (orientation: landscape)').matches, lite = () => root.classList.contains('lite');
  const arm = v => {
    if (!v) return false;
    if (wide && v.dataset.posterWide) v.poster = v.dataset.posterWide;
    if (lite()) return false;
    if (!v.src) { v.src = (wide && v.dataset.srcWide) || v.dataset.src; v.preload = 'auto'; }
    return true;
  };
  const heroFilm = $('#heroFilm');
  if (heroFilm && !arm(heroFilm)) heroFilm.dataset.off = '1';
  if (heroFilm) {
    let started = false;
    const toEnd = () => { const d = heroFilm.duration; if (d) heroFilm.currentTime = Math.max(0, d - .05); };
    const start = () => {
      if (started) return; started = true;
      if (isCalm()) { if (heroFilm.readyState >= 1) toEnd(); else heroFilm.addEventListener('loadedmetadata', toEnd, { once: true }); return; }
      if (heroFilm.dataset.off) return; const p = heroFilm.play();
      /* if the phone refused to start it, the first touch or scroll starts it */
      if (p) p.catch(() => { const again = () => { heroFilm.play().catch(() => {}); }; ['touchstart', 'scroll', 'pointerdown'].forEach(t => addEventListener(t, again, { once: true, passive: true })); });
    };
    if (root.classList.contains('titled')) start();
    else new MutationObserver((m, o) => { if (root.classList.contains('titled')) { o.disconnect(); start(); } }).observe(root, { attributes: true, attributeFilter: ['class'] });
  }

  /* the development film plays only while it is on screen, and never with the calm switch on */
  const devFilm = $('#devFilm');
  if (devFilm) {
    if (wide && devFilm.dataset.posterWide) devFilm.poster = devFilm.dataset.posterWide;
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && !isCalm() && arm(devFilm)) { const p = devFilm.play(); if (p) p.catch(() => {}); } else devFilm.pause();
    }), { threshold: 0.2 }).observe(devFilm);
  }

  /* photographs open full screen: arrows, swipe and keys move through the page's photographs, Esc or the cross closes */
  const shots = $$('a.tile, a.rc:not([data-dup])');
  if (shots.length) {
    const box = document.createElement('div');
    box.className = 'pv'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Photograph');
    box.innerHTML = '<figure class="pv-fig"><img alt=""><figcaption class="pv-cap"><span class="pv-t"></span><span class="pv-n"></span></figcaption></figure>'
      + '<div class="pv-thumbs"></div>'
      + '<button type="button" class="pv-x" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>'
      + '<button type="button" class="pv-p" aria-label="Previous photograph">' + '<svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>'
      + '<button type="button" class="pv-nx" aria-label="Next photograph"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>';
    document.body.append(box);
    const img = $('img', box), t = $('.pv-t', box), n = $('.pv-n', box), strip = $('.pv-thumbs', box);
    shots.forEach((a, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Photograph ' + (i + 1)); b.innerHTML = '<img alt="" loading="lazy" src="' + ($('img', a).dataset.thumb || $('img', a).getAttribute('src')) + '">'; b.addEventListener('click', () => show(i)); strip.append(b); });
    let at = 0, last = null;
    const show = i => {
      at = (i + shots.length) % shots.length; const a = shots[at], src = $('img', a);
      img.classList.remove('in'); img.src = a.getAttribute('href'); img.alt = src ? src.alt : '';
      img.onload = () => img.classList.add('in');
      [...strip.children].forEach((b, i) => b.classList.toggle('on', i === at)); const cur = strip.children[at]; if (cur) cur.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      t.textContent = a.dataset.cap || ''; n.textContent = String(at + 1).padStart(2, '0') + ' / ' + String(shots.length).padStart(2, '0');
    };
    const open = i => { last = document.activeElement; show(i); box.classList.add('on'); d.body.style.overflow = 'hidden'; $('.pv-x', box).focus(); };
    const close = () => { box.classList.remove('on'); d.body.style.overflow = ''; if (last) last.focus(); };
    shots.forEach((a, i) => a.addEventListener('click', e => { e.preventDefault(); if (!a.closest('.ring') || a.classList.contains('front')) open(i); }));
    $$('a.rc[data-dup]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); if (!a.classList.contains('front')) return; const i = shots.findIndex(s => s.getAttribute('href') === a.getAttribute('href')); if (i > -1) open(i); }));
    $('.pv-x', box).addEventListener('click', close);
    $('.pv-p', box).addEventListener('click', () => show(at - 1));
    $('.pv-nx', box).addEventListener('click', () => show(at + 1));
    box.addEventListener('click', e => { if (e.target === box) close(); });
    addEventListener('keydown', e => { if (!box.classList.contains('on')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(at + 1); if (e.key === 'ArrowLeft') show(at - 1); });
    let x0 = null;
    box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1)); x0 = null; });
  }

  /* rings: the photographs stand on a turning cylinder, the sides fall back into depth; drag, swipe, arrows or keys turn it */
  $$('.ring').forEach(ringEl => {
    const stage = $('.ring-stage', ringEl), faces = $$('.rc', stage), N = faces.length, real = +ringEl.dataset.n;
    const sec = ringEl.closest('.kind'), count = sec && $('.ring-c b', sec);
    const step = 360 / N;
    let ang = 0, aim = 0, raf = 0, R = 0;
    const size = () => { const w = faces[0].offsetWidth || 240; R = Math.round(w / 2 / Math.tan(Math.PI / N) * 1.08); stage.style.setProperty('--r', R + 'px'); paint(); };
    const paint = () => {
      stage.style.transform = `translateZ(${-R}px) rotateY(${ang}deg)`;
      const front = ((Math.round(-ang / step) % N) + N) % N;
      faces.forEach((f, i) => {
        let d = ((i * step + ang) % 360 + 540) % 360 - 180; const a = Math.abs(d);
        f.style.opacity = a > 115 ? 0 : (1 - Math.max(0, a - 40) / 90).toFixed(3);
        f.style.filter = a < 8 ? '' : `brightness(${(1 - Math.min(a, 110) / 260).toFixed(3)})`;
        f.style.pointerEvents = a > 70 ? 'none' : '';
        f.classList.toggle('front', i === front);
      });
      if (count) count.textContent = String(front % real + 1).padStart(2, '0');
    };
    const run = () => { ang += (aim - ang) * 0.12; if (Math.abs(aim - ang) < 0.02) { ang = aim; raf = 0; paint(); return; } paint(); raf = requestAnimationFrame(run); };
    const go = v => { aim = v; if (isCalm()) { ang = aim; paint(); return; } if (!raf) raf = requestAnimationFrame(run); };
    const snap = () => go(Math.round(aim / step) * step);
    faces.forEach((f, i) => f.style.transform = `rotateY(${i * step}deg) translateZ(var(--r))`);
    let x0 = null, a0 = 0, moved = 0, v = 0, lx = 0, lt = 0;
    ringEl.addEventListener('pointerdown', e => { x0 = e.clientX; a0 = aim; moved = 0; lx = e.clientX; lt = performance.now(); v = 0; });
    addEventListener('pointermove', e => {
      if (x0 === null) return; const dx = e.clientX - x0; moved = Math.max(moved, Math.abs(dx));
      const now = performance.now(); v = (e.clientX - lx) / Math.max(1, now - lt); lx = e.clientX; lt = now;
      go(a0 + dx * 0.35);
    });
    addEventListener('pointerup', () => { if (x0 === null) return; x0 = null; aim += v * 120; snap(); });
    ringEl.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
    faces.forEach((f, i) => f.addEventListener('click', e => { if (!f.classList.contains('front')) { e.preventDefault(); e.stopImmediatePropagation(); go(Math.round(aim / step) * step - (((i * step + aim) % 360 + 540) % 360 - 180)); } }, true));
    sec && $$('.ring-b', sec).forEach(b => b.addEventListener('click', () => go(Math.round(aim / step) * step - b.dataset.d * step)));
    ringEl.addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(Math.round(aim / step) * step - step); if (e.key === 'ArrowLeft') go(Math.round(aim / step) * step + step); });
    addEventListener('resize', size, { passive: true });
    size();
  });

  const tiles = $$('.tile');
  if (tiles.length && 'IntersectionObserver' in window) {
    const tio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); tio.unobserve(e.target); } }), { threshold: 0 });
    tiles.forEach(el => { el.classList.add('rise'); tio.observe(el); });
  }

  /* what we do: three panels; the one pressed (or pointed at with a mouse) opens wide */
  const panes = $$('#panes .pane');
  if (panes.length) {
    const open = k => panes.forEach((p, i) => { const on = i === k; p.classList.toggle('is-on', on); $('.pane-tab', p).setAttribute('aria-expanded', on); });
    panes.forEach((p, i) => {
      $('.pane-tab', p).addEventListener('click', () => open(i));
      p.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && matchMedia('(min-width:900px)').matches) open(i); });
    });
  }

  /* menu */
  const menu = $('#menu'), menuBtn = $('#menuBtn'), menuLabel = $('span', menuBtn) || menuBtn;
  const setMenu = open => {
    menuBtn.setAttribute('aria-expanded', open); menuLabel.textContent = open ? 'Close' : 'Menu';
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('open')); bar.classList.add('over-menu'); }
    else { menu.classList.remove('open'); bar.classList.remove('over-menu'); setTimeout(() => { if (!menu.classList.contains('open')) menu.hidden = true; }, 360); }
    d.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  d.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });

  /* the stack of photographs: one in front, the rest fanned behind it. Pointing at one lifts it and it goes back when the pointer leaves;
     pressing one behind, the arrows, the keys or a swipe bring another to the front. */
  const fan = $('#fan');
  let fanFront = () => null;
  if (fan) {
    const cards = $$('.fan-card', fan), n = cards.length, num = $('.fan-count'), stage = $('.fan-stage', fan);
    let cur = 0;
    const place = () => {
      const w = cards[0].offsetWidth, step = w * (desktop.matches ? .5 : .3);
      cards.forEach((c, k) => {
        let rel = k - cur; if (rel > n / 2) rel -= n; if (rel < -n / 2) rel += n;
        const a = Math.abs(rel), st = c.style;
        st.setProperty('--x', (rel * step * (1 - a * .07)).toFixed(1) + 'px');
        st.setProperty('--y', (a * 12) + 'px');
        st.setProperty('--r', (rel * 4.5) + 'deg');
        st.setProperty('--s', (1 - a * .1).toFixed(3));
        st.setProperty('--z', 20 - a * 2 - (rel < 0 ? 1 : 0));
        st.setProperty('--o', a > 2.5 ? 0 : 1);
        st.setProperty('--dim', Math.min(1, a * .5));
        c.classList.toggle('front', rel === 0);
        c.style.pointerEvents = a > 2.5 ? 'none' : '';
      });
      if (num) num.textContent = `${cur + 1} / ${n}`;
    };
    const go = i => { cur = (i + n) % n; cards.forEach(c => c.classList.remove('up')); place(); };
    fanFront = () => cards[cur];
    cards.forEach((c, k) => {
      c.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && k !== cur) c.classList.add('up'); });
      c.addEventListener('pointerleave', () => c.classList.remove('up'));
    });
    $('.fan-prev').addEventListener('click', () => go(cur - 1));
    $('.fan-next').addEventListener('click', () => go(cur + 1));
    fan.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); } });
    let x0 = null;
    stage.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 36) go(cur + (dx < 0 ? 1 : -1)); }, { passive: true });
    fan.bring = c => go(cards.indexOf(c));
    window.addEventListener('resize', place);
    place();
  }

  /* the photograph, large, without leaving the page */
  const lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  if (lb && lb.showModal) {
    $$('a.card').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      const li = a.closest('.fan-card');
      if (li && fanFront() !== li) { fan.bring(li); return; }
      const b = $('b', a), t = $('.card-l', a);
      lbImg.src = a.href; lbImg.alt = $('img', a).alt;
      lbCap.textContent = b.textContent + '. ' + t.textContent;
      lb.showModal(); track('photo_open', { photo: a.getAttribute('href') });
    }));
    $('#lbClose').addEventListener('click', () => lb.close());
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  }

  /* how we work: one step open at a time; it moves on by itself until someone chooses */
  const how = $('.how'), stepList = $('#steplist');
  if (how && stepList) {
    const items = $$('li', stepList), figs = $$('.stage .fig', how);
    let on = 0;
    const setStep = (i, byHand) => {
      on = i;
      items.forEach((li, k) => { li.classList.toggle('is-on', k === i); $('button', li).setAttribute('aria-expanded', k === i); });
      figs.forEach((f, k) => f.classList.toggle('is-on', k === i));
      if (byHand) how.classList.add('manual');
    };
    items.forEach((li, k) => $('button', li).addEventListener('click', () => { setStep(k, true); track('step_open', { step: k + 1 }); }));
    stepList.addEventListener('animationend', e => { if (e.animationName === 'fill' && !how.classList.contains('manual')) setStep((on + 1) % items.length); });
    new IntersectionObserver(es => es.forEach(e => how.classList.toggle('in', e.isIntersecting)), { threshold: 0.25 }).observe(how);
  }

  /* map and list light each other; the places take turns until someone points at one */
  const mapEl = $('#map');
  if (mapEl) {
    const places = $$('#places li[data-p]'), pts = $$('.pt[data-p]', mapEl);
    const light = id => { places.forEach(l => l.classList.toggle('on', l.dataset.p === id)); pts.forEach(p => p.classList.toggle('on', p.dataset.p === id)); };
    let tour = null, turn = 0, touched = false;
    const stopTour = () => { clearInterval(tour); tour = null; };
    [...places, ...pts].forEach(el => {
      el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { touched = true; stopTour(); light(el.dataset.p); } });
      el.addEventListener('click', () => { touched = true; stopTour(); light(el.dataset.p); });
    });
    new IntersectionObserver(es => es.forEach(e => {
      stopTour();
      if (e.isIntersecting && !touched && !isCalm()) tour = setInterval(() => light(places[turn++ % places.length].dataset.p), 1900);
    }), { threshold: 0.4 }).observe(mapEl);
  }

  /* lead source: the last contact button pressed travels with the visitor to the form, across pages */
  const params = new URLSearchParams(location.search);
  const utm = params.get('utm_source') || session.get('utm');
  if (utm) session.set('utm', utm);
  $$('[data-cta]').forEach(a => a.addEventListener('click', () => {
    const id = a.dataset.cta; track('cta_click', { cta: id });
    if (id !== 'form-send') session.set('cta', id);
  }));

  /* quote form in three steps */
  const form = $('#quoteForm');
  if (form) {
    const source = $('#leadSource'), steps = $$('.step', form), back = $('#stepBack'), next = $('#stepNext'), send = $('#stepSend'), count = $('#stepCount'), done = $('#formDone');
    source.value = [utm && 'utm:' + utm, session.get('cta')].filter(Boolean).join(' / ') || 'direct';
    let cur = 0;
    const show = i => {
      cur = i; steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
      back.hidden = i === 0; next.hidden = i === steps.length - 1; send.hidden = i !== steps.length - 1;
      count.textContent = `${i + 1} / ${steps.length}`;
      form.dataset.step = i;
    };
    const valid = i => {
      let ok = true;
      $$('input[required]', steps[i]).forEach(f => {
        const good = f.type === 'radio' ? !!$(`input[name="${f.name}"]:checked`, form) : f.value.trim().length > 1;
        f.classList.toggle('bad', !good); if (!good) { if (ok && f.type !== 'radio') f.focus(); ok = false; }
      });
      return ok;
    };
    show(0);
    const job = params.get('job');
    if (job) { const r = $$('input[name="job"]', form).find(x => x.value === job); if (r) { r.checked = true; show(1); } }
    next.addEventListener('click', () => { if (valid(cur)) { show(cur + 1); const f = $('input,textarea', steps[cur]); if (f) f.focus({ preventScroll: true }); } });
    back.addEventListener('click', () => show(cur - 1));
    $$('input[name="job"]', form).forEach(r => r.addEventListener('change', () => setTimeout(() => { if (cur === 0) next.click(); }, 280)));
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!valid(cur)) return;
      const v = Object.fromEntries(new FormData(form));
      track('lead', { source: v.source, job: v.job });
      const body = `Job: ${v.job}\nLocation: ${v.place || ''}\nDetails: ${v.details || ''}\n\nName: ${v.name}\nPhone: ${v.phone}\nEmail: ${v.email || ''}\n\nSource: ${v.source}`;
      done.hidden = false; done.focus();
      location.href = `mailto:info@prosealconstruction.com?subject=${encodeURIComponent('Quote request: ' + v.job)}&body=${encodeURIComponent(body)}`;
    });
    /* on the form page the capsule would repeat the page it is on */
    if (!home) dock.style.display = 'none';
  }
})();

/* 19/11: reels carousel (the Pantiera component). The front reel plays muted when the section is in view; one tap on the
   speaker turns the sound on inside the tap (iOS only allows it there). Arrows, keys, drag, swipe and the trackpad's sideways
   gesture move one reel at a time. Only the front reel and its two neighbours load. */
(() => {
  const root = document.querySelector('[data-reels]'); if (!root) return;
  const stage = root.querySelector('[data-reels-palco]'), num = root.querySelector('[data-reels-num]');
  const real = JSON.parse(document.getElementById('reels-dados').textContent), R = real.length;
  const data = R < 6 ? real.concat(real) : real, N = data.length; // repeated so both sides always have a neighbour
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const snd = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path class="on" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/><path class="off" d="m16 9.5 5 5m0-5-5 5"/></svg>';
  let cur = 0, inView = false, soundOn = false;
  const cards = data.map((r, i) => {
    const li = document.createElement('li');
    li.className = 'reels-cartao';
    li.innerHTML = `<video muted playsinline preload="none" poster="img/reels/${r.id}.webp" data-src="img/reels/${r.id}.mp4" width="540" height="960" aria-label="Reel: ${r.t.replace(/"/g, '&quot;')}"></video><button type="button" class="reels-som" aria-pressed="false" aria-label="Turn sound on">${snd}</button>`;
    li.addEventListener('click', e => { if (cur !== i && !e.target.closest('.reels-som')) go(i); });
    li.querySelector('video').addEventListener('ended', () => { if (cur === i) go(i + 1); });
    stage.append(li);
    return li;
  });
  const btn = li => { const v = li.querySelector('video'), b = li.querySelector('.reels-som'), on = !v.muted && !v.paused; b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', on ? 'Mute' : 'Turn sound on'); };
  cards.forEach(li => { const v = li.querySelector('video'); ['volumechange', 'play', 'pause'].forEach(t => v.addEventListener(t, () => btn(li))); });
  const paint = () => {
    const wide = innerWidth >= 900;
    cards.forEach((li, i) => {
      let d = i - cur; if (d > N / 2) d -= N; if (d < -N / 2) d += N; const a = Math.abs(d);
      const x = d * (wide ? 74 : 60), rot = a === 0 ? 1.5 : (d < 0 ? -2 : 2.5) * (a === 1 ? 1 : .6);
      li.style.transform = `translate3d(${x}%,0,0) scale(${Math.max(.7, 1 - a * .13)}) rotate(${rot}deg)`;
      li.style.zIndex = String(50 - a);
      li.style.opacity = a > 1 ? '0' : '1';
      li.style.pointerEvents = a > 1 ? 'none' : 'auto';
      li.classList.toggle('frente', a === 0);
      li.setAttribute('aria-hidden', a ? 'true' : 'false');
      li.querySelectorAll('button').forEach(el => el.tabIndex = a ? -1 : 0);
      const v = li.querySelector('video');
      if (a <= 1 && !v.getAttribute('src')) v.src = v.dataset.src;
      if (a <= 1 && inView) v.preload = a === 0 ? 'auto' : 'metadata';
      if (a === 0 && inView && !calm) { v.muted = !soundOn; v.play().catch(() => { soundOn = false; v.muted = true; v.play().catch(() => {}); }); }
      else if (a === 0 && inView && calm && soundOn) { v.muted = false; v.play().catch(() => {}); }
      else { v.pause(); v.muted = true; }
      btn(li);
    });
    num.textContent = `${String(cur % R + 1).padStart(2, '0')} / ${String(R).padStart(2, '0')}`;
    document.querySelectorAll('[data-reel-go]').forEach(b => b.toggleAttribute('aria-current', +b.dataset.reelGo === cur % R));
  };
  const go = i => { cur = (i + N) % N; paint(); };
  document.querySelectorAll('[data-reel-go]').forEach(b => b.addEventListener('click', () => go(+b.dataset.reelGo)));
  root.querySelector('[data-reels-ant]').addEventListener('click', () => go(cur - 1));
  root.querySelector('[data-reels-seg]').addEventListener('click', () => go(cur + 1));
  root.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') go(cur - 1); if (e.key === 'ArrowRight') go(cur + 1); });
  stage.addEventListener('click', e => {
    const b = e.target.closest('.reels-som'); if (!b) return;
    const v = b.closest('li').querySelector('video');
    soundOn = v.muted || v.paused;
    if (!v.getAttribute('src')) v.src = v.dataset.src;
    v.muted = !soundOn;
    if (soundOn) v.play().catch(() => { soundOn = false; v.muted = true; });
    paint();
  });
  let x0 = null;
  stage.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') x0 = e.clientX; }, { passive: true });
  addEventListener('pointerup', e => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); }, { passive: true });
  let locked = false, acc = 0, tAcc = 0;
  root.addEventListener('wheel', e => {
    if (e.ctrlKey) return;
    const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerWidth : 1, dx = e.deltaX * k, dy = e.deltaY * k;
    if (Math.abs(dx) <= Math.abs(dy) * 1.1) return;
    e.preventDefault();
    acc += dx;
    if (locked) acc = 0; else if (Math.abs(acc) > 28) { go(cur + (acc > 0 ? 1 : -1)); acc = 0; locked = true; }
    clearTimeout(tAcc); tAcc = setTimeout(() => { acc = 0; locked = false; }, 200);
  }, { passive: false });
  let t0 = null;
  root.addEventListener('touchstart', e => { const t = e.touches[0]; t0 = { x: t.clientX, y: t.clientY }; }, { passive: true });
  root.addEventListener('touchend', e => { if (!t0) return; const t = e.changedTouches[0], dx = t.clientX - t0.x, dy = t.clientY - t0.y; t0 = null; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) go(cur + (dx < 0 ? 1 : -1)); }, { passive: true });
  addEventListener('touchend', () => { if (!inView) return; const v = cards[cur].querySelector('video'); if (v.paused && !calm) { if (!v.getAttribute('src')) v.src = v.dataset.src; v.play().catch(() => {}); } }, { capture: true, passive: true });
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; paint(); }, { threshold: .3 }).observe(root);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cards[cur].querySelector('video').pause(); else paint(); });
  addEventListener('resize', paint);
  paint();
})();
