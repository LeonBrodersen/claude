/**
 * app.js — Main application logic for the YT Shorts Dashboard
 */

(function () {
  'use strict';

  let currentData = null;
  let currentView = 'overview';

  // ---- DOM Refs ----
  const navLinks = document.querySelectorAll('.nav-link');
  const views = document.querySelectorAll('.view');
  const pageTitle = document.getElementById('page-title');
  const dateRange = document.getElementById('dateRange');
  const refreshBtn = document.getElementById('refreshBtn');
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');
  const saveSettingsBtn = document.getElementById('saveSettings');
  const resetDemoBtn = document.getElementById('resetDemo');

  // ---- Navigation ----
  function switchView(viewName) {
    currentView = viewName;

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewName);
    });

    views.forEach(view => {
      view.classList.toggle('active', view.id === `view-${viewName}`);
    });

    const titles = {
      overview: 'Gesamtübersicht',
      channel1: currentData ? currentData.channel1.name : 'Kanal 1',
      channel2: currentData ? currentData.channel2.name : 'Kanal 2',
      settings: 'Einstellungen',
    };
    pageTitle.textContent = titles[viewName] || 'Dashboard';

    // Close mobile sidebar
    sidebar.classList.remove('open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.remove('active');

    // Render charts for the current view
    if (currentData) renderView(viewName);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      switchView(link.dataset.view);
    });
  });

  // ---- Mobile menu ----
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    }
    overlay.classList.toggle('active');
  });

  // ---- Data loading & rendering ----
  function loadData() {
    const days = parseInt(dateRange.value, 10);
    currentData = DashboardData.generateDemoData(days);

    // Apply saved channel names
    const settings = DashboardData.loadSettings();
    if (settings) {
      if (settings.ch1Name) currentData.channel1.name = settings.ch1Name;
      if (settings.ch2Name) currentData.channel2.name = settings.ch2Name;
      if (settings.ch1Id) currentData.channel1.channelId = settings.ch1Id;
      if (settings.ch2Id) currentData.channel2.channelId = settings.ch2Id;
    }

    updateNavNames();
    renderView(currentView);
  }

  function updateNavNames() {
    document.getElementById('nav-channel1-name').textContent = currentData.channel1.name;
    document.getElementById('nav-channel2-name').textContent = currentData.channel2.name;
  }

  function renderView(viewName) {
    switch (viewName) {
      case 'overview':
        renderOverview();
        break;
      case 'channel1':
        renderChannelView('ch1', currentData.channel1);
        DashboardCharts.renderChannel('ch1', currentData.channel1, {
          main: 'rgb(255, 68, 68)',
          likes: 'rgba(255, 68, 68, 0.7)',
          comments: 'rgba(255, 136, 68, 0.7)',
          bar: 'rgba(255, 68, 68, 0.7)',
        });
        break;
      case 'channel2':
        renderChannelView('ch2', currentData.channel2);
        DashboardCharts.renderChannel('ch2', currentData.channel2, {
          main: 'rgb(68, 136, 255)',
          likes: 'rgba(68, 136, 255, 0.7)',
          comments: 'rgba(68, 204, 136, 0.7)',
          bar: 'rgba(68, 136, 255, 0.7)',
        });
        break;
      case 'settings':
        renderSettings();
        break;
    }
  }

  // ---- Overview Rendering ----
  function renderOverview() {
    const ch1 = currentData.channel1;
    const ch2 = currentData.channel2;
    const fmt = DashboardData.formatNumber;
    const pct = DashboardData.formatPercent;

    // Combined stats
    setText('total-views', fmt(ch1.totalViews + ch2.totalViews));
    setText('total-likes', fmt(ch1.totalLikes + ch2.totalLikes));
    setText('total-comments', fmt(ch1.totalComments + ch2.totalComments));
    setText('total-subs', fmt(ch1.newSubs + ch2.newSubs));
    setText('total-shorts', (ch1.shorts.length + ch2.shorts.length).toString());
    const combinedEngagement = (ch1.avgEngagement + ch2.avgEngagement) / 2;
    setText('total-engagement', pct(combinedEngagement));

    // Changes
    setChange('total-views-change', avgChange(ch1.changes.views, ch2.changes.views));
    setChange('total-likes-change', avgChange(ch1.changes.likes, ch2.changes.likes));
    setChange('total-comments-change', avgChange(ch1.changes.comments, ch2.changes.comments));
    setChange('total-subs-change', avgChange(ch1.changes.subs, ch2.changes.subs));

    // Top shorts table
    const allShorts = [...ch1.shorts, ...ch2.shorts]
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    const tbody = document.getElementById('overview-top-shorts');
    tbody.innerHTML = allShorts.map((s, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(s.title)}</td>
        <td><span class="channel-badge ${s.channel}">${s.channel === 'ch1' ? ch1.name : ch2.name}</span></td>
        <td>${fmt(s.views)}</td>
        <td>${fmt(s.likes)}</td>
        <td>${fmt(s.comments)}</td>
        <td>${pct(s.engagement)}</td>
        <td>${s.dateStr}</td>
      </tr>
    `).join('');

    DashboardCharts.renderOverview(currentData);
  }

  // ---- Channel View Rendering ----
  function renderChannelView(prefix, ch) {
    const fmt = DashboardData.formatNumber;
    const pct = DashboardData.formatPercent;

    // Header
    document.getElementById(`${prefix}-name`).textContent = ch.name;
    document.getElementById(`${prefix}-description`).textContent = ch.description;
    document.getElementById(`${prefix}-avatar`).textContent = ch.initials;

    // Stats
    setText(`${prefix}-views`, fmt(ch.totalViews));
    setText(`${prefix}-likes`, fmt(ch.totalLikes));
    setText(`${prefix}-comments`, fmt(ch.totalComments));
    setText(`${prefix}-subs`, fmt(ch.newSubs));
    setText(`${prefix}-count`, ch.shorts.length.toString());
    setText(`${prefix}-engagement`, pct(ch.avgEngagement));

    // Changes
    setChange(`${prefix}-views-change`, ch.changes.views);
    setChange(`${prefix}-likes-change`, ch.changes.likes);
    setChange(`${prefix}-comments-change`, ch.changes.comments);
    setChange(`${prefix}-subs-change`, ch.changes.subs);
    setChange(`${prefix}-engagement-change`, ch.changes.engagement);

    // Table
    const sorted = [...ch.shorts].sort((a, b) => b.views - a.views);
    const tbody = document.getElementById(`${prefix}-shorts-table`);
    tbody.innerHTML = sorted.map((s, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(s.title)}</td>
        <td>${fmt(s.views)}</td>
        <td>${fmt(s.likes)}</td>
        <td>${fmt(s.comments)}</td>
        <td>${pct(s.likeRate)}</td>
        <td>${s.dateStr}</td>
      </tr>
    `).join('');
  }

  // ---- Settings ----
  function renderSettings() {
    const settings = DashboardData.loadSettings() || {};
    document.getElementById('ch1-name-input').value = settings.ch1Name || currentData.channel1.name;
    document.getElementById('ch2-name-input').value = settings.ch2Name || currentData.channel2.name;
    document.getElementById('ch1-id-input').value = settings.ch1Id || '';
    document.getElementById('ch2-id-input').value = settings.ch2Id || '';
    document.getElementById('api-key-input').value = settings.apiKey || '';
  }

  saveSettingsBtn.addEventListener('click', () => {
    const settings = {
      ch1Name: document.getElementById('ch1-name-input').value.trim(),
      ch2Name: document.getElementById('ch2-name-input').value.trim(),
      ch1Id: document.getElementById('ch1-id-input').value.trim(),
      ch2Id: document.getElementById('ch2-id-input').value.trim(),
      apiKey: document.getElementById('api-key-input').value.trim(),
    };
    DashboardData.saveSettings(settings);

    // Apply immediately
    if (settings.ch1Name) currentData.channel1.name = settings.ch1Name;
    if (settings.ch2Name) currentData.channel2.name = settings.ch2Name;
    updateNavNames();

    showToast('Einstellungen gespeichert!');
  });

  resetDemoBtn.addEventListener('click', () => {
    DashboardData.clearSettings();
    loadData();
    showToast('Demo-Daten zurückgesetzt!');
  });

  // ---- Date range change ----
  dateRange.addEventListener('change', () => {
    DashboardCharts.destroyAll();
    loadData();
  });

  // ---- Refresh ----
  refreshBtn.addEventListener('click', () => {
    DashboardCharts.destroyAll();
    loadData();
    refreshBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => { refreshBtn.style.transform = ''; }, 500);
  });

  // ---- Helpers ----
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setChange(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    const num = typeof value === 'number' ? value : parseFloat(value);
    if (num > 0) {
      el.textContent = `+${num}%`;
      el.className = 'stat-change positive';
    } else if (num < 0) {
      el.textContent = `${num}%`;
      el.className = 'stat-change negative';
    } else {
      el.textContent = '0%';
      el.className = 'stat-change';
    }
  }

  function avgChange(a, b) {
    return Math.round((a + b) / 2);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: '#1c1c27',
      color: '#e8e8ed',
      border: '1px solid #2a2a3a',
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '0.92rem',
      fontWeight: '500',
      zIndex: '1000',
      animation: 'fadeIn 0.3s ease',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    });
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // ---- Init ----
  loadData();
})();
