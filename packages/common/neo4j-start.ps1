# Wrapper for the '.\neo4j.ps1 console' command to redirect output to the logs
# file and hide the terminal that pops up when running the script.

param (
    # Path to neo4j.ps1
    [Parameter(Mandatory=$true)][string]$binPath,
    # Path to neo4j.log
    [Parameter(Mandatory=$true)][string]$logsPath
)

Powershell -WindowStyle Hidden -NoProfile -NonInteractive -NoLogo -ExecutionPolicy Bypass -File "$binPath" console *>> "$logsPath"