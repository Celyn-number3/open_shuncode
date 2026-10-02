@echo off
setlocal

set "PROJECT_DIR=%~dp0"
set "SHUNCODE_LAUNCHER="

if defined SHUNCODE_EXE (
    set "SHUNCODE_LAUNCHER=%SHUNCODE_EXE:"=%"
    goto launch
)

for /f "delims=" %%I in ('where shuncode 2^>nul') do (
    set "SHUNCODE_LAUNCHER=%%~fI"
    goto launch
)

if exist "%~dp0ShunCode.exe" (
    set "SHUNCODE_LAUNCHER=%~dp0ShunCode.exe"
    goto launch
)

echo Could not find ShunCode. Add its bin folder to PATH or set SHUNCODE_EXE to ShunCode.exe.
exit /b 1

:launch
if not exist "%SHUNCODE_LAUNCHER%" (
    echo ShunCode launcher not found: "%SHUNCODE_LAUNCHER%"
    exit /b 1
)

for %%I in ("%SHUNCODE_LAUNCHER%") do set "SHUNCODE_EXT=%%~xI"
if /I "%SHUNCODE_EXT%"==".cmd" goto launch_script
if /I "%SHUNCODE_EXT%"==".bat" goto launch_script

start "" "%SHUNCODE_LAUNCHER%" --new-window "%PROJECT_DIR%"
exit /b 0

:launch_script
call "%SHUNCODE_LAUNCHER%" --new-window "%PROJECT_DIR%"
exit /b %ERRORLEVEL%
