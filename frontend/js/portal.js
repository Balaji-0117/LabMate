/* ═══════════════════════════════════════════════════════════════
   portal.js  |  LabMate Student Portal
   Handles: theme, profile dropdown, notification panel,
            lab filter pills, sidebar active state,
            test tab switching, AI chat, stat counter animation
════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. THEME SWITCHER ─────────────────────────────────────────
  const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (toggleSwitch && savedTheme === 'dark') toggleSwitch.checked = true;
  }

  if (toggleSwitch) {
    toggleSwitch.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  }


  // ── 2. PROFILE DROPDOWN ───────────────────────────────────────
  const profileBtn = document.querySelector('.profile-btn');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (profileBtn && dropdownMenu) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownMenu.classList.toggle('active');
      profileBtn.setAttribute('aria-expanded', String(isOpen));
      // close notif panel if open
      notifPanel && notifPanel.classList.remove('active');
    });
  }


  // ── 3. NOTIFICATION PANEL ─────────────────────────────────────
  const notifBtn = document.getElementById('notif-btn');
  const notifPanel = document.getElementById('notif-panel');
  const notifClear = document.getElementById('notif-clear');

  if (notifBtn && notifPanel) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = notifPanel.classList.toggle('active');
      // close profile dropdown if open
      dropdownMenu && dropdownMenu.classList.remove('active');
      profileBtn && profileBtn.setAttribute('aria-expanded', 'false');
    });

    // Clear all: remove unread styling
    notifClear && notifClear.addEventListener('click', () => {
      document.querySelectorAll('.notif-unread').forEach(el => {
        el.classList.remove('notif-unread');
      });
      document.querySelectorAll('.notif-dot').forEach(el => {
        el.classList.add('notif-dot-read');
        el.classList.remove('notif-dot');
      });
      // hide badge
      const badge = document.querySelector('.notification-badge');
      if (badge) badge.style.display = 'none';
    });
  }

  // Close all dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (dropdownMenu && profileBtn && !profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove('active');
      profileBtn.setAttribute('aria-expanded', 'false');
    }
    if (notifPanel && notifBtn && !notifBtn.contains(e.target) && !notifPanel.contains(e.target)) {
      notifPanel.classList.remove('active');
    }
  });

  // ── 4. SIDEBAR ACCORDION SHUTTER ──────────────────────────────
  function setupAccordion(toggleId, contentId) {
    const toggleBtn = document.getElementById(toggleId);
    const contentBox = document.getElementById(contentId);
    
    if (toggleBtn && contentBox) {
      toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          toggleBtn.setAttribute('aria-expanded', 'false');
          contentBox.classList.add('shuttered');
        } else {
          toggleBtn.setAttribute('aria-expanded', 'true');
          contentBox.classList.remove('shuttered');
        }
      });
    }
  }

  setupAccordion('my-labs-toggle', 'my-labs-content');
  setupAccordion('lab-tests-toggle', 'lab-tests-content');
  setupAccordion('records-toggle', 'records-content');
  setupAccordion('notice-toggle', 'notice-content');
  setupAccordion('activity-toggle', 'activity-content');


  // ── 5. SIDEBAR TOGGLE & OVERLAY ──────────────────────────────
  const sidebarBtn = document.getElementById('sidebar-toggle-btn');
  const sidebar = document.querySelector('.portal-sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (sidebarBtn && sidebar && overlay) {
    const toggleSidebar = () => {
      const isActive = sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
      sidebarBtn.classList.toggle('active');
    };

    sidebarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });

    // Tap anywhere else to close
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      sidebarBtn.classList.remove('active');
    });

    // Also close on escape key
    document.body.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        sidebarBtn.classList.remove('active');
      }
    });
  }

  // ── 8. DASHBOARD STAT COUNTERS ────────────────────────────────
  // Count lab items and reflect in dashboard
  function updateStats() {
    const all = document.querySelectorAll('.lab-item').length;
    const completed = document.querySelectorAll('.status-completed').length;
    const pending = document.querySelectorAll('.status-pending').length;

    animateCount(document.getElementById('stat-total'), all);
    animateCount(document.getElementById('stat-done'), completed);
    animateCount(document.getElementById('stat-pending'), pending);

    // Score: placeholder based on completion ratio
    const score = all > 0 ? Math.round((completed / all) * 100) : 0;
    const scoreEl = document.getElementById('stat-score');
    if (scoreEl) {
      // animate to score%
      let cur = 0;
      const step = Math.ceil(score / 20);
      const iv = setInterval(() => {
        cur = Math.min(cur + step, score);
        scoreEl.textContent = cur + '%';
        if (cur >= score) clearInterval(iv);
      }, 40);
    }
  }

  function animateCount(el, target) {
    if (!el) return;
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 15));
    const iv = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur;
      if (cur >= target) clearInterval(iv);
    }, 40);
  }

  updateStats();


  // ── 9. GLOBAL SEARCH (basic highlight) ───────────────────────
  const globalSearch = document.querySelector('.global-search');
  if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        // restore all
        document.querySelectorAll('.lab-item').forEach(el => el.style.display = 'flex');
        return;
      }
      document.querySelectorAll('.lab-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });
  }

  // ── 10. GLOBAL AI DOUBT SOLVER (V4 — Drag + Custom Resize + Inline Panel) ──
  const isExamPortal = window.location.pathname.toLowerCase().includes('exam');

  if (!isExamPortal) {

    // ── Inject HTML ──────────────────────────────────────────────
    const aiHTML = `
      <button id="ai-fab" class="ai-fab" aria-label="Open AI Doubt Solver">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ai-fab-icon">
          <path d="M12 2a2 2 0 0 1 2 2v2"></path>
          <path d="M5 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"></path>
          <path d="M5 11H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2"></path>
          <path d="M19 11h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2"></path>
          <circle cx="9" cy="12" r="1.5" fill="var(--teal)"></circle>
          <circle cx="15" cy="12" r="1.5" fill="var(--teal)"></circle>
          <path d="M10 16h4"></path>
        </svg>
      </button>

      <div id="ai-chat-window" class="ai-chat-window closed">
        <!-- Custom resize handles on all 8 edges/corners -->
        <div class="ai-resize-handle ai-rh-n"  data-dir="n"></div>
        <div class="ai-resize-handle ai-rh-s"  data-dir="s"></div>
        <div class="ai-resize-handle ai-rh-e"  data-dir="e"></div>
        <div class="ai-resize-handle ai-rh-w"  data-dir="w"></div>
        <div class="ai-resize-handle ai-rh-ne" data-dir="ne"></div>
        <div class="ai-resize-handle ai-rh-nw" data-dir="nw"></div>
        <div class="ai-resize-handle ai-rh-se" data-dir="se"></div>
        <div class="ai-resize-handle ai-rh-sw" data-dir="sw"></div>

        <div id="ai-chat-header" class="ai-chat-header">
          <div class="ai-chat-title">
            <span class="ai-status-dot"></span> LABMATE AI
          </div>
          <div class="ai-chat-controls">
            <button id="ai-minimize-btn" aria-label="Minimize Chat" title="Minimize">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <button id="ai-close-btn" aria-label="Close Chat" title="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <div class="ai-chat-body" id="ai-chat-body">
          <div class="ai-msg ai-msg-bot">
            <div class="ai-bubble">Hello! I'm LABMATE AI. How can I assist you with your experiments today?</div>
          </div>
        </div>

        <div class="ai-chat-footer">
          <input type="text" placeholder="Type your doubt here..." class="ai-chat-input" id="ai-chat-input" />
          <button class="ai-send-btn" id="ai-send-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', aiHTML);

    // ── Element refs ────────────────────────────────────────────
    const aiFab        = document.getElementById('ai-fab');
    const aiChat       = document.getElementById('ai-chat-window');
    const aiClose      = document.getElementById('ai-close-btn');
    const aiMinimize   = document.getElementById('ai-minimize-btn');
    const aiChatBody   = document.getElementById('ai-chat-body');
    const aiInput      = document.getElementById('ai-chat-input');
    const aiSendBtn    = document.getElementById('ai-send-btn');
    const aiHeader     = document.getElementById('ai-chat-header');

    // ── Default size / position ─────────────────────────────────
    const DEFAULT = { width: 360, height: 500, right: 30, bottom: 100 };
    const MIN_W = 280, MIN_H = 320;

    // ── Open / close / minimize ─────────────────────────────────
    const openChat = () => {
      aiChat.classList.remove('closed', 'minimized');
      aiChat.classList.add('open');
      aiFab.classList.add('hidden');
      aiInput.focus();
    };

    const closeChat = () => {
      aiChat.classList.remove('open', 'minimized');
      aiChat.classList.add('closed');
      aiFab.classList.remove('hidden');
    };

    const minimizeChat = () => {
      aiChat.classList.toggle('minimized');
    };

    aiClose.addEventListener('click', (e) => { e.stopPropagation(); closeChat(); });
    aiMinimize.addEventListener('click', (e) => { e.stopPropagation(); minimizeChat(); });

    // ── Storage ─────────────────────────────────────────────────
    const AI_KEY = 'labmate_ai_v4';

    function saveState() {
      const state = {
        left: aiChat.style.left,   top: aiChat.style.top,
        right: aiChat.style.right, bottom: aiChat.style.bottom,
        width: aiChat.style.width, height: aiChat.style.height,
        fabLeft: aiFab.style.left, fabTop: aiFab.style.top,
        fabRight: aiFab.style.right, fabBottom: aiFab.style.bottom
      };
      localStorage.setItem(AI_KEY, JSON.stringify(state));
    }

    function loadState() {
      try {
        const s = JSON.parse(localStorage.getItem(AI_KEY));
        if (!s) return;
        if (s.width)  aiChat.style.width  = s.width;
        if (s.height) aiChat.style.height = s.height;
        if (s.left && s.left !== 'auto' && s.left !== '') {
          aiChat.style.right = 'auto'; aiChat.style.bottom = 'auto';
          aiChat.style.left = s.left;  aiChat.style.top    = s.top;
        }
        if (s.fabLeft && s.fabLeft !== 'auto' && s.fabLeft !== '') {
          aiFab.style.right = 'auto'; aiFab.style.bottom = 'auto';
          aiFab.style.left  = s.fabLeft; aiFab.style.top = s.fabTop;
        }
      } catch(e) {}
    }

    // ── Universal drag helper ────────────────────────────────────
    function makeDraggable(el, handle, onClickCb) {
      let active = false, moved = false;
      let sx, sy, ox, oy;

      function startDrag(cx, cy) {
        active = true; moved = false;
        sx = cx; sy = cy;
        const r = el.getBoundingClientRect();
        ox = r.left; oy = r.top;
        el.classList.add('ai-dragging');
      }

      function moveDrag(cx, cy) {
        if (!active) return;
        const dx = cx - sx, dy = cy - sy;
        if (!moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
          el.style.right  = 'auto';
          el.style.bottom = 'auto';
          el.style.left   = ox + 'px';
          el.style.top    = oy + 'px';
          moved = true;
        }
        if (moved) {
          const nx = Math.max(0, Math.min(ox + dx, window.innerWidth  - el.offsetWidth));
          const ny = Math.max(0, Math.min(oy + dy, window.innerHeight - el.offsetHeight));
          el.style.left = nx + 'px';
          el.style.top  = ny + 'px';
        }
      }

      function endDrag() {
        if (!active) return;
        active = false;
        el.classList.remove('ai-dragging');
        if (moved) { saveState(); }
        else if (onClickCb) { onClickCb(); }
      }

      // Mouse
      handle.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('button') && e.target !== handle) return;
        startDrag(e.clientX, e.clientY);
        document.addEventListener('mousemove', onMM);
        document.addEventListener('mouseup',   onMU);
        e.preventDefault();
      });
      function onMM(e) { moveDrag(e.clientX, e.clientY); }
      function onMU()  { endDrag(); document.removeEventListener('mousemove', onMM); document.removeEventListener('mouseup', onMU); }

      // Touch
      handle.addEventListener('touchstart', (e) => {
        if (e.target.closest('button') && e.target !== handle) return;
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);
        document.addEventListener('touchmove',  onTM, { passive: false });
        document.addEventListener('touchend',   onTE);
      }, { passive: true });
      function onTM(e) { e.preventDefault(); const t = e.touches[0]; moveDrag(t.clientX, t.clientY); }
      function onTE()  { endDrag(); document.removeEventListener('touchmove', onTM); document.removeEventListener('touchend', onTE); }
    }

    // ── Custom resize logic (all 8 handles) ─────────────────────
    function setupResize() {
      const handles = aiChat.querySelectorAll('.ai-resize-handle');

      handles.forEach(handle => {
        const dir = handle.dataset.dir;

        // Mouse
        handle.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          e.preventDefault();
          startResize(e.clientX, e.clientY, dir);
          document.addEventListener('mousemove', onResizeMove);
          document.addEventListener('mouseup',   onResizeUp);
        });

        // Touch
        handle.addEventListener('touchstart', (e) => {
          e.stopPropagation();
          const t = e.touches[0];
          startResize(t.clientX, t.clientY, dir);
          document.addEventListener('touchmove', onResizeTouchMove, { passive: false });
          document.addEventListener('touchend',  onResizeTouchUp);
        }, { passive: true });
      });

      let resizing = false;
      let rDir, rSX, rSY, rOW, rOH, rOL, rOT, rOR, rOB;

      function startResize(cx, cy, dir) {
        resizing = true;
        rDir = dir;
        rSX = cx; rSY = cy;
        const r = aiChat.getBoundingClientRect();
        rOW = r.width; rOH = r.height;
        rOL = r.left;  rOT = r.top;

        // Freeze position to left/top so resize works predictably
        aiChat.style.right  = 'auto';
        aiChat.style.bottom = 'auto';
        aiChat.style.left   = rOL + 'px';
        aiChat.style.top    = rOT + 'px';
        aiChat.style.width  = rOW + 'px';
        aiChat.style.height = rOH + 'px';

        aiChat.classList.add('ai-resizing');
      }

      function applyResize(cx, cy) {
        if (!resizing) return;
        const dx = cx - rSX, dy = cy - rSY;
        let nw = rOW, nh = rOH, nl = rOL, nt = rOT;

        if (rDir.includes('e'))  nw = Math.max(MIN_W, rOW + dx);
        if (rDir.includes('s'))  nh = Math.max(MIN_H, rOH + dy);
        if (rDir.includes('w')) { nw = Math.max(MIN_W, rOW - dx); nl = rOL + (rOW - nw); }
        if (rDir.includes('n')) { nh = Math.max(MIN_H, rOH - dy); nt = rOT + (rOH - nh); }

        aiChat.style.width  = nw + 'px';
        aiChat.style.height = nh + 'px';
        aiChat.style.left   = nl + 'px';
        aiChat.style.top    = nt + 'px';
      }

      function endResize() {
        if (!resizing) return;
        resizing = false;
        aiChat.classList.remove('ai-resizing');
        saveState();
      }

      function onResizeMove(e)       { applyResize(e.clientX, e.clientY); }
      function onResizeUp()          { endResize(); document.removeEventListener('mousemove', onResizeMove); document.removeEventListener('mouseup', onResizeUp); }
      function onResizeTouchMove(e)  { e.preventDefault(); const t = e.touches[0]; applyResize(t.clientX, t.clientY); }
      function onResizeTouchUp()     { endResize(); document.removeEventListener('touchmove', onResizeTouchMove); document.removeEventListener('touchend', onResizeTouchUp); }
    }

    // ── Send message (mock echo) ─────────────────────────────────
    function sendMessage() {
      const text = aiInput.value.trim();
      if (!text) return;

      // User bubble
      const userMsg = document.createElement('div');
      userMsg.className = 'ai-msg ai-msg-user';
      userMsg.innerHTML = `<div class="ai-bubble ai-bubble-user">${text}</div>`;
      aiChatBody.appendChild(userMsg);
      aiInput.value = '';
      aiChatBody.scrollTop = aiChatBody.scrollHeight;

      // Typing indicator
      const typing = document.createElement('div');
      typing.className = 'ai-msg ai-msg-bot';
      typing.innerHTML = '<div class="ai-bubble ai-typing"><span></span><span></span><span></span></div>';
      aiChatBody.appendChild(typing);
      aiChatBody.scrollTop = aiChatBody.scrollHeight;

      // Simulated reply (replace with real API call as needed)
      setTimeout(() => {
        aiChatBody.removeChild(typing);
        const botMsg = document.createElement('div');
        botMsg.className = 'ai-msg ai-msg-bot';
        botMsg.innerHTML = `<div class="ai-bubble">I received your question about "<strong>${text}</strong>". Connect me to the Anthropic API to get real answers!</div>`;
        aiChatBody.appendChild(botMsg);
        aiChatBody.scrollTop = aiChatBody.scrollHeight;
      }, 1200);
    }

    aiSendBtn.addEventListener('click', sendMessage);
    aiInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

    // ── Wire up drag & resize ────────────────────────────────────
    makeDraggable(aiFab, aiFab, openChat);
    makeDraggable(aiChat, aiHeader, null);
    setupResize();

    // ── Load saved state ─────────────────────────────────────────
    loadState();

    // Clear old storage keys
    localStorage.removeItem('ai_bot_state');
    localStorage.removeItem('labmate_ai_coords_v3');
  }

  const button1 = document.getElementById('startBtn1');
  button1.addEventListener('click', ()=>{
    window.location.href="../html/BubbleSortEXP.html";
  });

  const button2 = document.getElementById('startBtn2');
  button2.addEventListener('click', ()=>{
    window.location.href="../html/Temperatureconvertor.html";
  });

}); // end DOMContentLoaded