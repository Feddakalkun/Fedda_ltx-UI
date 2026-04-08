@echo off
setlocal
cd /d "%~dp0\.."

echo.
echo =========================================
echo   FEDDA RunPod-local (Docker) - STOP
echo =========================================
echo.

docker compose -f runpod/docker-compose.yml down
if errorlevel 1 (
  echo [ERROR] Failed to stop docker stack.
  pause
  exit /b 1
)

echo [OK] Stack stopped.
endlocal
exit /b 0
