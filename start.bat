@echo off
title mx-moni

echo Starting backend...
cd /d %~dp0backend
start "Backend" cmd /k "npm run dev"

echo Starting frontend...
cd /d %~dp0frontend
start "Frontend" cmd /k "npm run dev"

echo Done! Backend -> http://localhost:3001, Frontend -> http://localhost:5173
