@echo off
setlocal
cd /d "%~dp0\.."

echo.
echo =========================================
echo   FEDDA RunPod-local (Docker) - START
echo =========================================
echo.

docker compose -f runpod/docker-compose.yml up -d --build
if errorlevel 1 (
  echo.
  echo [ERROR] Failed to start docker stack.
  pause
  exit /b 1
)

echo.
echo [OK] Stack started.
echo UI:      http://localhost:3000
echo ComfyUI: http://localhost:8199
echo.
echo Checking health (can take a while on first boot)...
for /l %%i in (1,1,60) do (
  curl -sSf http://localhost:3000/ >nul 2>nul && (
    echo [OK] UI is responding.
    goto :done
  )
  timeout /t 2 /nobreak >nul
)

echo [WARN] UI did not respond within timeout. Check logs with runpod\local-logs.bat

:done
echo.
endlocal
exit /b 0
