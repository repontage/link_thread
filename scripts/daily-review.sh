#!/bin/bash
# ===========================================================
# Daily Code Review — READ-ONLY (소스 코드 절대 안 건드림)
# 1순위: 보안 | 2순위: 버그
# 출력: review/ 폴더에 마크다운 보고서
# ===========================================================

PROJECT_DIR="/Users/seonghoonjung/workspace/link-thread-project"
REVIEW_DIR="$PROJECT_DIR/review"
DATE=$(date +"%Y-%m-%d")
REPORT="$REVIEW_DIR/review_${DATE}.md"

mkdir -p "$REVIEW_DIR"
cd "$PROJECT_DIR" || exit 1

TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

# 소스 파일만 수집 (node_modules, .git, dist, build, review, scripts 제외)
find . -type f \
    \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \
       -o -name "*.py" -o -name "*.java" -o -name "*.go" -o -name "*.rb" \
       -o -name "*.rs" -o -name "*.c" -o -name "*.cpp" -o -name "*.h" \
       -o -name "*.kt" -o -name "*.swift" -o -name "*.php" -o -name "*.cs" \
       -o -name "*.yaml" -o -name "*.yml" -o -name "*.json" \
       -o -name "*.xml" -o -name "*.sql" -o -name "*.env" \
       -o -name "Dockerfile*" -o -name "*.toml" \) \
    -not -path "./node_modules/*" -not -path "./.git/*" \
    -not -path "./dist/*" -not -path "./build/*" \
    -not -path "./.next/*" -not -path "./.venv/*" \
    -not -path "./__pycache__/*" -not -path "./review/*" \
    -not -path "./scripts/*" 2>/dev/null > "$TMP_DIR/files.txt"

TOTAL_FILES=$(wc -l < "$TMP_DIR/files.txt" | tr -d ' ')

# === 헤더 ===
cat > "$REPORT" <<EOF
# Daily Code Review Report

**Date:** $(date +"%Y-%m-%d %H:%M:%S %Z")
**Project:** link-thread-project
**Files Scanned:** $TOTAL_FILES
**Rule:** Read-only analysis — source code NOT modified

---

## Summary

| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Security | 0 | 0 | 0 | 0 |
| Bugs | 0 | 0 | 0 | 0 |

---

EOF

