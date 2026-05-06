import { normalizeUrl, getThreadId } from './lib/url-parser';
try {
  const url = "https://voidsay.com/";
  console.log("normalized:", normalizeUrl(url));
  console.log("threadId:", getThreadId(url));
} catch (e) {
  console.error("Error:", e);
}
