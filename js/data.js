/**
 * data.js — Data layer for the YT Shorts Dashboard
 *
 * Provides demo data and helpers. Replace generateDemoData() with
 * real YouTube Data API v3 calls when an API key is configured.
 */

const DashboardData = (() => {
  // ---- Helpers ----
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  }

  function formatDate(date) {
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function formatDateShort(date) {
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  }

  function formatNumber(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toLocaleString('de-DE');
  }

  function formatPercent(n) {
    return n.toFixed(1) + '%';
  }

  // ---- Short titles ----
  const shortTitlesCh1 = [
    'Krasser Trick den NIEMAND kennt',
    'Warte bis zum Ende... 😱',
    'Das passiert wenn du DAS machst',
    'POV: Du entdeckst diesen Hack',
    'Dieser Moment wenn...',
    'Ich hab das NICHT erwartet',
    'Warum macht das niemand?!',
    '3 Sekunden die ALLES verändern',
    'Teil 2 von dem viralen Video',
    'Das krasseste was ich je gesehen hab',
    'Folge für mehr Tipps! 🔥',
    'Dieses Geheimnis kennt fast niemand',
    'Reagiere auf mein letztes Video',
    'Ich zeig euch was Besonderes',
    'Das glaubt mir keiner aber...',
  ];

  const shortTitlesCh2 = [
    'Tutorial: So geht es RICHTIG',
    'Anfänger vs. Profi Vergleich',
    'Top 5 Fehler die JEDER macht',
    'In 30 Sekunden erklärt',
    'Diese Technik ist WILD',
    'Warum du das falsch machst',
    'Quick Tipp des Tages ✨',
    'Vorher vs. Nachher Ergebnis',
    'So habe ich es geschafft',
    'Das ist der Unterschied',
    'Hättest du das gewusst?',
    'Mein Geheimtipp für euch',
    'Der einfachste Weg zu...',
    'Schau dir das Ergebnis an!',
    'Noch ein genialer Trick',
  ];

  // ---- Demo data generation ----
  function generateShorts(titles, channelKey, dayRange) {
    const count = randomInt(Math.floor(dayRange / 3), Math.floor(dayRange / 1.5));
    const shorts = [];

    for (let i = 0; i < count; i++) {
      const day = randomInt(0, dayRange - 1);
      const date = daysAgo(day);
      const views = randomInt(800, 520_000);
      const likeRate = (Math.random() * 6 + 2) / 100; // 2–8%
      const commentRate = (Math.random() * 1.5 + 0.1) / 100; // 0.1–1.6%
      const likes = Math.round(views * likeRate);
      const comments = Math.round(views * commentRate);

      shorts.push({
        id: `${channelKey}-${i}`,
        title: titles[i % titles.length],
        channel: channelKey,
        views,
        likes,
        comments,
        likeRate: likeRate * 100,
        engagement: ((likes + comments) / views) * 100,
        date,
        dateStr: formatDate(date),
        dayOfWeek: date.getDay(),
        hour: randomInt(8, 22),
      });
    }

    shorts.sort((a, b) => b.date - a.date);
    return shorts;
  }

  function generateDemoData(dayRange = 30) {
    const ch1Shorts = generateShorts(shortTitlesCh1, 'ch1', dayRange);
    const ch2Shorts = generateShorts(shortTitlesCh2, 'ch2', dayRange);

    const ch1 = buildChannelStats(ch1Shorts, dayRange);
    const ch2 = buildChannelStats(ch2Shorts, dayRange);

    return {
      channel1: {
        name: 'MeinKanal',
        description: 'Entertainment & Lifestyle Shorts',
        initials: 'MK',
        ...ch1,
      },
      channel2: {
        name: 'TechTipps',
        description: 'Tutorials & Tech-Tricks',
        initials: 'TT',
        ...ch2,
      },
      dayRange,
    };
  }

  function buildChannelStats(shorts, dayRange) {
    const totalViews = shorts.reduce((s, v) => s + v.views, 0);
    const totalLikes = shorts.reduce((s, v) => s + v.likes, 0);
    const totalComments = shorts.reduce((s, v) => s + v.comments, 0);
    const avgEngagement = shorts.length > 0
      ? shorts.reduce((s, v) => s + v.engagement, 0) / shorts.length
      : 0;
    const newSubs = Math.round(totalViews * (Math.random() * 0.005 + 0.001));

    // Daily views for the chart
    const dailyViews = [];
    const dailyLabels = [];
    for (let i = dayRange - 1; i >= 0; i--) {
      const day = daysAgo(i);
      dailyLabels.push(formatDateShort(day));
      const dayViews = shorts
        .filter(s => s.date.toDateString() === day.toDateString())
        .reduce((s, v) => s + v.views, 0);
      dailyViews.push(dayViews);
    }

    // Upload hours histogram
    const hourCounts = new Array(24).fill(0);
    shorts.forEach(s => { hourCounts[s.hour]++; });

    // Change values (simulated)
    const changeViews = randomInt(-15, 40);
    const changeLikes = randomInt(-10, 35);
    const changeComments = randomInt(-12, 30);
    const changeSubs = randomInt(-5, 50);
    const changeEngagement = (Math.random() * 4 - 1).toFixed(1);

    return {
      shorts,
      totalViews,
      totalLikes,
      totalComments,
      avgEngagement,
      newSubs,
      dailyViews,
      dailyLabels,
      hourCounts,
      changes: {
        views: changeViews,
        likes: changeLikes,
        comments: changeComments,
        subs: changeSubs,
        engagement: parseFloat(changeEngagement),
      },
    };
  }

  // ---- Settings persistence ----
  function loadSettings() {
    try {
      const raw = localStorage.getItem('yt-shorts-settings');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveSettings(settings) {
    localStorage.setItem('yt-shorts-settings', JSON.stringify(settings));
  }

  function clearSettings() {
    localStorage.removeItem('yt-shorts-settings');
  }

  // ---- Public API ----
  return {
    generateDemoData,
    loadSettings,
    saveSettings,
    clearSettings,
    formatNumber,
    formatPercent,
    formatDate,
    formatDateShort,
  };
})();