# ======================================================
# 1순위: 보안 평가
# ======================================================
{
echo "# 1. Security Assessment"
echo ""

SEC_CRIT=0
SEC_HIGH=0
SEC_MED=0
SEC_LOW=0

## 1-1: 하드코딩된 시크릿
echo "### 1-1. Hardcoded Secrets & Credentials"
echo ""
xargs grep -nHiE \
    '(password|secret|api[_-]?key|token|auth)\s*[=:]\s*["'"'"'][^"'"'"']{4,}["'"'"']' \
    < "$TMP_DIR/files.txt" 2>/dev/null \
    | grep -viE '(example|placeholder|dummy|test_|\.env\.template|README)' \
    > "$TMP_DIR/sec1.txt"

if [ -s "$TMP_DIR/sec1.txt" ]; then
  CNT=$(wc -l < "$TMP_DIR/sec1.txt" | tr -d ' ')
  SEC_HIGH=$((SEC_HIGH + CNT))
  while IFS= read -r line; do
    FPATH=$(echo "$line" | cut -d: -f1)
    LNUM=$(echo "$line" | cut -d: -f2)
    echo "- **HIGH** \`${FPATH}:${LNUM}\`"
  done < "$TMP_DIR/sec1.txt"
  echo "- 환경변수 또는 시크릿 관리 도구로 이동 필요."
else
  echo "- ✅ 하드코딩된 시크릿 발견 안 됨."
fi
echo ""

## 1-2: eval / exec / 코드 실행
echo "### 1-2. Dangerous Exec Functions (eval, exec, system)"
echo ""
xargs grep -nH \
    -E '(eval\(|exec\(|system\(|shell_exec|os\.system|subprocess\.(call|run|Popen)|child_process\.exec)' \
    < "$TMP_DIR/files.txt" 2>/dev/null \
    | grep -vE '(test_|spec\.|node_modules)' \
    > "$TMP_DIR/sec2.txt"

if [ -s "$TMP_DIR/sec2.txt" ]; then
  CNT=$(wc -l < "$TMP_DIR/sec2.txt" | tr -d ' ')
  SEC_CRIT=$((SEC_CRIT + CNT))
  while IFS= read -r line; do
    FPATH=$(echo "$line" | cut -d: -f1)
    LNUM=$(echo "$line" | cut -d: -f2)
    echo "- **CRITICAL** \`${FPATH}:${LNUM}\`"
  done < "$TMP_DIR/sec2.txt"
  echo "- 코드 주입 위험. 사용자 입력 검증 필요."
else
  echo "- ✅ 발견 안 됨."
fi
echo ""

## 1-3: SQL Injection
echo "### 1-3. SQL Injection Risks"
echo ""
xargs grep -nH \
    -E '(\$\{.*\}.*SELECT|\$\{.*\}.*INSERT|\$\{.*\}.*UPDATE|\$\{.*\}.*DELETE|query\(".*%[ds]|execute\(".*\+)' \
    < "$TMP_DIR/files.txt" 2>/dev/null \
    | grep -vE '(prepared|parametrized|node_modules)' \
    > "$TMP_DIR/sec3.txt"

if [ -s "$TMP_DIR/sec3.txt" ]; then
  CNT=$(wc -l < "$TMP_DIR/sec3.txt" | tr -d ' ')
  SEC_CRIT=$((SEC_CRIT + CNT))
  while IFS= read -r line; do
    FPATH=$(echo "$line" | cut -d: -f1)
    LNUM=$(echo "$line" | cut -d: -f2)
    echo "- **CRITICAL** \`${FPATH}:${LNUM}\`"
  done < "$TMP_DIR/sec3.txt"
  echo "- Prepared statement 또는 ORM 사용 권장."
else
  echo "- ✅ SQL 인젝션 위험 발견 안 됨."
fi
echo ""

## 1-4: SSRF
echo "### 1-4. SSRF Risks (User-Controlled External Calls)"
echo ""
xargs grep -nH \
    -E '(fetch\(|axios\.|requests\.(get|post)|http\.(get|Client)|URL\.openConnection)' \
    < "$TMP_DIR/files.txt" 2>/dev/null \
    | grep -vE '(test_|spec\.|node_modules|example\.com)' \
    > "$TMP_DIR/sec4.txt"

if [ -s "$TMP_DIR/sec4.txt" ]; then
  CNT=$(wc -l < "$TMP_DIR/sec4.txt" | tr -d ' ')
  SEC_MED=$((SEC_MED + CNT))
  echo "- \`$CNT\` potential external HTTP calls found"
  echo "- 사용자 입력으로 URL이 제어된다면 SSRF 취약성."
else
  echo "- ✅ 발견 안 됨."
fi
echo ""

## 1-5: 라우트 접근 제어 부재
echo "### 1-5. Routes Without Auth Guards"
echo ""
xargs grep -nH \
    -E '(app\.(get|post|put|delete|all)\(|router\.(get|post|put|delete)\()' \
    < "$TMP_DIR/files.txt" 2>/dev/null \
    | grep -vE '(auth|guard|login|protect|middleware|test_)' \
    > "$TMP_DIR/sec5.txt"

if [ -s "$TMP_DIR/sec5.txt" ]; then
  CNT=$(wc -l < "$TMP_DIR/sec5.txt" | tr -d ' ')
  echo "- \`$CNT\` routes without obvious auth guards"
  head -20 "$TMP_DIR/sec5.txt" | while IFS= read -r line; do
    FPATH=$(echo "$line" | cut -d: -f1)
    LNUM=$(echo "$line" | cut -d: -f2)
    echo "    - \`${FPATH}:${LNUM}\`"
  done
else
  echo "- ✅ 라우트 관련 패턴 발견 안 됨."
fi
echo ""

## 1-6: 민감 파일 노출
echo "### 1-6. Sensitive Files in Repo"
echo ""
find . -maxdepth 3 -type f \
    \( -name "*.env" -o -name "*.pem" -o -name "*.key" \
       -o -name "*.p12" -o -name "*.crt" \) \
    -not -path "./.git/*" -not -path "./review/*" \
    -not -name ".env.example" -not -name ".env.template" 2>/dev/null \
    > "$TMP_DIR/sec6.txt"

if [ -s "$TMP_DIR/sec6.txt" ]; then
  CNT=$(wc -l < "$TMP_DIR/sec6.txt" | tr -d ' ')
  SEC_CRIT=$((SEC_CRIT + CNT))
  while IFS= read -r file; do
    echo "- **CRITICAL** \`${file}\` — 코드 저장소에 민감 파일 있음. .gitignore 추가 필요."
  done < "$TMP_DIR/sec6.txt"
else
  echo "- ✅ 민감 파일 노출 안 됨."
fi
echo ""

## 1-7: .gitignore 점검
echo "### 1-7. .gitignore Review"
echo ""
if [ -f ".gitignore" ]; then
  if grep -qiE '(\.env|\.pem|\.key|\.secrets)' .gitignore 2>/dev/null; then
    echo "- ✅ 민감 파일 패턴이 .gitignore에 포함됨."
  else
    SEC_HIGH=$((SEC_HIGH + 1))
    echo "- **HIGH** .gitignore에 민감 파일 패턴 누락. 추가 권장:"
    echo "  \`\`\`"
    echo "  *.env"
    echo "  *.pem"
    echo "  *.key"
    echo "  \`\`\`"
  fi
else
  SEC_HIGH=$((SEC_HIGH + 1))
  echo "- **HIGH** .gitignore 파일 없음."
fi
echo ""

## 1-8: 의존성 보안 점검
echo "### 1-8. Dependency Vulnerabilities"
echo ""
if [ -f "package.json" ] && [ -f "package-lock.json" ]; then
  NPM_OUT=$(npm audit 2>&1 | head -30)
  if [ -n "$NPM_OUT" ]; then
    echo "\`\`\`"
    echo "$NPM_OUT"
    echo "\`\`\`"
  else
    echo "- ✅ npm audit에서 문제가 발견 안 됨."
  fi
elif [ -f "requirements.txt" ]; then
  echo "- ℹ️ pip-audit 도구 설치 필요 (pip install pip-audit)."
else
  echo "- ℹ️ 의존성 파일(package-lock.json 등)을 발견 못해 검사 못 함."
fi
echo ""

# === 보안 카운트 저장 ===
echo "$SEC_CRIT $SEC_HIGH $SEC_MED $SEC_LOW" > "$TMP_DIR/sec_counts.txt"

} >> "$REPORT"

