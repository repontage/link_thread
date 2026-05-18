(function() {
  const scriptTag = document.currentScript;
  const container = document.createElement('div');
  container.id = 'voidsay-widget-container';
  container.style.width = '100%';
  container.style.minHeight = '400px';
  container.style.border = '1px solid #eaeaea';
  container.style.borderRadius = '8px';
  container.style.overflow = 'hidden';

  const iframe = document.createElement('iframe');
  const currentUrl = encodeURIComponent(window.location.href);
  iframe.src = `https://voidsay.com/embed?url=${currentUrl}`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  container.appendChild(iframe);
  scriptTag.parentNode.insertBefore(container, scriptTag);
})();
