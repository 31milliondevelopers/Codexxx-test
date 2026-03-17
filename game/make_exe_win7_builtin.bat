@echo off
setlocal EnableExtensions

REM Creates TicTacToe4x4.exe using only built-in Windows 7 tool IExpress (no third-party software).

set "ROOT=%~dp0"
set "SED=%TEMP%\tictactoe4x4_win7.sed"
set "OUT=%ROOT%TicTacToe4x4.exe"

if not exist "%ROOT%TicTacToe4x4.hta" (
  echo [ERROR] File not found: "%ROOT%TicTacToe4x4.hta"
  exit /b 1
)

if not exist "%ROOT%launch_game.cmd" (
  echo [ERROR] File not found: "%ROOT%launch_game.cmd"
  exit /b 1
)

where iexpress >nul 2>nul
if %errorlevel% neq 0 (
  echo [ERROR] IExpress not found. This script must run on Windows 7/Windows with IExpress.
  exit /b 1
)

> "%SED%" echo [Version]
>>"%SED%" echo Class=IEXPRESS
>>"%SED%" echo SEDVersion=3
>>"%SED%" echo [Options]
>>"%SED%" echo PackagePurpose=InstallApp
>>"%SED%" echo ShowInstallProgramWindow=0
>>"%SED%" echo HideExtractAnimation=1
>>"%SED%" echo UseLongFileName=1
>>"%SED%" echo InsideCompressed=0
>>"%SED%" echo CAB_FixedSize=0
>>"%SED%" echo CAB_ResvCodeSigning=0
>>"%SED%" echo RebootMode=N
>>"%SED%" echo InstallPrompt=
>>"%SED%" echo DisplayLicense=
>>"%SED%" echo FinishMessage=
>>"%SED%" echo TargetName=%OUT%
>>"%SED%" echo FriendlyName=TicTacToe4x4
>>"%SED%" echo AppLaunched=launch_game.cmd
>>"%SED%" echo PostInstallCmd=<None>
>>"%SED%" echo AdminQuietInstCmd=
>>"%SED%" echo UserQuietInstCmd=
>>"%SED%" echo SourceFiles=SourceFiles
>>"%SED%" echo [SourceFiles]
>>"%SED%" echo SourceFiles0=%ROOT%
>>"%SED%" echo [SourceFiles0]
>>"%SED%" echo %%FILE0%%=TicTacToe4x4.hta
>>"%SED%" echo %%FILE1%%=launch_game.cmd
>>"%SED%" echo [Strings]
>>"%SED%" echo FILE0="TicTacToe4x4.hta"
>>"%SED%" echo FILE1="launch_game.cmd"

echo [1/2] Building EXE with IExpress...
iexpress /N /Q "%SED%"
if %errorlevel% neq 0 (
  del "%SED%" >nul 2>nul
  echo [ERROR] IExpress build failed.
  exit /b 1
)

del "%SED%" >nul 2>nul

if exist "%OUT%" (
  echo [2/2] Done: "%OUT%"
  exit /b 0
)

echo [ERROR] Build finished, but EXE not found.
exit /b 1