# ======================================================
# 2순위: 버그 평가
# ======================================================
{
echo ""
echo "---"
echo ""
echo "# 2. Bug Assessment"
echo ""

BUG_CRIT=0
BUG_HIGH=0
BUG_MED=0
BUG_LOW=0

## 2-1: 에러 핸들링 누락
echo "### 2-1. Empty or Weak Error Handling"
echo ""
xargs grep -nH \
    -E '(catch\s*\(\)\s*\{?\s*\}|onError\s*=\s*\(\)\s*=>\s*\{|catch\s*\(e?\)\s*\{?\s*\})' \
    < "$TMP_DIR/files.txt" 2>/dev/null \
    | grep -vE '(console\.|logger|throw|test_|node_modules)' \
    > "$TMP_DIR/bug1.txt"

if [ -s "$TMP_DIR/bug1.txt" ]; then
  CNT=$(wc -l < "$TMP_DIR/bug1.txt" | tr -d ' ')
  BUG_MED=$((BUG_MED + CNT))
  while IFS= read -r line; do
    FPATH=$(echo "$line" | cut -d: -f1)
    LNUM=$(echo "$line" | cut -d: -f2)
    echo "- **MEDIUM** \`${FPATH}:${LNUM}\` — 빈 catch 블록."
  done < "$TMP_DIR/bug1.txt"
  echo "- 에러를 삼켜 디버깅을 어렵게 만듦. 로깅 또는 재던지기 권장."
else
  echo "- ✅ 빈 catch 블록 발견 안 됨."
fi
echo ""

## 2-2: 비동기 에러 미처리
echo "### 2-2. Unhandled Async Operations"
echo ""
xargs grep -nH \
    -E '(\.then\(|async\s+function|await\s+)' \
    < "$TMP_DIR/files.txt" 2>/dev/null \
    | grep -vE '(test_|spec\.|node_modules)' \
    > "$TMP_DIR/bug2.txt"

if [ -s "$TMP_DIR/bug2.txt" ]; then
  CNT=$(wc -l < "$TMP_DIR/bug2.txt" | tr -d ' ')
  echo "- \`$CNT\` async operations without visible error handling."
  head -20 "$TMP_DIR/bug2.txt" | while IFS= read -r line; do
    FPATH=$(echo "$line" | cut -d: -f1)
    LNUM=$(echo "$line" | cut -d: -f2)
    echo "    - \`${FPATH}:${LNUM}\`"
  done
  echo "- try/catch 또는 .catch() 패턴 확인 필요."
else
  echo "- ✅ 발견 안 됨."
fi
echo ""

## 2-3: 리소스 릭
echo "### 2-3. Potential Resource Leaks"
echo ""
xargs grep -nH \
    -E '(fs\.open\(|\.connect\(|\.listen\(|\.openConnection)' \
    < "$TMP_DIR/files.txt" 2>/dev/null \
    | grep -vE '(close|disconnect|end|destroy|finally|test_|node_modules)' \
    > "$TMP_DIR/bug3.txt"

if [ -s "$TMP_DIR/bug3.txt" ]; then
  CNT=$(wc -l < "$TMP_DIR/bug3.txt" | tr -d ' ')
  BUG_HIGH=$((BUG_HIGH + CNT))
  while IFS= read -r line; do
    FPATH=$(echo "$line" | cut -d: -f1)
    LNUM=$(echo "$line" | cut -d: -f2)
    echo "- **HIGH** \`${FPATH}:${LNUM}\` — 리소스 해제 누락 의심."
  done < "$TMP_DIR/bug3.txt"
else
  echo "- ✅ 발견 안 됨."
fi
echo ""

## 2-4: 타입 우회
echo "### 2-4. Type Safety Bypasses"
echo ""
xargs grep -nH \
    -E '(\.any\(|: any\b|@ts-ignore|@ts-nocheck|\/\/ eslint-disable|as any)' \
    < "$TMP_DIR/files.txt" 2>/dev/null \
    > "$TMP_DIR/bug4.txt"

if [ -s "$TMP_DIR/bug4.txt" ]; then
  CNT=$(wc -l < "$TMP_DIR/bug4.txt" | tr -d ' ')
  BUG_LOW=$((BUG_LOW + CNT))
  while IFS= read -r line; do
    FPATH=$(echo "$line" | cut -d: -f1)
    LNUM=$(echo "$line" | cut -d: -f2)
    echo "- **LOW** \`${FPATH}:${LNUM}\`"
  done < "$TMP_DIR/bug4.txt"
  echo "- 구체적인 타입으로 교체 권장."
else
  echo "- ✅ 발견 안 됨."
fi
echo ""

## 2-5: Console.log 생산 환경 유출
echo "### 2-5. Console Logs in Source"
echo ""
xargs grep -nH 'console\.\(log\|debug\|info\|trace\)' \
    < "$TMP_DIR/files.txt" 2>/dev/null \
    | grep -vE '(test_|spec\.|node_modules)' \
    > "$TMP_DIR/bug5.txt"

if [ -s "$TMP_DIR/bug5.txt" ]; then
  # 파일별 그룹화
  cut -d: -f1 "$TMP_DIR/bug5.txt" | sort | uniq -c | sort -rn | head -15 | \
  while read -r cnt fpath; do
    echo "- **LOW** \`${fpath}\` — console.log \`$cnt\` times."
  done
  BUG_LOW=$((BUG_LOW + $(wc -l < "$TMP_DIR/bug5.txt" | tr -d ' ')))
else
  echo "- ✅ 발견 안 됨."
fi
echo ""

# === 버그 카운트 저장 ===
echo "$BUG_CRIT $BUG_HIGH $BUG_MED $BUG_LOW" > "$TMP_DIR/bug_counts.txt"

} >> "$REPORT"

