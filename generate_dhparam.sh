#!/bin/bash

CURRENTDIR=$(pwd)
mkdir $CURRENTDIR/conf/dhparam
openssl dhparam -out $CURRENTDIR/conf/dhparam/dhparam-2048.pem 2048