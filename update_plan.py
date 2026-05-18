import re

with open('MASTERPLAN.md', 'r') as f:
    content = f.read()

new_log = """- **2026-05-18**: (Scheduled Cron) 긴급 점검 수행. Voidsay 운영 서버(https://voidsay.com/)의 푸터 디자인 제거 및 버튼 인터랙션(`window.scrollY` 이동) 정상 작동 여부를 브라우저를 통해 검증 완료. 두 항목 모두 정상 동작(Footer 제거됨, Get Started 버튼 클릭 시 스크롤 이동 확인)하므로 강제 재배포 로직은 우회함. Phase 16의 일환으로 Embeddable Widget (`public/widget.js`) 스크립트를 추가하여 외부 사이트 통합 기반 마련. `npm run lint` 및 빌드 확인.
"""

content = re.sub(r'(- \*\*2026-05-18\*\*: \(Scheduled Cron\) 긴급 점검 수행.*?)\n', new_log, content, count=1)

with open('MASTERPLAN.md', 'w') as f:
    f.write(content)
