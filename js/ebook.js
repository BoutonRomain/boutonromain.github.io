/**
 * E-Book Navigation – Portfolio PPP
 */
(function () {
  'use strict';

  // ── Page registry ────────────────────────────────────────────────
  const pages = [
    'cover',
    'about',
    'parcours',
    'projets',
    'competences',
    'conclusion'
  ];

  let currentIndex = 0;

  // ── DOM helpers ──────────────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  function getPageEl(id) {
    return document.getElementById('page-' + id);
  }

  // ── Navigation ───────────────────────────────────────────────────
  function showPage(idOrIndex) {
    let index;
    if (typeof idOrIndex === 'number') {
      index = idOrIndex;
    } else {
      index = pages.indexOf(idOrIndex);
    }
    if (index < 0 || index >= pages.length) return;

    // Hide all
    pages.forEach((id) => {
      const el = getPageEl(id);
      if (el) el.classList.remove('active');
    });

    // Show target
    currentIndex = index;
    const target = getPageEl(pages[index]);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateToc();
    updateProgress();
    updateNavButtons();

    // Close mobile sidebar
    $('#sidebar').classList.remove('open');

    // Update URL hash without reloading
    history.replaceState(null, '', '#' + pages[index]);
  }

  function next() { showPage(currentIndex + 1); }
  function prev() { showPage(currentIndex - 1); }

  // ── TOC Highlighting ─────────────────────────────────────────────
  function updateToc() {
    $$('#toc a').forEach((a) => {
      a.classList.toggle('active', a.dataset.page === pages[currentIndex]);
    });
  }

  // ── Progress Bar ─────────────────────────────────────────────────
  function updateProgress() {
    const pct = pages.length <= 1 ? 100 : Math.round((currentIndex / (pages.length - 1)) * 100);
    const fill = $('#reading-progress-fill');
    const label = $('#reading-progress-label');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = pct + '% lu';
  }

  // ── Prev / Next buttons ──────────────────────────────────────────
  function updateNavButtons() {
    $$('.btn-prev').forEach((btn) => {
      btn.style.visibility = currentIndex > 0 ? 'visible' : 'hidden';
    });
    $$('.btn-next').forEach((btn) => {
      btn.style.visibility = currentIndex < pages.length - 1 ? 'visible' : 'hidden';
    });
    $$('.page-nav-info').forEach((el) => {
      el.textContent = 'Page ' + (currentIndex + 1) + ' / ' + pages.length;
    });
  }

  // ── Event Listeners ──────────────────────────────────────────────
  function bindEvents() {
    // TOC links
    $$('#toc a[data-page]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(a.dataset.page);
      });
    });

    // All nav buttons (prev/next, start button, etc.)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-page]');
      if (btn && !btn.matches('#toc a')) {
        e.preventDefault();
        const val = btn.dataset.page;
        const asNum = parseInt(val, 10);
        if (!isNaN(asNum)) {
          showPage(asNum);
        } else {
          showPage(val);
        }
      }
    });

    // Mobile menu toggle
    const toggle = $('#menu-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        $('#sidebar').classList.toggle('open');
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
    });
  }

  // ── Init ─────────────────────────────────────────────────────────
  function init() {
    bindEvents();

    // Honor URL hash on load
    const hash = window.location.hash.replace('#', '');
    if (hash && pages.includes(hash)) {
      showPage(hash);
    } else {
      showPage(0);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
