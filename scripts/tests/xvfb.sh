#!/bin/bash

# USAGE
#   source ./xvfb.sh [COMMAND]
#
# DESCRIPTION
#   This script should be used before and after running Electron tests in
#   Docker. It starts a display server that implements the X11 protocol without
#   actually showing screen output. It then sets environment variables to point
#   applications to it and to start Electron processes with Chromium sandboxing
#   disabled.
#
# COMMANDS
#   setup       start xvfb and set environments variables
#   teardown    stop xvfb
#

case $1 in
setup)
    Xvfb :99 -ac -screen 0 1280x720x16 -nolisten tcp &
    export XVFB_PID=$!
    export DISPLAY=:99

    # https://github.com/electron/electron/issues/17972#issuecomment-516957971
    # https://github.com/electron/electron/pull/16576
    export ELECTRON_DISABLE_SANDBOX=true
    ;;
teardown)
    kill $XVFB_PID
    wait $XVFB_PID
    ;;
esac
