#!/bin/sh

port=50181
addr=127.0.0.1
tdir=./sample.d

miniserve \
  --port ${port} \
  --interfaces "${addr}" \
  "${tdir}"
