/**
 * charts.js — Chart configuration and rendering for the dashboard
 */

const DashboardCharts = (() => {
  const instances = {};

  Chart.defaults.color = '#8f8fa3';
  Chart.defaults.borderColor = 'rgba(42, 42, 58, 0.6)';
  Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyleWidth = 8;
  Chart.defaults.plugins.legend.labels.padding = 16;
  Chart.defaults.plugins.tooltip.backgroundColor = '#1c1c27';
  Chart.defaults.plugins.tooltip.borderColor = '#2a2a3a';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.titleFont = { weight: '600' };
  Chart.defaults.elements.point.radius = 3;
  Chart.defaults.elements.point.hoverRadius = 5;

  const gridColor = 'rgba(42, 42, 58, 0.4)';

  function destroy(id) {
    if (instances[id]) {
      instances[id].destroy();
      delete instances[id];
    }
  }

  function destroyAll() {
    Object.keys(instances).forEach(destroy);
  }

  function lineDefaults() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        y: { beginAtZero: true, grid: { color: gridColor }, ticks: { callback: v => DashboardData.formatNumber(v) } },
        x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
      },
    };
  }

  // ---- Overview: Views Comparison ----
  function renderOverviewViews(data) {
    destroy('overviewViews');
    const ctx = document.getElementById('overviewViewsChart');
    if (!ctx) return;

    instances.overviewViews = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.channel1.dailyLabels,
        datasets: [
          {
            label: data.channel1.name,
            data: data.channel1.dailyViews,
            borderColor: '#ff4444',
            backgroundColor: 'rgba(255, 68, 68, 0.08)',
            fill: true, tension: 0.4, borderWidth: 2,
          },
          {
            label: data.channel2.name,
            data: data.channel2.dailyViews,
            borderColor: '#4488ff',
            backgroundColor: 'rgba(68, 136, 255, 0.08)',
            fill: true, tension: 0.4, borderWidth: 2,
          },
        ],
      },
      options: {
        ...lineDefaults(),
        plugins: {
          tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${DashboardData.formatNumber(ctx.raw)} Views` } },
        },
      },
    });
  }

  // ---- Overview: Follower Growth Comparison ----
  function renderOverviewFollowers(data) {
    destroy('overviewFollowers');
    const ctx = document.getElementById('overviewFollowersChart');
    if (!ctx) return;

    instances.overviewFollowers = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.channel1.dailyLabels,
        datasets: [
          {
            label: data.channel1.name,
            data: data.channel1.dailySubs,
            borderColor: '#ff4444',
            backgroundColor: 'rgba(255, 68, 68, 0.06)',
            fill: true, tension: 0.4, borderWidth: 2,
          },
          {
            label: data.channel2.name,
            data: data.channel2.dailySubs,
            borderColor: '#4488ff',
            backgroundColor: 'rgba(68, 136, 255, 0.06)',
            fill: true, tension: 0.4, borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: { grid: { color: gridColor }, ticks: { callback: v => DashboardData.formatNumber(v) } },
          x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
        },
        plugins: {
          tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${DashboardData.formatNumber(ctx.raw)} Abonnenten` } },
        },
      },
    });
  }

  // ---- Overview: Watchtime Comparison ----
  function renderOverviewWatchtime(data) {
    destroy('overviewWatchtime');
    const ctx = document.getElementById('overviewWatchtimeChart');
    if (!ctx) return;

    instances.overviewWatchtime = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.channel1.dailyLabels,
        datasets: [
          {
            label: data.channel1.name,
            data: data.channel1.dailyWatchTime,
            backgroundColor: 'rgba(255, 68, 68, 0.6)',
            borderRadius: 4,
          },
          {
            label: data.channel2.name,
            data: data.channel2.dailyWatchTime,
            backgroundColor: 'rgba(68, 136, 255, 0.6)',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: { beginAtZero: true, stacked: true, grid: { color: gridColor }, ticks: { callback: v => v + ' Std' } },
          x: { stacked: true, grid: { display: false }, ticks: { maxTicksLimit: 10 } },
        },
        plugins: {
          tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw} Std` } },
        },
      },
    });
  }

  // ---- Overview: Engagement Comparison ----
  function renderOverviewEngagement(data) {
    destroy('overviewEngagement');
    const ctx = document.getElementById('overviewEngagementChart');
    if (!ctx) return;

    instances.overviewEngagement = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Views', 'Likes', 'Kommentare'],
        datasets: [
          {
            label: data.channel1.name,
            data: [data.channel1.totalViews, data.channel1.totalLikes, data.channel1.totalComments],
            backgroundColor: 'rgba(255, 68, 68, 0.7)',
            borderRadius: 6,
          },
          {
            label: data.channel2.name,
            data: [data.channel2.totalViews, data.channel2.totalLikes, data.channel2.totalComments],
            backgroundColor: 'rgba(68, 136, 255, 0.7)',
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: gridColor }, ticks: { callback: v => DashboardData.formatNumber(v) } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  // ---- Overview: Views Distribution ----
  function renderOverviewDistribution(data) {
    destroy('overviewDistribution');
    const ctx = document.getElementById('overviewDistributionChart');
    if (!ctx) return;

    instances.overviewDistribution = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [data.channel1.name, data.channel2.name],
        datasets: [{
          data: [data.channel1.totalViews, data.channel2.totalViews],
          backgroundColor: ['rgba(255, 68, 68, 0.8)', 'rgba(68, 136, 255, 0.8)'],
          borderWidth: 0, hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: ctx => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = ((ctx.raw / total) * 100).toFixed(1);
                return `${ctx.label}: ${DashboardData.formatNumber(ctx.raw)} Views (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }

  // ---- Channel: Views over Time ----
  function renderChannelViews(prefix, channelData, color) {
    const id = `${prefix}Views`;
    destroy(id);
    const ctx = document.getElementById(`${prefix}ViewsChart`);
    if (!ctx) return;

    instances[id] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: channelData.dailyLabels,
        datasets: [{
          label: 'Views',
          data: channelData.dailyViews,
          borderColor: color,
          backgroundColor: color.replace(')', ', 0.1)').replace('rgb', 'rgba'),
          fill: true, tension: 0.4, borderWidth: 2,
        }],
      },
      options: lineDefaults(),
    });
  }

  // ---- Channel: Follower Growth ----
  function renderChannelFollowers(prefix, channelData, color) {
    const id = `${prefix}Followers`;
    destroy(id);
    const ctx = document.getElementById(`${prefix}FollowersChart`);
    if (!ctx) return;

    instances[id] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: channelData.dailyLabels,
        datasets: [{
          label: 'Abonnenten',
          data: channelData.dailySubs,
          borderColor: color,
          backgroundColor: color.replace(')', ', 0.08)').replace('rgb', 'rgba'),
          fill: true, tension: 0.3, borderWidth: 2,
          pointBackgroundColor: color,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { grid: { color: gridColor }, ticks: { callback: v => DashboardData.formatNumber(v) } },
          x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
        },
        plugins: {
          tooltip: { callbacks: { label: ctx => `Abonnenten: ${DashboardData.formatNumber(ctx.raw)}` } },
        },
      },
    });
  }

  // ---- Channel: Watchtime ----
  function renderChannelWatchtime(prefix, channelData, color) {
    const id = `${prefix}Watchtime`;
    destroy(id);
    const ctx = document.getElementById(`${prefix}WatchtimeChart`);
    if (!ctx) return;

    instances[id] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: channelData.dailyLabels,
        datasets: [{
          label: 'Watchtime (Std)',
          data: channelData.dailyWatchTime,
          backgroundColor: color,
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: gridColor }, ticks: { callback: v => v + ' Std' } },
          x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
        },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => `Watchtime: ${ctx.raw} Std` } },
        },
      },
    });
  }

  // ---- Channel: Likes vs Comments ----
  function renderChannelEngagement(prefix, channelData, color1, color2) {
    const id = `${prefix}Engagement`;
    destroy(id);
    const ctx = document.getElementById(`${prefix}EngagementChart`);
    if (!ctx) return;

    const days = channelData.dailyLabels;
    const likesPerDay = new Array(days.length).fill(0);
    const commentsPerDay = new Array(days.length).fill(0);

    channelData.shorts.forEach(s => {
      const label = DashboardData.formatDateShort(s.date);
      const idx = days.indexOf(label);
      if (idx >= 0) {
        likesPerDay[idx] += s.likes;
        commentsPerDay[idx] += s.comments;
      }
    });

    instances[id] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: days,
        datasets: [
          { label: 'Likes', data: likesPerDay, backgroundColor: color1, borderRadius: 4 },
          { label: 'Kommentare', data: commentsPerDay, backgroundColor: color2, borderRadius: 4 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, stacked: true, grid: { color: gridColor }, ticks: { callback: v => DashboardData.formatNumber(v) } },
          x: { stacked: true, grid: { display: false }, ticks: { maxTicksLimit: 10 } },
        },
      },
    });
  }

  // ---- Channel: Upload Times ----
  function renderChannelTimes(prefix, channelData, color) {
    const id = `${prefix}Times`;
    destroy(id);
    const ctx = document.getElementById(`${prefix}TimesChart`);
    if (!ctx) return;

    const labels = [];
    const values = [];
    for (let h = 6; h <= 23; h++) {
      labels.push(`${h}:00`);
      values.push(channelData.hourCounts[h]);
    }

    instances[id] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: 'Uploads', data: values, backgroundColor: color, borderRadius: 4 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: gridColor }, ticks: { stepSize: 1 } },
          x: { grid: { display: false } },
        },
        plugins: { legend: { display: false } },
      },
    });
  }

  // ---- Channel: Views per Short ----
  function renderChannelPerVideo(prefix, channelData, color) {
    const id = `${prefix}PerVideo`;
    destroy(id);
    const ctx = document.getElementById(`${prefix}PerVideoChart`);
    if (!ctx) return;

    const sorted = [...channelData.shorts].sort((a, b) => b.views - a.views);
    const top = sorted.slice(0, 15);

    instances[id] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: top.map(s => s.title.length > 25 ? s.title.slice(0, 25) + '...' : s.title),
        datasets: [{
          label: 'Views',
          data: top.map(s => s.views),
          backgroundColor: top.map((_, i) => {
            const opacity = 0.9 - (i * 0.04);
            return color.replace('0.7', String(opacity));
          }),
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: { beginAtZero: true, grid: { color: gridColor }, ticks: { callback: v => DashboardData.formatNumber(v) } },
          y: { grid: { display: false }, ticks: { font: { size: 11 } } },
        },
        plugins: { legend: { display: false } },
      },
    });
  }

  // ---- Composite renderers ----

  function renderOverview(data) {
    renderOverviewViews(data);
    renderOverviewFollowers(data);
    renderOverviewWatchtime(data);
    renderOverviewEngagement(data);
    renderOverviewDistribution(data);
  }

  function renderChannel(prefix, channelData, colors) {
    renderChannelViews(prefix, channelData, colors.main);
    renderChannelFollowers(prefix, channelData, colors.main);
    renderChannelWatchtime(prefix, channelData, colors.bar);
    renderChannelEngagement(prefix, channelData, colors.likes, colors.comments);
    renderChannelTimes(prefix, channelData, colors.bar);
    renderChannelPerVideo(prefix, channelData, colors.bar);
  }

  return {
    renderOverview,
    renderChannel,
    destroyAll,
  };
})();
