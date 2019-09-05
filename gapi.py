import os
import pickle
import json
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow

"""
GOOGLE SHEETS
"""

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
            # Create our flow object from the credentials file.
            flow = InstalledAppFlow.from_client_secrets_file("tmp/credentials.json", SCOPES)
            creds = flow.run_local_server()

        # Save the credentials for the next run.
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    return build('sheets', 'v4', credentials=creds)