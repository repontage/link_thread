const fs = require('fs');
const path = './components/CommentItem.tsx';
let code = fs.readFileSync(path, 'utf8');

const renderContentReplacement = `  const renderContent = (content: string) => {
    // 멘션 파싱 정규식
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const timestampRegex = /\\b(?:(\\d{1,2}):)?(\\d{1,2}):(\\d{2})\\b/g;
    
    // 단순화를 위해 먼저 멘션부터 처리, 그 다음 타임스탬프 처리하는 방식으로 개선
    const parts = [];
    let lastIndex = 0;
    
    // 타임스탬프와 멘션을 한 번에 처리하기 위한 조합된 정규식
    const combinedRegex = /(@[a-zA-Z0-9_]+)|\\b(?:(\\d{1,2}):)?(\\d{1,2}):(\\d{2})\\b/g;
    
    let match;
    while ((match = combinedRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      
      if (match[1]) {
        // Mention match (@username)
        const username = match[1].substring(1);
        parts.push(
          <Link key={\`mention-\${match.index}\`} href={\`/users?username=\${username}\`} className="text-blue-500 font-medium hover:underline">
            {match[1]}
          </Link>
        );
      } else {
        // Timestamp match
        const timestamp = match[0];
        const hrs = match[2] ? parseInt(match[2], 10) : 0;
        const mins = parseInt(match[3], 10);
        const secs = parseInt(match[4], 10);
        const totalSeconds = hrs * 3600 + mins * 60 + secs;

        parts.push(
          <span
            key={\`time-\${match.index}\`}
            className="text-blue-500 hover:underline cursor-pointer font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onTimestampClick?.(totalSeconds);
            }}
          >
            {timestamp}
          </span>
        );
      }
      lastIndex = combinedRegex.lastIndex;
    }
    
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };
`;

code = code.replace(/  const renderContent = \(content: string\) => \{[\s\S]*?return parts\.length > 0 \? parts : content;\n  \};\n/, renderContentReplacement + '\n');

fs.writeFileSync(path, code);
