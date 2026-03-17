@echo off
setlocal

REM Build script for Windows: creates standalone .exe without requiring Python on target PC

where py >nul 2>nul
if %errorlevel% neq 0 (
  echo [ERROR] Python Launcher (py) not found. Install Python 3.10+ from python.org.
  exit /b 1
)

echo [1/3] Installing/Updating PyInstaller...
py -m pip install --upgrade pip pyinstaller
if %errorlevel% neq 0 (
  echo [ERROR] Failed to install PyInstaller.
  exit /b 1
)

echo [2/3] Building EXE...
py -m PyInstaller --noconfirm --clean --windowed --onefile --name TicTacToe4x4 main.py
if %errorlevel% neq 0 (
  echo [ERROR] Build failed.
  exit /b 1
)

echo [3/3] Done.
echo EXE path: %cd%\dist\TicTacToe4x4.exe
endlocal
