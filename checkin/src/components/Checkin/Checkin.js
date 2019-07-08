import React from 'react';
import './Checkin.css';

/* NOTE:
 * This is probably going to need to be carried out via search results,
 * in which case we can parse the data from a table entry returned from
 * the search.
 */

/* Sample contact data passed in:
 * NOTE: Some fields are ommitted for clarity.
{
  "Id": 0,
  "Url": "string",
  "FirstName": "string",
  "LastName": "string",
  "DisplayName": "string",
  "MembershipLevel": {
    "Id": 0,
    "Url": "string",
    "Name": "string"
  },
  "MembershipEnabled": true,
  "Status": "Active"
}
 */

class Checkin extends React.Component {
    render() {
        // sample data contained below
        var sample;
        {
        sample = JSON.parse('{\
            "Id": 9924,\
            "FirstName": "Temporary First Name",\
            "LastName": "Temporary Last Name",\
            "DisplayName": "ShortName",\
            "MembershipLevel": {\
              "Id": 0,\
              "Url": "string",\
              "Name": "string"\
            },\
            "MembershipEnabled": true,\
            "Status": "Active"\
          }');
        }

        return (
            <div className='checkin'>
                Welcome, {sample.LastName}!
            </div>
        );
    }
}

export default Checkin;