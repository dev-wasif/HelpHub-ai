/* ============================================
   HelpHub AI - Unified Application Script (v2)
   ============================================ */
(function() {
  'use strict';

  // ---------- CONFIGURATION ----------
  const CONFIG = {
    USER_KEY: 'helphub_user',
    NOTIF_KEY: 'helphub_notifications',
    REQUESTS_KEY: 'helphub_requests',
    AUTH_REQUIRED_PAGES: ['dashboard.html', 'explore.html', 'leader.html', 'AI Center.html', 'messag.html', 'notifications.html', 'profile.html', 'request.html'],
    PUBLIC_PAGES: ['index.html', 'signup.html', 'home.html'],
    DEFAULT_USER: {
      name: 'Ayesha Khan',
      email: 'ayesha@helphub.ai',
      role: 'helper',
      initials: 'AK'
    }
  };

  let navigationInitialized = false; // Guard against duplicate execution

  // ---------- STORAGE HELPERS ----------
  function getUser() {
    const stored = localStorage.getItem(CONFIG.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  function setUser(user) {
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
  }

  function logout() {
    localStorage.removeItem(CONFIG.USER_KEY);
    window.location.href = 'signup.html';
  }

  // ---------- NAVIGATION UPDATE (FIXED) ----------
  function getCurrentPage() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  }

  function updateNavigation() {
    // Prevent multiple executions on same page
    if (navigationInitialized) return;
    
    const user = getUser();
    const currentPage = getCurrentPage();
    const isAuthPage = CONFIG.AUTH_REQUIRED_PAGES.includes(currentPage);

    // Redirect if authentication required and no user
    if (isAuthPage && !user) {
      window.location.href = 'signup.html';
      return;
    }

    // Find the main navigation container (use the most common selectors)
    const navContainer = document.querySelector('.nav-links, .navbar nav, .floating-nav .nav-links, .mynav nav, header.navbar nav');
    if (!navContainer) return;

    // Remove any existing user-related elements (using a dedicated class)
    const existingUserElements = navContainer.querySelectorAll('.user-chip, .logout-btn, #userChip, #nav-user-info');
    existingUserElements.forEach(el => el.remove());

    // If user is logged in, add user chip and logout button
    if (user) {
      // User chip
      const userChip = document.createElement('div');
      userChip.className = 'user-chip';
      userChip.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        background: white;
        padding: 5px 12px 5px 8px;
        border-radius: 40px;
        margin-left: 12px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.02);
      `;
      userChip.innerHTML = `
        <span style="width:28px;height:28px;background:#0f766e;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:12px;">${user.initials || 'U'}</span>
        <span style="font-weight:500;font-size:14px;">${user.name ? user.name.split(' ')[0] : 'User'}</span>
      `;
      navContainer.appendChild(userChip);

      // Logout button
      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'logout-btn';
      logoutBtn.textContent = 'Logout';
      logoutBtn.style.cssText = `
        background: none;
        border: 1px solid #e5e7eb;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 13px;
        cursor: pointer;
        margin-left: 5px;
        color: #4b5563;
      `;
      logoutBtn.addEventListener('click', logout);
      navContainer.appendChild(logoutBtn);
    }

    // Highlight active nav link
    const links = navContainer.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href.includes(currentPage) || (currentPage === 'dashboard.html' && href === 'dashboard.html'))) {
        link.classList.add('active');
        link.style.background = '#d1fae5';
        link.style.color = '#065f46';
      }
    });

    // Update welcome messages on the page
    if (user) {
      document.querySelectorAll('#greetingName, #welcomeName').forEach(el => el.textContent = user.name.split(' ')[0]);
      document.querySelectorAll('#userNameDisplay, #profileName').forEach(el => el.textContent = user.name);
      document.querySelectorAll('#userInitials, .user-initials').forEach(el => el.textContent = user.initials || user.name.charAt(0));
    }

    navigationInitialized = true;
  }

  // ---------- INITIALIZE DEFAULT DATA ----------
  function initializeStorage() {
    if (!getUser()) setUser(CONFIG.DEFAULT_USER);
    if (!localStorage.getItem(CONFIG.NOTIF_KEY)) {
      localStorage.setItem(CONFIG.NOTIF_KEY, JSON.stringify([
        { id: 'n1', title: 'Murtaza Ahmed responded to your request', message: '“I can help with the portfolio responsiveness.”', category: 'Web Development', urgency: 'normal', time: '25 minutes ago', read: false, icon: '💬', type: 'response' },
        { id: 'n2', title: 'Your request is trending', message: '“Need help making my portfolio responsive” has 3 interested helpers.', category: 'Request Update', time: '2 hours ago', read: false, icon: '📈', type: 'system' },
        { id: 'n3', title: 'New high‑urgency request in Web Dev', message: '“JavaScript quiz app debugging” – deadline in 6 hours.', category: 'Urgent', urgency: 'high', time: '4 hours ago', read: true, icon: '⚠️', type: 'alert' },
        { id: 'n4', title: 'Sara Noor mentioned you', message: '“@Ayesha, could you review the Figma feedback?”', category: 'Mention', time: 'Yesterday', read: true, icon: '👤', type: 'mention' },
        { id: 'n5', title: 'You earned a new badge: “Top Helper”', message: 'You’re in the top 10% of helpers this month.', category: 'Achievement', time: '2 days ago', read: false, icon: '🏅', type: 'badge' }
      ]));
    }
    if (!localStorage.getItem(CONFIG.REQUESTS_KEY)) {
      localStorage.setItem(CONFIG.REQUESTS_KEY, JSON.stringify([
        { id: 'r1', title: 'Need help making my portfolio responsive', category: 'Web Development', urgency: 'High', helper: 'Sara Noor', location: 'Karachi', interested: 1, tags: ['HTML/CSS', 'Responsive'] },
        { id: 'r2', title: 'Looking for Figma feedback on event poster', category: 'Design', urgency: 'Medium', helper: 'Ayesha Khan', location: 'Lahore', interested: 2, tags: ['Figma', 'Poster'] },
        { id: 'r3', title: 'Mock interview practice for frontend internship', category: 'Career', urgency: 'Low', helper: 'Hassan Ali', location: 'Remote', interested: 3, tags: ['Interview', 'Frontend'] },
        { id: 'r4', title: 'JavaScript quiz app debugging', category: 'Web Development', urgency: 'High', helper: 'Murtaza Ahmed', location: 'Islamabad', interested: 1, tags: ['JavaScript', 'Debugging'] }
      ]));
    }
  }

  // ---------- DYNAMIC CONTENT LOADERS ----------
  function loadDashboardContent() {
    const feedContainer = document.getElementById('feedContainer');
    if (!feedContainer) return;
    const requests = JSON.parse(localStorage.getItem(CONFIG.REQUESTS_KEY)) || [];
    feedContainer.innerHTML = requests.slice(0, 4).map(item => `
      <div class="request-item">
        <div class="request-title">${item.title}</div>
        <div class="request-meta">
          <span class="tag">${item.category}</span>
          <span class="tag ${item.urgency.toLowerCase()}">${item.urgency}</span>
          ${item.tags.map(t => `<span class="tag" style="background:#f1f5f9;">${t}</span>`).join('')}
        </div>
        <div class="request-footer">
          <span><strong>${item.helper}</strong> · ${item.location}</span>
          <span>👥 ${item.interested} helper${item.interested !==1?'s':''}</span>
        </div>
      </div>
    `).join('');
    document.getElementById('statRequests') && (document.getElementById('statRequests').textContent = '7');
    document.getElementById('statContributions') && (document.getElementById('statContributions').textContent = '12');
    document.getElementById('statTrust') && (document.getElementById('statTrust').textContent = '94%');
    document.getElementById('statActive') && (document.getElementById('statActive').textContent = '43');
  }

  function loadProfilePage() {
    const user = getUser();
    if (user) {
      document.querySelectorAll('input[placeholder="Name"]').forEach(inp => inp.value = user.name);
      document.querySelectorAll('input[placeholder="Location"]').forEach(inp => inp.value = 'Karachi');
    }
  }

  function handleSignupForm() {
    const form = document.querySelector('form');
    if (!form || !window.location.pathname.includes('signup.html')) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      btn.innerHTML = `<span class="iconify" data-icon="lucide:loader-2" style="animation: spin 1s linear infinite;"></span> Authenticating...`;
      setTimeout(() => {
        setUser({
          name: 'Ayesha Khan',
          email: 'community@helphub.ai',
          role: document.querySelector('.role-select')?.value || 'helper',
          initials: 'AK'
        });
        btn.innerHTML = `✓ Success! Redirecting...`;
        btn.style.background = '#10b981';
        setTimeout(() => window.location.href = 'dashboard.html', 800);
      }, 1500);
    });
  }

  // ---------- PAGE INITIALIZATION ----------
  function initPage() {
    initializeStorage();
    updateNavigation();

    const page = getCurrentPage();
    if (page === 'dashboard.html') loadDashboardContent();
    if (page === 'profile.html') loadProfilePage();
    if (page === 'signup.html') handleSignupForm();
    if (page === 'notifications.html' || page === 'notification.html') {
      // Notification page has its own render script – just ensure data exists
    }

    // Global logout listener fallback
    document.addEventListener('click', e => {
      if (e.target.matches('.logout-btn, #logoutBtn, [data-action="logout"]')) {
        e.preventDefault();
        logout();
      }
    });
  }

  // Start when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
  } else {
    initPage();
  }

  window.HelpHub = { getUser, setUser, logout };
})();