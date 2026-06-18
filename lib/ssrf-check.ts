import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

function isPrivateIP(ip: string): boolean {
  const parts = ip.split('.').map(p => parseInt(p, 10));
  if (parts.length !== 4) return false;

  return (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168) ||
    parts[0] === 127 ||
    parts[0] === 0 ||
    parts[0] === 169 && parts[1] === 254 // Link-local
  );
}

export async function checkSSRF(urlStr: string): Promise<boolean> {
  try {
    const url = new URL(urlStr);
    
    // Block non-HTTP/HTTPS schemas
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    // Resolve DNS
    const { address } = await lookup(url.hostname);

    if (isPrivateIP(address)) {
      return false;
    }

    return true;
  } catch (_error) {
    return false;
  }
}
