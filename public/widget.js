(function() {
  const scriptTag = document.currentScript;
  const targetUrl = scriptTag.getAttribute('data-url') || window.location.href;
  const containerId = scriptTag.getAttribute('data-container') || 'voidsay-widget';
  
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);
  }

  const iframe = document.createElement('iframe');
  iframe.src = `https://voidsay.com/embed?url=${encodeURIComponent(targetUrl)}`;
  iframe.style.width = '100%';
  iframe.style.height = '400px';
  iframe.style.border = '1px solid #e5e7eb';
  iframe.style.borderRadius = '8px';
  
  container.appendChild(iframe);
})();