# ======================================================
# 최종 요약 — 테이블 업데이트
# ======================================================
read SEC_CRIT SEC_HIGH SEC_MED SEC_LOW < "$TMP_DIR/sec_counts.txt"
read BUG_CRIT BUG_HIGH BUG_MED BUG_LOW < "$TMP_DIR/bug_counts.txt"

TOTAL_ISSUES=$((SEC_CRIT + SEC_HIGH + SEC_MED + SEC_LOW + BUG_CRIT + BUG_HIGH + BUG_MED + BUG_LOW))

cat >> "$REPORT" <<EOF

---

## Summary

| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Security | $SEC_CRIT | $SEC_HIGH | $SEC_MED | $SEC_LOW |
| Bugs | $BUG_CRIT | $BUG_HIGH | $BUG_MED | $BUG_LOW |

---

## Final Score

| Metric | Value |
|--------|-------|
| Total Issues | $TOTAL_ISSUES |
| Files Scanned | $TOTAL_FILES |
| Generated | $(date +"%Y-%m-%d %H:%M:%S %Z") |

---
*Automated Code Review — Read-only analysis. Source code was NOT modified.*
EOF

echo "[✓] Review saved to: $REPORT"
echo "    Found $TOTAL_ISSUES issues across $TOTAL_FILES files."
