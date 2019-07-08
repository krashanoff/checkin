import React from 'react';
import './Start.css';

const SEARCHMIN = 3;

/* TODO:
 *  - Reduce number of API requests made overall.
 */
class Suggestions extends React.Component {
    constructor(props) {
        super(props);

        // declare all necessary fields for parsing
        this.state = {
            value: '',
            data: '',
            ids: '',
            lastNamesAll: '',
            lastNamesVisible: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    /* handleChange
     * On change of the text field, if the field is of the proper length, then
     * we 
     */
    handleChange(event) {
        this.setState({value: event.target.value});

        // exit early if we have not met the proper length yet
        if (event.target.value.length < SEARCHMIN)
            return;

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
            var names = [];

            // below is an absolute mess of test data. It serves no other purpose.
            // the brackets are for collapsing the code in your editor.
            var sampleContactData = [];
            {
            sampleContactData.push(JSON.parse('{\
                "Id": 0,\
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
                "Id": 0,\
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
                "Id": 0,\
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

            // get all last names and push to our names array
            Array.from(sampleContactData).forEach( (contact) => {
                names.push(contact.LastName);
            });

            // eliminate duplicate entries
            for (var i = 0; i < names.length; i++)
                for (var k = i + 1; k < names.length; k++)
                    if (names[i] === names[k]) {
                        names.splice(k);
                        break;
                    }
        }

        // Based on the current input, limit the number of visible results from
        // previously parsed data. This is stored in state.lastNamesVisible.
        // This limits our number of overall API requests per check-in.
    }

    render() {
        /* parse our current data to render the suggestions
         *  - If duplicate last name entries, associate their ids to the same
         *    last name.
         */
        var names = [];
        for (var i = 0; i < this.state.lastNamesVisible.length; i++) {
            const name = this.state.lastNamesVisible[i];
            names.push(<div className='suggestion' onClick={this.click} key={name.uid}>{name}</div>);
        }

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