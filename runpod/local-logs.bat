@echo off
setlocal
cd /d "%~dp0\.."

echo.
echo =========================================
echo   FEDDA RunPod-local (Docker) - LOGS
echo =========================================
echo.

docker compose -f runpod/docker-compose.yml logs -f --tail=200
endlocal
exit /b 0
