const fs = require('fs');
let masterplan = fs.readFileSync('MASTERPLAN.md', 'utf8');

if (!masterplan.includes('Cron Run Summary: Auth.js JWT callback')) {
  masterplan += '\n\n## Cron Run Summary: Auth.js JWT callback optimization\n';
  masterplan += '- Implemented `trigger === "update"` logic in NextAuth JWT callback to ensure profile changes refresh session data without requiring redundant DB calls.\n';
  masterplan += '- Verified build succeeds with correct DATABASE_URL.\n';
  fs.writeFileSync('MASTERPLAN.md', masterplan);
}
