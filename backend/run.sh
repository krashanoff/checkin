#!/bin/bash

# Builds and then runs the application.

cd ~/checkin/checkin
npm run build
cd ../backend
WA_CLIENT_ID="$WA_CLIENT_ID" WA_CLIENT_SECRET="$WA_CLIENT_SECRET" WA_USERNAME="$WA_USERNAME" WA_PASSWORD="$WA_PASSWORD" WA_ID="$WA_ID" SPREADSHEET_ID="$SPREADSHEET_ID" uwsgi --ini checkin.ini