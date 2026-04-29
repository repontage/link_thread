const fs = require('fs');
const path = './MASTERPLAN.md';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /## Phase 8: Profile Customization & User Mentions & Easy Auth \(Next\)\n- \[ \] \*\*Easy Auth\*\*: 모바일 및 크로스 플랫폼\(iOS\/Android\) 호환성을 위해 로그인 방식을 개선. Passkey 외에 이메일 매직 링크\(Email Provider\) 또는 구글 로그인\(OAuth\) 수단을 추가 도입.\n- \[ \] \*\*Profile Customization\*\*: 프로필 이미지, 닉네임, 상태 메시지 등 커스텀 편집 기능 추가.\n- \[ \] \*\*User Mentions\*\*: 댓글 입력 시 \`@username\` 형태로 다른 유저를 멘션하는 기능 및 알림 센터\(Notification Center\) 연동./,
  `## Phase 8: Profile Customization & User Mentions & Easy Auth (Completed)
- [x] **Easy Auth**: 모바일 및 크로스 플랫폼(iOS/Android) 호환성을 위해 로그인 방식을 개선. Google 및 GitHub OAuth 로그인 수단 추가 도입 완료.
- [x] **Profile Customization**: 프로필 이미지(URL), 닉네임, 상태 메시지 편집이 가능한 ProfileEditForm 기능 및 /api/profile 추가 완료.
- [x] **User Mentions**: 댓글 입력 시 \`@username\` 형태로 다른 유저 멘션 시 Notification 자동 생성 및 화면 내 하이퍼링크 처리 완료. 댓글 답글 및 좋아요 알림 생성 로직 포함.`
);

// Add Phase 9
content += `

## Phase 9: Admin Dashboard & Global Moderation (Next)
- [ ] **Admin Roles & Dashboard**: 관리자 권한(Role) 스키마 추가, /admin 페이지에서 전체 댓글 관리, 유저 차단 및 통계 모니터링 뷰어 기능.
- [ ] **Report System**: 유저들이 유해한 댓글이나 스팸을 신고할 수 있는 기능 및 관리자 페이지 연동.
- [ ] **SEO & Metadata Optimization**: Dynamic OpenGraph tags, sitemap.xml, robots.txt 추가를 통한 검색 최적화.`;

fs.writeFileSync(path, content);
