(function() {
  var scriptTag = document.currentScript;
  var container = document.createElement('div');
  container.id = 'voidsay-widget-container';
  container.style.width = '100%';
  container.style.maxWidth = '800px';
  container.style.margin = '20px 0';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  // Iframe for comments
  var iframe = document.createElement('iframe');
  var currentUrl = encodeURIComponent(window.location.href);
  iframe.src = 'https://voidsay.com/embed?url=' + currentUrl;
  iframe.style.width = '100%';
  iframe.style.height = '400px';
  iframe.style.border = '1px solid rgba(255,255,255,0.08)';
  iframe.style.borderRadius = '8px';
  iframe.style.background = '#1a1a2e';
  iframe.title = 'VoidSay Comments';
  iframe.setAttribute('loading', 'lazy');

  // "Powered by VoidSay" badge
  var badge = document.createElement('div');
  badge.style.textAlign = 'center';
  badge.style.padding = '6px 0';
  badge.style.fontSize = '12px';
  badge.style.color = '#94a3b8';
  badge.innerHTML = 'Powered by <a href="https://voidsay.com" target="_blank" rel="noopener" style="color: #0066cc; text-decoration: none; font-weight: 600;">VoidSay</a> — Universal, Ad-Free Commenting';

  container.appendChild(iframe);
  container.appendChild(badge);
  scriptTag.parentNode.insertBefore(container, scriptTag);
})();
