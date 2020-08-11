# Wrapper for the '.\neo4j.ps1 console' command to redirect output to the logs
# file and hide the terminal that pops up when running the script.

param (
    # Path to neo4j.ps1
    [Parameter(Mandatory = $true)][string]$binPath,
    # Path to neo4j.log
    [Parameter(Mandatory = $true)][string]$logsPath
)

Powershell -NoProfile -NonInteractive -NoLogo `
    -WindowStyle Hidden `
    -ExecutionPolicy Bypass `
    -File "$binPath" console  `
    <# Redirect error, warning, and information streams into the success stream.
    https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_redirection?view=powershell-5.1 #> `
    2>&1 3>&1 6>&1 | `
    <# Append the success stream to the log file using the correct encoding #> `
    Out-File -Append -Encoding utf8 "$logsPath"
