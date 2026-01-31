@echo off
REM Daily PVP Suits sync script for Windows Task Scheduler
REM Run this batch file to sync PVP Suits from competitor

cd /d %~dp0..
node scripts\sync-pvp-suits.js >> logs\pvp-suits-sync.log 2>&1

REM Append timestamp to log
echo [%date% %time%] Sync completed >> logs\pvp-suits-sync.log
