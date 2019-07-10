import React from 'react';
import './Start.css';
import { Link, Redirect } from 'react-router-dom';

// dictates the minimum amount required to input before we
// start parsing for suggestions.
const SEARCHMIN = 3;

/* TODO:
 *  - Clean up the formatting of this entire file.
 *  - Actually parse input as we go to request the proper query information.
 *  - Q: Ask if we are designing for pool members to check themselves in,
 *       or whether we are designing for lifeguards for it to be easier to
 *       check guests in.
 *  - FUNNEL DOWN THE API DATA AS WE GO.
 */
class Start extends React.Component {
    constructor(props) {
        super(props);

        // declare all necessary fields for parsing
        this.state = {
            value: '',
            data: [],
            dataVisible: [],
            lastNamesAll: [],
            lastNamesVisible: [],
            redirectWith: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /* handleChange
     * On change of the text field, if the field is of the proper length, then
     * we query for relevant names that match the search term.
     * By retaining relevant data, we are able to sustain about four "rewrites"
     * of the search term per minute without exceeding the quota outlined by the
     * free tier of the Wild Apricot API.
     */
    handleChange(event) {
        // update our state to match the input
        const input = event.target.value;
        this.setState({value: input});

        // if we have not yet met the minimum query length,
        // then remove visible suggestions.
        if (input.length < SEARCHMIN) {
            this.setState({
                lastNamesVisible: []
            });
            console.log('cleared names');

            return;
        }

        // used in almost every single part of the following code:
        var names = [];

        // when we reach the minimum query length, we request
        // data from the API and begin our suggestions.
        if (input.length === SEARCHMIN) {
            // TODO: fetch data from the API
            this.setState({data : [
                {
                    'Id': 0,
                    'Name': 'string',
                    'Description': 'string',
                    'ContactIds': [
                        0
                    ]
                }
            ]});

            // populate the lastNamesAll field, mirroring its contents in the
            // lastNamesVisible state field.
            names = [];

            // below is an absolute mess of test data. It serves no other purpose.
            // the brackets are for collapsing the code in your editor.
            var sampleContactData = [];
            {
            sampleContactData.push(JSON.parse('{\
                "Id": 20496,\
                "Url": "string",\
                "FirstName": "string",\
                "LastName": "Martin",\
                "Organization": "string",\
                "Email": "string",\
                "DisplayName": "string",\
                "ProfileLastUpdated": "2019-07-08",\
                "MembershipLevel": {\
                    "Id": 0,\
                    "Url": "string",\
                    "Name": "string"\
                },\
                "MembershipEnabled": true,\
                "Status": "Active",\
                "ExtendedMembershipInfo": {\
                    "PendingMembershipOrderStatusType": "Invisible",\
                    "PendingMembershipInvoice": {\
                    "Id": 0,\
                    "Url": "string"\
                    },\
                    "AllowedActions": [\
                    {\
                        "Id": 0,\
                        "Url": "string",\
                        "Name": "string"\
                    }\
                    ]\
                },\
                "IsAccountAdministrator": true,\
                "TermsOfUseAccepted": true,\
                "FieldValues": [\
                    {\
                    "FieldName": "string",\
                    "SystemCode": "string",\
                    "Value": {},\
                    "CustomAccessLevel": "Public"\
                    }\
                ]\
            }'));
            sampleContactData.push(JSON.parse('{\
                "Id": 99,\
                "Url": "string",\
                "FirstName": "string",\
                "LastName": "Mar",\
                "Organization": "string",\
                "Email": "string",\
                "DisplayName": "string",\
                "ProfileLastUpdated": "2019-07-08",\
                "MembershipLevel": {\
                    "Id": 0,\
                    "Url": "string",\
                    "Name": "string"\
                },\
                "MembershipEnabled": true,\
                "Status": "Active",\
                "ExtendedMembershipInfo": {\
                    "PendingMembershipOrderStatusType": "Invisible",\
                    "PendingMembershipInvoice": {\
                    "Id": 0,\
                    "Url": "string"\
                    },\
                    "AllowedActions": [\
                    {\
                        "Id": 0,\
                        "Url": "string",\
                        "Name": "string"\
                    }\
                    ]\
                },\
                "IsAccountAdministrator": true,\
                "TermsOfUseAccepted": true,\
                "FieldValues": [\
                    {\
                    "FieldName": "string",\
                    "SystemCode": "string",\
                    "Value": {},\
                    "CustomAccessLevel": "Public"\
                    }\
                ]\
            }'));
            sampleContactData.push(JSON.parse('{\
                "Id": 201,\
                "Url": "string",\
                "FirstName": "string",\
                "LastName": "Martian",\
                "Organization": "string",\
                "Email": "string",\
                "DisplayName": "string",\
                "ProfileLastUpdated": "2019-07-08",\
                "MembershipLevel": {\
                    "Id": 0,\
                    "Url": "string",\
                    "Name": "string"\
                },\
                "MembershipEnabled": true,\
                "Status": "Active",\
                "ExtendedMembershipInfo": {\
                    "PendingMembershipOrderStatusType": "Invisible",\
                    "PendingMembershipInvoice": {\
                    "Id": 0,\
                    "Url": "string"\
                    },\
                    "AllowedActions": [\
                    {\
                        "Id": 0,\
                        "Url": "string",\
                        "Name": "string"\
                    }\
                    ]\
                },\
                "IsAccountAdministrator": true,\
                "TermsOfUseAccepted": true,\
                "FieldValues": [\
                    {\
                    "FieldName": "string",\
                    "SystemCode": "string",\
                    "Value": {},\
                    "CustomAccessLevel": "Public"\
                    }\
                ]\
            }'));
            sampleContactData.push(JSON.parse('{\
                "Id": 22,\
                "Url": "string",\
                "FirstName": "string",\
                "LastName": "Mar",\
                "Organization": "string",\
                "Email": "string",\
                "DisplayName": "string",\
                "ProfileLastUpdated": "2019-07-08",\
                "MembershipLevel": {\
                    "Id": 0,\
                    "Url": "string",\
                    "Name": "string"\
                },\
                "MembershipEnabled": true,\
                "Status": "Active",\
                "ExtendedMembershipInfo": {\
                    "PendingMembershipOrderStatusType": "Invisible",\
                    "PendingMembershipInvoice": {\
                    "Id": 0,\
                    "Url": "string"\
                    },\
                    "AllowedActions": [\
                    {\
                        "Id": 0,\
                        "Url": "string",\
                        "Name": "string"\
                    }\
                    ]\
                },\
                "IsAccountAdministrator": true,\
                "TermsOfUseAccepted": true,\
                "FieldValues": [\
                    {\
                    "FieldName": "string",\
                    "SystemCode": "string",\
                    "Value": {},\
                    "CustomAccessLevel": "Public"\
                    }\
                ]\
            }'));
            }

            // push the UID and the last name into the array.
            // this functions similarly to pair<Id, LastName>.
            Array.from(sampleContactData).forEach( (contact) => {
                names.push([ [contact.Id], contact.LastName]);
            });

            // eliminate duplicate entries so that the end product is a list of
            // unique names with associated Id arrays.
            for (var i = 0; i < names.length; i++) {
                for (var k = i + 1; k < names.length; k++) {
                    if (names[i][1] === names[k][1]) {
                        names[i][0].push(names[k][0][0]);
                        names.splice(k);
                        break;
                    }
                }
            }

            names.sort();

            // update the current state to reflect the new information
            this.setState({
                lastNamesAll: names,
                lastNamesVisible: names
            });

            // exit on completion.
            return;
        }

        // Based on the current input, limit the number of visible results from
        // previously parsed data. This is stored in state.lastNamesVisible.
        // This limits our number of overall API requests per check-in.

        // push only the names that have the current search as a substring.
        names = [];
        Array.from(this.state.lastNamesAll).forEach( (name) => {
            if (name[1].toUpperCase().includes(input.toUpperCase()))
                names.push(name);
        });
        names.sort();

        this.setState({
            lastNamesVisible: names
        });
    }

    /* handleSubmit
     * On submission of the form, we set the state field 'redirectWith'
     * to our currently visible names, and then force load the results
     * page with the current data and names.
     */
    handleSubmit(event) {
        event.preventDefault();

        // construct a concatenated array of the presently available ids and associated names
        // to send to the results page.
        var rw = [];
        Array.from(this.state.lastNamesVisible).forEach( (tuple) => {
            tuple[0].forEach( (id) => {
                rw.push(id);
            });
        });

        this.setState({
            redirectWith: rw
        });
    }

    render() {
        // if we have received the signal to redirect, simply redirect
        // with all relevant results.
        if (this.state.redirectWith.length !== 0)
            return (<Redirect to={{
                pathname: '/results',
                state: {
                    ids: this.state.redirectWith,
                    data: this.state.data
                }
            }} />);

        // parse our current data to render the suggestions
        var names = [];
        
        Array.from(this.state.lastNamesVisible).forEach( (name) => {
            // create a new suggestion Link with uid information.
            names.push(<Link to={{
                pathname: '/results',
                state: {
                    ids: name[0],
                    data: this.state.data
                }
            }} className='suggestion' key={name[1]}>{name[1]}</Link>);
        });

        return(
            <form id='suggestions' onSubmit={this.handleSubmit}>
                <input type='text' placeholder='Please enter your last name...' value={this.state.value} onChange={this.handleChange} />
                <div id='names'>
                    {names}
                </div>
            </form>
        );
    }
};

export default Start;