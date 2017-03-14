#!/bin/bash

until (( ERRORLEVEL == 2 ))
do
  node --no-warnings /home/vnc/legekky/gekky/frame.js
done