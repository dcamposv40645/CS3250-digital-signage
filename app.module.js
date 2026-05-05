// helper functions pulled out of app.js so jest can test them

function escapeHtml(str) {
    return str
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
  
  function getWeatherSymbol(code) {
    if (code === 0)                return '☀️ Clear';
    if (code === 1)                return '🌤️ Mostly Clear';
    if (code === 2)                return '⛅️ Partly Cloudy';
    if (code === 3)                return '☁️ Overcast';
    if (code >= 45 && code <= 48) return '🌫️ Foggy';
    if (code >= 51 && code <= 55) return '🌦️ Drizzle';
    if (code >= 61 && code <= 65) return '🌧️ Rainy';
    if (code >= 71 && code <= 77) return '❄️ Snowy';
    if (code >= 80 && code <= 82) return '🌧️ Showers';
    if (code >= 85 && code <= 86) return '🌨️ Snow Showers';
    if (code >= 95 && code <= 99) return '⛈️ Thunderstorm';
    return '🌡️ Unknown';
  }
  
  function getValuePath(obj, path) {
    return path.split('.').reduce(
      (current, key) => current && typeof current === 'object' ? current[key] : undefined,
      obj
    );
  }
  
  function stripHtml(html) {
    const d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent || d.innerText || '';
  }
  
  function parseConfig(configArray) {
    const cycleTime = configArray[0].cycle;
    const allItems = configArray.slice(1);
    const rssItems = allItems.filter((item) => item.type === 'RSS');
    const staticItems = allItems.filter((item) => item.type !== 'RSS');
  
    const staticCycles = staticItems
      .map((item) => Number(item.cycle))
      .filter((value) => Number.isFinite(value) && value > 0);
    const staticRefreshTime = staticCycles.length ? Math.min(...staticCycles) : 60;
  
    return { cycleTime, rssItems, staticItems, staticRefreshTime };
  }
  
  function buildRssHtml(feedData, maxItems) {
    if (feedData.status !== 'ok' || !feedData.items?.length) {
      return '<div><h1>Feed Unavailable</h1><p>' + (feedData.message || 'No items found.') + '</p></div>';
    }
  
    const items = feedData.items.slice(0, maxItems);
    let html = '<div class="article-feed">';
  
    items.forEach((item, i) => {
      const decoded = item.title
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>');
      const desc = item.description
        ? stripHtml(item.description).substring(0, 300) + '...'
        : '';
      const date = item.pubDate
        ? new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : '';
  
      html += `
        <div class="article-card" style="display: ${i === 0 ? 'flex' : 'none'}" data-index="${i}">
          <div class="article-source">${escapeHtml(feedData.feed.title)} <span class="article-date">${date}</span></div>
          <h1 class="article-title">${escapeHtml(decoded)}</h1>
          <div class="article-divider"></div>
          <p class="article-desc">${escapeHtml(desc)}</p>
          <div class="article-num">${i + 1} / ${items.length}</div>
        </div>
      `;
    });
  
    html += '</div>';
    return html;
  }
  
  module.exports = {
    escapeHtml,
    getWeatherSymbol,
    getValuePath,
    stripHtml,
    parseConfig,
    buildRssHtml,
  };