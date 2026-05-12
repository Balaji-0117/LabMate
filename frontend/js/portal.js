/* ═══════════════════════════════════════════════════════════════
   portal.js  |  LabMate Student Portal
   Handles: theme, profile dropdown, notification panel,
            stat counter animation, circular ring animation,
            section modals (click-to-expand with blur overlay),
            AI chat fab (drag + resize)
════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {


  // ─────────────────────────────────────────────────────────────
// NEW: AUTO-UPDATE WELCOME DATE
// ─────────────────────────────────────────────────────────────
const welcomeDateEl = document.getElementById('welcome-date');
if (welcomeDateEl) {
  const today = new Date();
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  
  // Formats date as "Month Day, Year" (e.g., May 9, 2026)
  welcomeDateEl.textContent = today.toLocaleDateString('en-US', options);
}

  async function loadDashboard() {
  try {
    const token = localStorage.getItem("token");

    // Perform the fetch ONCE
    const response = await fetch(`${API_BASE}/api/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Failed to fetch dashboard data");

    const data = await response.json();
    console.log("Dashboard Data:", data);

    // ─────────────────────────────
    // 1. UPDATE HEADER PROFILE BUTTON (Top Right)
    // ─────────────────────────────
    const topNavName = document.querySelector(".prof-name");
    if (topNavName) topNavName.textContent = data.student.username;

    // ─────────────────────────────
    // 2. UPDATE DROPDOWN HEADER DETAILS
    // ─────────────────────────────
    const dropdownName = document.querySelector(".dropdown-header strong");
    const dropdownDetails = document.querySelector(".dropdown-header span");

    if (dropdownName) dropdownName.textContent = data.student.username;
    if (dropdownDetails) {
      // Formats as: "24P31A42J4 · AIML"
      dropdownDetails.textContent = `${data.student.roll_number} · ${data.student.branch}`;
    }

    // ─────────────────────────────
    // 3. UPDATE AVATARS
    // ─────────────────────────────
    const initial = data.student.username ? data.student.username.charAt(0).toUpperCase() : 'U';
    const profileAvatar = document.querySelector(".profile-avatar");
    const dhAvatar = document.querySelector(".dh-avatar");
    if (profileAvatar) profileAvatar.textContent = initial;
    if (dhAvatar) dhAvatar.textContent = initial;

    // ─────────────────────────────
    // 1. UPDATE PROFILE & BIO
    // ─────────────────────────────
    const welcomeName = document.querySelector(".welcome-name");
    if (welcomeName) welcomeName.textContent = data.student.username;
    
    document.querySelectorAll(".prof-roll").forEach(el => el.textContent = data.student.roll_number);
    
    // Update the Bio - uses a fallback if the DB field is empty
    const bioEl = document.getElementById("student-bio");
    if (bioEl) {
      bioEl.textContent = data.student.bio || "The best way to predict the future is to create it. Stay curious, stay bold.";
    }

    // ─────────────────────────────
    // 2. UPDATE BRANCH & SECTION
    // ─────────────────────────────
    const metaText = `${data.student.branch} • Section ${data.student.section} • Sem ${data.student.semester}`;
    const metaEl = document.getElementById("meta-text");
    if (metaEl) metaEl.textContent = metaText;

    // ─────────────────────────────
    // 3. UPDATE STATS
    // ─────────────────────────────
    const statTotal = document.getElementById("stat-total");
    if (statTotal) statTotal.textContent = data.stats.total_labs;
    
    const statDone = document.getElementById("stat-done");
    if (statDone) statDone.textContent = data.stats.completed_labs;
    
    const statPending = document.getElementById("stat-pending");
    if (statPending) statPending.textContent = data.stats.pending_labs;
    
    const statScore = document.getElementById("stat-score");
    if (statScore) statScore.textContent = data.stats.overall_score + "%";

    // ─────────────────────────────
    // 4. UPDATE DROPDOWN (Bonus)
    // ─────────────────────────────
    const dropDownName = document.querySelector(".dropdown-header strong");
    if (dropDownName) dropDownName.textContent = data.student.username;

  } catch (err) {
    console.error("Dashboard Error:", err);
  }
}

loadDashboard();

  // ─────────────────────────────────────────────────────────────
  // 1. THEME SWITCHER
  // ─────────────────────────────────────────────────────────────
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


  // ─────────────────────────────────────────────────────────────
  // 2. PROFILE DROPDOWN
  // ─────────────────────────────────────────────────────────────
  const profileBtn = document.querySelector('.profile-btn');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (profileBtn && dropdownMenu) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownMenu.classList.toggle('active');
      profileBtn.setAttribute('aria-expanded', String(isOpen));
      notifPanel && notifPanel.classList.remove('active');
    });
  }


  // ─────────────────────────────────────────────────────────────
  // 3. NOTIFICATION PANEL
  // ─────────────────────────────────────────────────────────────
  const notifBtn = document.getElementById('notif-btn');
  const notifPanel = document.getElementById('notif-panel');
  const notifClear = document.getElementById('notif-clear');

  if (notifBtn && notifPanel) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifPanel.classList.toggle('active');
      dropdownMenu && dropdownMenu.classList.remove('active');
      profileBtn && profileBtn.setAttribute('aria-expanded', 'false');
    });

    notifClear && notifClear.addEventListener('click', () => {
      document.querySelectorAll('.notif-unread').forEach(el => el.classList.remove('notif-unread'));
      document.querySelectorAll('.notif-dot').forEach(el => {
        el.classList.add('notif-dot-read');
        el.classList.remove('notif-dot');
      });
      const badge = document.querySelector('.notification-badge');
      if (badge) badge.style.display = 'none';
    });
  }

  // Close all dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (dropdownMenu && profileBtn &&
      !profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove('active');
      profileBtn.setAttribute('aria-expanded', 'false');
    }
    if (notifPanel && notifBtn &&
      !notifBtn.contains(e.target) && !notifPanel.contains(e.target)) {
      notifPanel.classList.remove('active');
    }
  });


  // ─────────────────────────────────────────────────────────────
  // 4. SIDEBAR OVERLAY (kept for compatibility)
  // ─────────────────────────────────────────────────────────────
  const sidebarBtn = document.getElementById('sidebar-toggle-btn');
  const sidebar = document.querySelector('.portal-sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (sidebarBtn && sidebar && overlay) {
    const toggleSidebar = () => {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
      sidebarBtn.classList.toggle('active');
    };
    sidebarBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSidebar(); });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      sidebarBtn.classList.remove('active');
    });
    document.body.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        sidebarBtn.classList.remove('active');
      }
    });
  }


  // ─────────────────────────────────────────────────────────────
  // 5. DASHBOARD STAT COUNTERS
  // ─────────────────────────────────────────────────────────────
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

  function updateStats() {
    const all = document.querySelectorAll('.lab-item').length;
    const completed = document.querySelectorAll('.status-completed').length;
    const pending = document.querySelectorAll('.status-pending').length;

    animateCount(document.getElementById('stat-total'), all);
    animateCount(document.getElementById('stat-done'), completed);
    animateCount(document.getElementById('stat-pending'), pending);

    const score = all > 0 ? Math.round((completed / all) * 100) : 0;
    const scoreEl = document.getElementById('stat-score');
    if (scoreEl) {
      let cur = 0;
      const step = Math.ceil(score / 20) || 1;
      const iv = setInterval(() => {
        cur = Math.min(cur + step, score);
        scoreEl.textContent = cur + '%';
        if (cur >= score) clearInterval(iv);
      }, 40);
    }
  }

  updateStats();


  // ─────────────────────────────────────────────────────────────
  // 6. GLOBAL SEARCH (lab items)
  // ─────────────────────────────────────────────────────────────
  const globalSearch = document.querySelector('.global-search');
  if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.lab-item').forEach(item => {
        item.style.display = (!q || item.textContent.toLowerCase().includes(q)) ? 'flex' : 'none';
      });
    });
  }


  // ─────────────────────────────────────────────────────────────
  // 7. LABS MASTERY CIRCULAR RING ANIMATION
  // ─────────────────────────────────────────────────────────────
  const masteryRing = document.querySelector('.mastery-ring');
  if (masteryRing) {
    const pct = parseInt(masteryRing.dataset.percent) || 0;
    const circle = masteryRing.querySelector('.ring-fill');
    const r = 46;
    const circ = 2 * Math.PI * r;

    circle.style.strokeDasharray = `${circ}`;
    circle.style.strokeDashoffset = `${circ}`;

    setTimeout(() => {
      circle.style.strokeDashoffset = `${circ - (pct / 100) * circ}`;
    }, 400);
  }


  // ─────────────────────────────────────────────────────────────
  // 8. SECTION MODAL SYSTEM
  //    All pw-card sections open their corresponding modal when
  //    clicked. My Labs section is excluded (no data-modal attr).
  //    Close: ×-button, overlay click, or Escape key.
  // ─────────────────────────────────────────────────────────────

  /**
   * Open a modal by its id
   */
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close a modal by its id (or by the overlay element)
   */
  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Attach click handler to every pw-card that has data-modal
  document.querySelectorAll('.pw-card[data-modal]').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't fire if the user clicked a button/link inside the card
      if (e.target.closest('button, a')) return;
      const modalId = card.dataset.modal;
      openModal(modalId);
    });

    // Keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Open ${card.querySelector('.pw-title')?.textContent || 'section'}`);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const modalId = card.dataset.modal;
        openModal(modalId);
      }
    });
  });

  // Close buttons inside modals
  document.querySelectorAll('.pw-modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modalId = btn.dataset.close;
      closeModal(modalId);
    });
  });

  // Click on overlay backdrop to close
  document.querySelectorAll('.pw-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      // Only close if the click was directly on the overlay (not on the modal box)
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  // Escape key closes any open modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.pw-modal-overlay.active').forEach(m => {
        closeModal(m.id);
      });
    }
  });


  // ─────────────────────────────────────────────────────────────
  // 9. QUICK-ACTION BUTTONS (kept for compatibility)
  // ─────────────────────────────────────────────────────────────
  const button1 = document.getElementById('startBtn1');
  if (button1) button1.addEventListener('click', () => { window.location.href = '../html/BubbleSortEXP.html'; });

  const button2 = document.getElementById('startBtn2');
  if (button2) button2.addEventListener('click', () => { window.location.href = '../html/Temperatureconvertor.html'; });


  // ─────────────────────────────────────────────────────────────
  // 10. GLOBAL AI DOUBT SOLVER  (Drag + Custom Resize)
  // ─────────────────────────────────────────────────────────────
  const isExamPortal = window.location.pathname.toLowerCase().includes('exam');

  if (!isExamPortal) {

    // ── Inject HTML ────────────────────────────────────────────
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
            
          </div>
        </div>

        <div class="ai-chat-body" id="ai-chat-body">
          <div class="ai-msg ai-msg-bot">
            <div class="ai-bubble">Hello! I'm LABMATE AI. How can I assist you with your experiments today?</div>
          </div>
        </div>

        <div class="ai-chat-footer">
          <input type="text" placeholder="Type your doubt here…" class="ai-chat-input" id="ai-chat-input" />
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

    // ── Element refs ──────────────────────────────────────────
    const aiFab = document.getElementById('ai-fab');
    const aiChat = document.getElementById('ai-chat-window');
    // const aiClose = document.getElementById('ai-close-btn');
    // const aiMinimize = document.getElementById('ai-minimize-btn');
    const aiChatBody = document.getElementById('ai-chat-body');
    const aiInput = document.getElementById('ai-chat-input');
    const aiSendBtn = document.getElementById('ai-send-btn');
    const aiHeader = document.getElementById('ai-chat-header');

    // const MIN_W = 280, MIN_H = 320;

    // // ── Open / close / minimize ───────────────────────────────
    // const openChat = () => {
    //   aiChat.classList.remove('closed', 'minimized');
    //   aiChat.classList.add('open');
    //   aiFab.classList.add('hidden');
    //   aiInput.focus();
    // };
    // const closeChat = () => {
    //   aiChat.classList.remove('open', 'minimized');
    //   aiChat.classList.add('closed');
    //   aiFab.classList.remove('hidden');
    // };
    // const minimizeChat = () => aiChat.classList.toggle('minimized');

    // aiClose.addEventListener('click', (e) => { e.stopPropagation(); closeChat(); });
    // aiMinimize.addEventListener('click', (e) => { e.stopPropagation(); minimizeChat(); });

    const DEFAULT = { width: 360, height: 500, right: 30, bottom: 100 };
    const MIN_W = 280, MIN_H = 320;

    // OPEN CHAT
    const openChat = () => {
      aiChat.classList.remove('closed', 'minimized');
      aiChat.classList.add('open');
      aiFab.classList.add('hidden');
      aiInput.focus();
    };

    // CLOSE CHAT
    const closeChat = () => {
      aiChat.classList.remove('open', 'minimized');
      aiChat.classList.add('closed');
      aiFab.classList.remove('hidden');
    };

    // // FAB DRAG + OPEN
    // makeDraggable(aiFab, aiFab, openChat);

    // OUTSIDE CLICK CLOSE
    document.addEventListener('click', function (e) {

      if (
        aiChat.classList.contains('open') &&
        !aiChat.contains(e.target) &&
        !aiFab.contains(e.target)
      ) {
        closeChat();
      }

    });

    // ── Storage ───────────────────────────────────────────────
    const AI_KEY = 'labmate_ai_v4';

    function saveState() {
      const s = {
        left: aiChat.style.left, top: aiChat.style.top,
        right: aiChat.style.right, bottom: aiChat.style.bottom,
        width: aiChat.style.width, height: aiChat.style.height,
        fabLeft: aiFab.style.left, fabTop: aiFab.style.top,
        fabRight: aiFab.style.right, fabBottom: aiFab.style.bottom
      };
      localStorage.setItem(AI_KEY, JSON.stringify(s));
    }

    function loadState() {
      try {
        const s = JSON.parse(localStorage.getItem(AI_KEY));
        if (!s) return;
        if (s.width) aiChat.style.width = s.width;
        if (s.height) aiChat.style.height = s.height;
        if (s.left && s.left !== 'auto' && s.left !== '') {
          aiChat.style.right = 'auto'; aiChat.style.bottom = 'auto';
          aiChat.style.left = s.left; aiChat.style.top = s.top;
        }
        if (s.fabLeft && s.fabLeft !== 'auto' && s.fabLeft !== '') {
          aiFab.style.right = 'auto'; aiFab.style.bottom = 'auto';
          aiFab.style.left = s.fabLeft; aiFab.style.top = s.fabTop;
        }
      } catch (e) { }
    }

    // ── Universal drag helper ─────────────────────────────────
    function makeDraggable(el, handle, onClickCb) {
      let active = false, moved = false;
      let sx, sy, ox, oy;

      function startDrag(cx, cy) {
        active = true; moved = false; sx = cx; sy = cy;
        const r = el.getBoundingClientRect();
        ox = r.left; oy = r.top;
        el.classList.add('ai-dragging');
      }
      function moveDrag(cx, cy) {
        if (!active) return;
        const dx = cx - sx, dy = cy - sy;
        if (!moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
          el.style.right = 'auto'; el.style.bottom = 'auto';
          el.style.left = ox + 'px'; el.style.top = oy + 'px';
          moved = true;
        }
        if (moved) {
          el.style.left = Math.max(0, Math.min(ox + dx, window.innerWidth - el.offsetWidth)) + 'px';
          el.style.top = Math.max(0, Math.min(oy + dy, window.innerHeight - el.offsetHeight)) + 'px';
        }
      }
      function endDrag() {
        if (!active) return;
        active = false;
        el.classList.remove('ai-dragging');
        if (moved) saveState();
        else if (onClickCb) onClickCb();
      }

      handle.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('button') && e.target !== handle) return;
        startDrag(e.clientX, e.clientY);
        document.addEventListener('mousemove', onMM);
        document.addEventListener('mouseup', onMU);
        e.preventDefault();
      });
      function onMM(e) { moveDrag(e.clientX, e.clientY); }
      function onMU() { endDrag(); document.removeEventListener('mousemove', onMM); document.removeEventListener('mouseup', onMU); }

      handle.addEventListener('touchstart', (e) => {
        if (e.target.closest('button') && e.target !== handle) return;
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);
        document.addEventListener('touchmove', onTM, { passive: false });
        document.addEventListener('touchend', onTE);
      }, { passive: true });
      function onTM(e) { e.preventDefault(); const t = e.touches[0]; moveDrag(t.clientX, t.clientY); }
      function onTE() { endDrag(); document.removeEventListener('touchmove', onTM); document.removeEventListener('touchend', onTE); }
    }

    // ── Custom resize (8-directional) ─────────────────────────
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

    // ── Send message ──────────────────────────────────────────
    function sendMessage() {
      const text = aiInput.value.trim();
      if (!text) return;

      const userMsg = document.createElement('div');
      userMsg.className = 'ai-msg ai-msg-user';
      userMsg.innerHTML = `<div class="ai-bubble ai-bubble-user">${text}</div>`;
      aiChatBody.appendChild(userMsg);
      aiInput.value = '';
      aiChatBody.scrollTop = aiChatBody.scrollHeight;

      const typing = document.createElement('div');
      typing.className = 'ai-msg ai-msg-bot';
      typing.innerHTML = '<div class="ai-bubble ai-typing"><span></span><span></span><span></span></div>';
      aiChatBody.appendChild(typing);
      aiChatBody.scrollTop = aiChatBody.scrollHeight;

      // Simulated reply (replace with real API call as needed)
            // REAL API CALL
      fetch(`${API_BASE}/api/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text
        })
      })
      .then(response => response.json())
      .then(data => {

       aiChatBody.removeChild(typing);

        const botMsg = document.createElement('div');
        botMsg.className = 'ai-msg ai-msg-bot';

        botMsg.innerHTML = `
        <div class="ai-bubble">
          ${data.reply.replace(/\n/g, "<br>")}
        </div>
       `;

        aiChatBody.appendChild(botMsg);
        aiChatBody.scrollTop = aiChatBody.scrollHeight;
      })
      .catch(error => {

        aiChatBody.removeChild(typing);

        const errorMsg = document.createElement('div');
        errorMsg.className = 'ai-msg ai-msg-bot';

        errorMsg.innerHTML = `
          <div class="ai-bubble">
            Server Error. Please try again later.
          </div>
        `;

        aiChatBody.appendChild(errorMsg);

        console.log(error);
      });

    }

    aiSendBtn.addEventListener('click', sendMessage);
    aiInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    // ── Wire up drag & resize ─────────────────────────────────
    makeDraggable(aiFab, aiFab, openChat);
    makeDraggable(aiChat, aiHeader, null);
    setupResize();
    loadState();

    // Clean up old storage keys
    localStorage.removeItem('ai_bot_state');
    localStorage.removeItem('labmate_ai_coords_v3');
  }

}); // end DOMContentLoaded