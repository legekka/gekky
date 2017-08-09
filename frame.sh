#!/bin/bash

until [ $? -ne 2 ]
do
  node --no-warnings ./frame.js
done