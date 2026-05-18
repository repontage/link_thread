#!/bin/bash
# 리뷰 자동화 컨트롤러 (명령: on / off / status / run-now / stop)

ACTION="$1"
CRON_CMD="55 23 * * * /bin/bash /Users/seonghoonjung/workspace/link-thread-project/scripts/daily-review.sh"
SCRIPT="/Users/seonghoonjung/workspace/link-thread-project/scripts/daily-review.sh"

case "$ACTION" in
  off|stop)
    crontab -l 2>/dev/null | grep -v daily-review | crontab -
    echo "[✓] Daily review cron stopped."
    ;;
  on)
    (crontab -l 2>/dev/null | grep -v daily-review; echo "$CRON_CMD") | crontab -
    echo "[✓] Daily review cron enabled (runs at 23:55 every day)."
    ;;
  status)
    EXIST=$(crontab -l 2>/dev/null | grep daily-review)
    if [ -n "$EXIST" ]; then
      echo "[●] Daily review is RUNNING — next: today at 23:55"
      echo "$EXIST"
    else
      echo "[○] Daily review is STOPPED"
    fi
    ;;
  run-now)
    echo "[●] Running review now..."
    bash "$SCRIPT"
    ;;
  *)
    echo "Usage: review-ctrl {on|off|stop|status|run-now}"
    echo "  on      - cron 켬 (매일 23:55)"
    echo "  off/stop - cron 끔"
    echo "  status  - 현재 상태 확인"
    echo "  run-now  - 지금 바로 리뷰 실행"
    ;;
esac
