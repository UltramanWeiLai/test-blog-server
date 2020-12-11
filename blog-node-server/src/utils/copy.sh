#!/bin/sh
cd /home/blog-server/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log