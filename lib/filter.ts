export function checkToxicity(content: string): boolean {
  if (!content) return false;

  const toxicWords = [
    '바보',
    '멍청이',
    '새끼',
    'spam',
    'fuck',
    'shit',
    '씨발',
    '존나',
    '개새끼',
    '죽어'
  ];

  const lowerContent = content.toLowerCase();

  for (const word of toxicWords) {
    if (lowerContent.includes(word.toLowerCase())) {
      return true;
    }
  }

  return false;
}
