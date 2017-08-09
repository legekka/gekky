#!/bin/bash

node --no-warnings ./frame.js
until [ $? -ne 2 ]; do
  node --no-warnings ./frame.js
done