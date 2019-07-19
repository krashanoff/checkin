#!/bin/bash

# moveAll.sh
# Moves all of our nginx config to the right places
# and sets things up.

echo "Copying over and symlinking our site's nginx config file..."
rm -f /etc/nginx/sites-enabled/checkin
rm -f /etc/nginx/sites-available/checkin

cp checkin /etc/ngnix/sites-available/checkin
ln -s /etc/nginx/sites-available/checkin /etc/nginx/sites-enabled/checkin
echo "Done."

echo "Copying over our upstart script and cleaning up the garbage leftover from earlier scripts."
rm -f /lib/systemd/system/uwsgi-app@.service
rm -f /lib/systemd/system/uwsgi-app@.socket

cp /home/dev/checkin/backend/nginx/checkin.service /lib/systemd/system
systemctl daemon-reload
echo "Done."

echo "Enabling the systemd unit..."
systemctl start checkin.service
systemctl enable checkin.service
echo "Script complete."