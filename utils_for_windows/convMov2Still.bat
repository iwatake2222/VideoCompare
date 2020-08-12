rem echo off 

%~d0 
cd %~dp0
mkdir "%~n1"
ffmpeg.exe -i "%1" -f image2 "%~n1/%%06d.jpg"

pause
