#!/bin/bash

# moveAll.sh
# Moves all of our nginx config to the right places.

echo "Copying the uWSGI run script..."
chmod +x run.sh
cp run.sh /usr/local/bin/run.sh
echo "Done."

echo "Copying over and symlinking our site's nginx config file..."
cp checkin /etc/ngnix/sites-available/checkin
ln -s /etc/nginx/sites-available/checkin /etc/nginx/sites-enabled/checkin
echo "Done."

echo "Attempting to disable our old systemd unit, if it exists..."
systemctl stop checkin.service
systemctl disable checkin.service
echo "Done."

echo "Copying over our upstart script..."
chmod u+x /home/dev/checkin/backend/run.sh
cp /home/dev/checkin/backend/nginx/checkin.service /lib/systemd/system
systemctl daemon-reload
echo "Done."

echo "Enabling the systemd unit..."
systemctl start checkin.service
systemctl enable checkin.service
echo "Script complete."