#!/bin/bash

# require root
if [ $USER != "root" ]
then 
	echo "$0: error: must be root" && exit 2
fi

log=/var/log/adminion.log
err=/var/log/adminion.err

# 2> redirects errors, then we use tee to see the output while logging it
node utils/app.js 2> $err | tee $log
