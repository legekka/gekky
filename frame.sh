#!/bin/bash

node --no-warnings ./frame.js
until [ $? -eq 1 ]; do
  node --no-warnings ./frame.js
done