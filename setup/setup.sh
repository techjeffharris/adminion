#!/bin/bash

gen=./gen-key-signed-cert.sh

# require root
if [ $USER != "root" ]
then 
	echo "$0: error: must be root" && exit 2
fi

# install ubuntu package dependencies
#apt-get update && apt-get install mongodb

# install node module dependencies
npm install

# if argument 1...
case $1 in 
	-g)
		gen $2	
		;;
	--generate)
		gen $2	
		;;
	-s)
		gen $2	
		;;
	--ssl)
		gen $2	
		;;
	*)
		echo "$0: error: unrecognized argument '$1'"
esac

nodejs admin.js
