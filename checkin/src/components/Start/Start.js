import React from 'react';
import './Start.css';

// dictates the minimum amount required to input before we
// start parsing for suggestions.
const SEARCHMIN = 3;

/* TODO:
 *  - IDEA: Make the lastNames state fields of type pair<int[], string>,
 *          this way we can have our ids bound to each last name.
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
            ids: [],
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
        this.setState({value: event.target.value});

        // exit early if we have not met the proper length yet
        if (event.target.value.length < SEARCHMIN)
            return;

        // when we reach the minimum search query length, we request
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
            for (var i = 0; i < names.length; i++) {
                for (var k = i + 1; k < names.length; k++) {
                    if (names[i] === names[k]) {
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
        }

        // Based on the current input, limit the number of visible results from
        // previously parsed data. This is stored in state.lastNamesVisible.
        // This limits our number of overall API requests per check-in.

        // for every last name we currently have available given the current input:
        for (var i = 0; i < this.state.lastNamesAll.length; i++) {
            // for every character in the name:
            for (var k = 0; k < this.state.lastNamesAll[i].length; k++) {
                // TODO: check that it is actually a suggestion.
            }
        }
    }

    /* click
     * Redirect the user to the proper page based on which entry they click
     * and the current state of the component.
     */
    click(event) {
        // TODO: Write this.
        const uid = event.target.getAttribute('uid');
        console.log(uid);
    }

    render() {
        // parse our current data to render the suggestions
        var names = [];
        var i = 0;          // simply used for the key field.
        
        // TODO: Update so that uid is the actual associated uid information.
        Array.from(this.state.lastNamesVisible).forEach( (name) => {
            names.push(<div className='suggestion' onClick={this.click} uid={name} key={'suggestion' + i}>{name}</div>);
            i++;
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