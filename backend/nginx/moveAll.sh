#!/bin/bash

# moveAll.sh
# Moves all of our nginx config to the right places.

echo "Copying over and symlinking our site's nginx config file..."
cp checkin /etc/ngnix/sites-available/checkin
ln -s /etc/nginx/sites-available/checkin /etc/nginx/sites-enabled/checkin
echo "Done."

echo "Copying over our upstart script..."
cp checkin.conf /etc/init/checkin.conf
echo "Done!"