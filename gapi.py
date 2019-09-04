import os
import pickle
import json
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow

"""
GOOGLE SHEETS
"""

# Create a credentials file from an environment variable.
def createCredsFromEnv():
    # Remove the file if it exists
    if os.path.exists("tmp/credentials.json"):
        os.remove("tmp/credentials.json")

    # Create the file using our environment variable.
    creds = open("tmp/credentials.json", "a+")
    if os.environ.get('GAPI_CREDS') is None:
        raise "Please declare your Google API Credentials in your environment variables."

    # Write to our file then close it.
    creds.write(str(os.environ['GAPI_CREDS']))
    creds.close()

# Returns a Google Sheets API client.
def getApi():
    # Set up the Google Sheets API client. Validate with oAuth key.
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    creds = None

    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)

    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'tmp/credentials.json', SCOPES)
            creds = flow.run_local_server()
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    return build('sheets', 'v4', credentials=creds)