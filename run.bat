@echo off
title AI Goal Journal ^& Accountability Coach
echo ======================================================================
echo           AI Goal Journal ^& Accountability Coach Launcher
echo ======================================================================
echo.

echo [1/2] Starting FastAPI Backend Server on http://127.0.0.1:8000 ...
start "AI Goal Journal - FastAPI Backend" cmd /k "set PYTHONPATH=backend&& python -m uvicorn app.main:app --app-dir backend --reload --host 127.0.0.1 --port 8000"

echo [2/2] Starting React Vite Frontend on http://localhost:5173 ...
start "AI Goal Journal - React Frontend" cmd /k "npm run dev"

echo.
echo Waiting for servers to initialize...
timeout /t 3 >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ======================================================================
echo Application launcher triggered!
echo ======================================================================
