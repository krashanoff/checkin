import os
import tempfile
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
            # Ensure that we have an environment variable holding our GAPI
            # credentials.json.
            if os.environ.get('GAPI_CREDS') is None:
                raise "Please declare a GAPI_CREDS environment variable."

            # Create a temporary file object that we then write our credentials
            # to.
            temp = tempfile.TemporaryFile()
            temp.write(bytes(os.environ['GAPI_CREDS'], 'UTF-8'))

            # Reset the file to the first position.
            temp.seek(0)

            # Create our flow object from said file object.
            flow = InstalledAppFlow.from_client_secrets_file(temp.name, SCOPES)
            creds = flow.run_local_server()

            # Close the file object.
            temp.close()

        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    return build('sheets', 'v4', credentials=creds)