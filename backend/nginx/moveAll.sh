#!/bin/bash

# moveAll.sh
# Moves all of our nginx config to the right places.

echo "Copying over and symlinking our site's nginx config file..."
cp checkin /etc/ngnix/sites-available/checkin
ln -s /etc/nginx/sites-available/checkin /etc/nginx/sites-enabled/checkin
echo "Done."

echo "Attempting to disable our old systemd unit, if it exists..."
systemctl stop checkin
systemctl disable checkin
echo "Done."

echo "Copying over our upstart script..."
chmod u+x /home/dev/checkin/backend/run.sh
cp /home/dev/checkin/backend/nginx/checkin.service /lib/systemd/system
echo "Done."

echo "Enabling the systemd unit..."
systemctl start checkin
systemctl enable checkin
echo "Script complete."