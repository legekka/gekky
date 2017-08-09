#!/bin/bash

until [ $? -nq 2 ]
do
  node --no-warnings ./frame.js
done