# Neo4j on Windows

## Problem

Neo4j doesn't have a Windows equivalent to running the DBMS as a daemon process.

## Existing options

### Windows Service

The closest there is to running a DBMS as a daemon process on Windows, is through
Windows Services. This is the recommended way in the [docs](https://neo4j.com/docs/operations-manual/current/installation/windows/).

This solution is not viable for Relate, for the following reasons:

-   Requires users to have admin privileges, which is often not the case (eg. in
    enterprise or school environments).
-   Adds extra friction when uninstalling the DBMS. If the `bin\neo4j.bat uninstall-service`
    command is not run or fails, deleting the DBMS directory will result in a Windows
    Service pointing to a non-existing location. Which means it won't be possible
    to uninstall that service unless manually editing its Windows Registry entry
    (or using an external tool to clean the registry).

### Console

This option works when manually starting/stopping the DBMS, it can be started on
the background if using a specific PowerShell command to invoke it, but has the
following issues:

-   Doesn't write any logs in the usual log files.
-   Doesn't allow checking the status of the DBMS by running `bin\neo4j.bat status`.
-   The DBMS process cannot be cleanly shut down by an external process.

## Desktop's solution

Desktop's initial solution was to run Neo4j in console mode as a child process.
This couples the DBMS and the application processes and has lead to multiple
issues across all platforms, notably:

-   Desktop forcefully terminating Neo4j in various cases.
-   Desktop not recognizing Neo4j DBMSs that were started outside of the app.
-   Desktop leaving orphaned processes that would not allow the app to work
    correctly on the next startup.
-   Desktop would freeze if Neo4j would produce too many logs.

There have been workarounds for some of these, but they don't fix the
fundamental problem of coupling the two processes.

## Relate's solution

None of the options Neo4j provides out of the box worked for us on Windows, so
we decided to create an alternative way to manage the Neo4j process. A way that
is consumable by other tools, and is as similar as possible to the current
recommended way to run Neo4j on Mac and Linux.

The solution is written mostly in TypeScript, as that's what the team is
comfortable maintaining. But could be ported to other languages.

### Implementation

-   [neo4j-process-win.ts](../packages/common/src/utils/dbmss/neo4j-process-win.ts)
-   [neo4j-start.ps1](../packages/common/neo4j-start.ps1)

#### Start

The command to launch Neo4j in console mode is wrapped by another PowerShell
script to:

-   redirect the DBMS output to its log file
-   hide the terminal the script is attached to

When this script is run from TypeScript (as a detached process) its PID is
written to a file.

#### Stop

The PID is read from the file and the entire process tree is killed.

#### Status

The PID is read from the file and we check if a process with that PID is running.

### Cross-platform benefits

This approach makes the application and DBMS processes independent, which has
the following cross-platform benefits:

-   Desktop won't be leaving orphaned processes
-   DBMSs started outside of Desktop can be recognized
-   Desktop won't be unexpectedly killing DBMSs
-   The DBMS won't be able to freeze Desktop by sending too many logs

### Windows caveats

-   The process is never stopped gracefully.

This is not new behavior. As of now there is no way to do
that on Windows without requiring admin permissions. There are plans to add a
procedure to shut down the DBMS in a future version of Neo4j. That will help with
this issue.

-   A terminal is shown for a brief moment when starting a DBMS.

Shell scripts on Windows are not executable on their own, they need to be
attached to a shell. The shell window can be hidden, which is what we do, but it
will still show for a fraction of a second.
