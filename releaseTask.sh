#!/bin/bash

mkdir tmp
touch tmp/credentials.json
echo $(GAPI_CREDS) > tmp/credentials.json