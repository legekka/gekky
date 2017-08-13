@Echo off
title gekky
:start
node frame.js --no-warnings
if %ERRORLEVEL% NEQ 3 goto:start