@echo off
setlocal
cd /d "%~dp0"
echo.
echo  Mention Groups - Trello Power-Up
echo  Installing dependencies if needed...
call npm install
if errorlevel 1 (
  echo.
  echo npm install failed. Check your internet connection and Node.js installation.
  pause
  exit /b 1
)
echo.
echo Starting local preview at http://localhost:5173
echo Open http://localhost:5173/groups.html to preview the UI.
call npm run dev
pause
