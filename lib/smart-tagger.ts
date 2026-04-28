export function generateTags(content: string): string[] {
  if (!content) return [];
  const lower = content.toLowerCase();
  const tags: string[] = [];

  if (lower.includes('nextjs') || lower.includes('react') || lower.includes('개발') || lower.includes('tech')) {
    tags.push('#tech');
  }
  if (lower.includes('뉴스') || lower.includes('소식') || lower.includes('news')) {
    tags.push('#news');
  }
  if (lower.includes('질문') || lower.includes('help') || lower.includes('qna')) {
    tags.push('#qna');
  }

  return tags;
}
