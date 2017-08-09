#!/bin/bash

until (( ERRORLEVEL == 2 ))
do
  node --no-warnings ./frame.js
done