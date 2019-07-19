#!/bin/bash

# moveAll.sh
# Moves all of our nginx config to the right places
# and sets things up.

echo "Copying the uWSGI run config..."
cp ../checkin.ini /etc/uwsgi/apps-available/checkin.ini
echo "Done."

echo "Copying over and symlinking our site's nginx config file..."
cp checkin /etc/ngnix/sites-available/checkin
ln -s /etc/nginx/sites-available/checkin /etc/nginx/sites-enabled/checkin
echo "Done."

echo "Attempting to disable our old systemd unit, if it exists..."
systemctl stop uwsgi-app@checkin.service
systemctl disable uwsgi-app@checkin.service
echo "Done."

echo "Copying over our upstart script..."
cp /home/dev/checkin/backend/nginx/uwsgi-app@.service /lib/systemd/system
cp /home/dev/checkin/backend/nginx/uwsgi-app@.socket /lib/systemd/system
systemctl daemon-reload
echo "Done."

echo "Enabling the systemd unit..."
systemctl enable uwsgi-app@checkin.socket
systemctl start uwsgi-app@checkin.service
systemctl enable uwsgi-app@checkin.service
echo "Script complete."