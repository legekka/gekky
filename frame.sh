#!/bin/bash

node --no-warnings ./frame.js
until [ $? -eq 3 ]; do
  node --no-warnings ./frame.js
done