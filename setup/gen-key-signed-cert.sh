#!/bin/bash

# require root
if [ $USER != "root" ]
then 
	echo "$0: error: must be root" && exit 2
fi

# if the length of $1 is not zero
if [ $1 ]
then
	# set serverName to $1
	serverName=$1
	if [ -d "$serverName" ]
	then
		serverName="$serverNameadminion"
	fi
else
	# set serverName to default: "adminion"
	serverName="../.ssl/adminion"
fi

# ouput the server name to be used
#echo "server name: $serverName"

mkdir .ssl

key=".ssl/$serverName-key.pem"
csr=".ssl/$serverName-csr.pem"
cert=".ssl/$serverName-cert.pem"

echo "generating $key...";
openssl genrsa -out $key

echo "generating $csr..."
openssl req -new -key $key -out $csr

echo "self-signing $cert..."
openssl x509 -req -days 9999 -in $csr -signkey $key -out $cert

echo "deleting $csr..."
rm $csr

echo "successfully generated $key, self-signed $cert from $csr."
