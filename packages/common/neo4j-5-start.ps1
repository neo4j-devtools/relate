# Wrapper for the '.\neo4j.ps1 console' command to redirect output to the logs
# file and hide the terminal that pops up when running the script.

param (
    # Path to neo4j.ps1
    [Parameter(Mandatory = $true)][string]$binPath,
)

# TODO: redirect logs from powershell to a neo4j-relate.log file
Powershell -NoProfile -NonInteractive -NoLogo `
    -WindowStyle Hidden `
    -ExecutionPolicy Bypass `
    -File "$binPath" console
