#!/bin/bash

until (( ERRORLEVEL == 2 ))
do
  node --no-warnings /home/vnc/legekky/gekky.js
done