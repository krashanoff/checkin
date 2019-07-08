import React from 'react';
import './Start.css';

// dictates the minimum amount required to input before we
// start parsing for suggestions.
const SEARCHMIN = 3;

/* TODO:
 *  - Q: Ask if we are designing for pool members to check themselves in,
 *       or whether we are designing for lifeguards for it to be easier to
 *       check guests in.
 */
class Suggestions extends React.Component {
    constructor(props) {
        super(props);

        // declare all necessary fields for parsing
        this.state = {
            value: '',
            data: [],
            lastNamesAll: [],
            lastNamesVisible: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.click = this.click.bind(this);
    }

    /* handleChange
     * On change of the text field, if the field is of the proper length, then
     * we 
     */
    handleChange(event) {
        // update our state to match the input
        this.setState({value: event.target.value});

        // if we have not yet met the minimum query length,
        // then remove visible suggestions.
        if (event.target.length < SEARCHMIN) {
            this.setState({
                lastNamesVisible: []
            });

            return;
        }

        // used in almost every single part of the following code:
        var names = [];

        // when we reach the minimum query length, we request
        // data from the API and begin our suggestions.
        if (event.target.value.length === SEARCHMIN) {
            // fetch data from the API
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
                "LastName": "string",\
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
                "LastName": "string2",\
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
                "LastName": "string",\
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
        for (var i = 0; i < this.state.lastNamesAll.length; i++)
            if (this.state.lastNamesAll[i][1].includes(event.target.value))
                names.push(this.state.lastNamesAll[i]);
        this.setState({
            lastNamesVisible: names
        });
    }

    /* click
     * Redirect the user to the proper page based on which entry they click
     * and the current state of the component.
     */
    click(event) {
        window.location.href = '/results?ids=' + event.target.getAttribute('uid');
    }

    render() {
        // parse our current data to render the suggestions
        var names = [];
        
        // TODO: Update so that uid is the actual associated uid information.
        Array.from(this.state.lastNamesVisible).forEach( (name) => {
            var uidContents = '';

            // for each name in the Id array, append it to the uid attribute.
            for (var i = 0; i < name[0].length; i++)
                if (i === 0)
                    uidContents = name[0][i];
                else
                    uidContents += '+' + name[0][i];

            // create a new suggestion with uid information.
            names.push(<div className='suggestion' onClick={this.click} uid={uidContents} key={name[1]}>{name[1]}</div>);
        });

        return(
            <div id='suggestions'>
                <input type='text' name='name' placeholder='Please enter your last name...' value={this.state.value} onChange={this.handleChange} />
                <div id='names'>
                    {names}
                </div>
            </div>
        );
    }
}

class Start extends React.Component {
    render() {
        return (
            <div className='Start'>
                <form action='/results'>
                    <Suggestions />
                </form>
            </div>
        );
    }
}

export default Start;