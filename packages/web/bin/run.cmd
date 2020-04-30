@echo off

set NODE_PATH=%~dp0..\node_modules

node "%~dp0\run.js" %*
