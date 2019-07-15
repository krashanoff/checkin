import React from 'react';
import './Start.css';
import { Link, Redirect } from 'react-router-dom';
const axios = require('axios');

// dictates the minimum amount required to input before we
// start parsing for suggestions.
const SEARCHMIN = 3;

/* TODO:
 *  - Clean up the formatting of this entire file.
 *  - Actually parse input as we go to request the proper query information.
 *  - Set catchalls for when we read this.state.data.
 *  - Associate each Link with the contact of concern, not just the entire block
 *    of data we initially retrieve.
 *  - Provide access to member's phone number for an emergency, and to all members'
 *    emails for a general emergency message.
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
            redirectWith: [],
            searchConducted: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /* handleChange
     * On change of the text field, if the field is of the proper length, then
     * we query for relevant names that match the search term.
     * The function is async as we must wait for the server response before any
     * search suggestions may be made.
     */
    async handleChange(event) {
        // update our state to match the input
        const input = event.target.value;
        this.setState({value: input});

        // if we have not yet met the minimum query length,
        // then remove visible suggestions.
        if (input.length < SEARCHMIN) {
            this.setState({
                lastNamesVisible: [],
                searchConducted: 'false'
            });
            console.log('cleared names and reset');

            return;
        }

        // used in almost every single part of the following code:
        var names = [];

        // when we reach the minimum query length, we request
        // data from the API and begin our suggestions.
        if (this.state.searchConducted === 'false' && input.length === SEARCHMIN) {
            // get data from the API.
            try {
                const response = await axios.get('http://localhost:5000/api/search?lastName=' + input);
                this.setState({ data: response.data });
                console.log(response.data);
            } catch (error) {
                alert('Failed retrieving data from the server. Is the server running?');
                return;
            }

            // populate the lastNamesAll field, mirroring its contents in the
            // lastNamesVisible state field.
            names = [];

            // push the UID and the last name into the array.
            // this functions similarly to pair<Id[], LastName>.
            Array.from(this.state.data).forEach( (contact) => {
                names.push([ [contact.id], contact.accountLast ]);
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

            // Use a sorting function designed specifically for the pair data type
            // we are using.
            names.sort( (pairA, pairB) => { return pairA[1] > pairB[1]; });

            // update the current state to reflect the new information
            this.setState({
                lastNamesAll: names,
                lastNamesVisible: names,
                searchConducted: 'true'
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
        names.sort( (pairA, pairB) => { return pairA[1] > pairB[1]; });

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