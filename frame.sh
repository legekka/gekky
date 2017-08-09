#!/bin/bash

until [ $? -eq 2 ]
do
  node --no-warnings ./frame.js
done