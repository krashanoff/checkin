import os

import sqlite3
import click
from flask import current_app, g
from flask.cli import with_appcontext

# Returns a SQL database for the current app.
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db

# Close the database
def db_close(e=None):
    db = g.pop('db', None)
    
    if db is not None:
        db_close()

# Initialize the database
def init_db():
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

@click.command('init-db')
@with_appcontext
def init_db_command():
    init_db()
    click.echo('Initialized db.')

def init_app(app):
    app.teardown_appcontext(db_close)
    app.cli.add_command(init_db_command)