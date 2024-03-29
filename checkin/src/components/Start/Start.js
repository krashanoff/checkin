import React from 'react';
import './Start.css';
import { Link, Redirect } from 'react-router-dom';
import Axios from 'axios';

// dictates the minimum amount required to input before we
// start parsing for suggestions.
const SEARCHMIN = 3;

/* TODO:
 *  - Set catchalls for when we read this.state.data.
 *  - Associate each Link with the contact of concern, not just the entire block
 *    of data we initially retrieve.
 *  - Provide access to member's phone number for an emergency, and to all members'
 *    emails for a general emergency message.
 *  - Provide more verbose error feedback, maybe a timeout before trying to run
 *    a query again.
 */
class Start extends React.Component {
    constructor(props) {
        super(props);

        // declare all necessary fields for parsing
        this.state = {
            value: '',
            data: [],
            lastNamesAll: [],
            lastNamesVisible: [],
            redirectWith: [],
            searchConducted: '',
            noResults: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // this function is used later on. It takes the names array and
    // returns the index of the lastName passed if already present in
    // the array. Otherwise, it returns -1.
    includesForNames = (array, lastName) => {
        for (var i = 0; i < array.length; i++)
            if (array[i][1] === lastName)
                return i;
        
        return -1;
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
        this.setState({
            value: input
        });

        // if we have not yet met the minimum query length,
        // then remove visible suggestions.
        if (input.length < SEARCHMIN) {
            this.setState({
                lastNamesAll: [],
                lastNamesVisible: [],
                searchConducted: 'false'
            });

            return;
        }

        // used in almost every single part of the following code:
        var names = [];

        // when we reach the minimum query length, we request
        // data from the API and begin our suggestions.
        if (this.state.searchConducted === 'false' && input.length === SEARCHMIN) {
            // get data from the API.
            try {
                const response = await Axios.get('/api/search/' + input);
                this.setState({
                    data: response.data
                });
            } catch {
                alert('Failed retrieving data from the server. Is the server running?');
                return;
            }

            // populate the lastNamesAll field, mirroring its contents in the
            // lastNamesVisible state field.
            names = [];

            // for all our contacts received:
            Array.from(this.state.data).forEach( (contact) => {
                // test for inclusion.
                const includes = this.includesForNames(names, contact.accountLast);

                // if the last name isn't already in the array,
                // then push a new pair containing an unfilled
                // array of ids associated to a single last name.
                if (includes === -1)
                    names.push([ [contact.id], contact.accountLast ]);

                // otherwise, insert at the location returned by our
                // inclusion function.
                else
                    names[includes][0].push(contact.id);
            });

            // update the current state to reflect the new information
            this.setState({
                lastNamesAll: names,
                searchConducted: 'true'
            });
        }

        // Based on the current input, limit the number of visible results from
        // previously parsed data. This is stored in state.lastNamesVisible.
        // This limits our number of overall API requests per check-in.

        // push only the names that have the current search as a substring.            
        names = [];
        Array.from(this.state.lastNamesAll).forEach( (name) => {
            if (name[1].toUpperCase().includes(input.toUpperCase())) {
                names.push(name);
            }
        });

        // sort using a method specifically for our data type.
        names.sort( (pairA, pairB) => {
            return pairA[1] > pairB[1];
        });

        this.setState({
            lastNamesVisible: names
        });

        // if no matches are found, then display our "no results found"
        // message.
        if (this.state.lastNamesVisible.length === 0 && this.state.searchConducted === 'true') {
            this.setState({
                noResults: 'true'
            });
        } else {
            this.setState({
                noResults: 'false'
            });
        }
    }

    /* handleSubmit
     * On submission of the form, we set the state field 'redirectWith'
     * to our currently visible names, and then force load the results
     * page with the current data and names.
     */
    async handleSubmit(event) {
        event.preventDefault();

        // In the case that we have no suggestions, but 
        if (this.state.value.length > 1 && this.state.lastNamesVisible.length === 0) {
            try {
                const response = await Axios.get('/api/search/' + this.state.value);
                this.setState({
                    data: response.data
                });
            } catch {
                alert('Failed retrieving data from the server. Is the server running?');
                return;
            }
            
            var visible = [];

            // for all our contacts received:
            Array.from(this.state.data).forEach( (contact) => {
                // test for inclusion.
                const includes = this.includesForNames(visible, contact.accountLast);

                // if the last name isn't already in the array,
                // then push a new pair containing an unfilled
                // array of ids associated to a single last name.
                if (includes === -1)
                    visible.push([ [contact.id], contact.accountLast ]);

                // otherwise, insert at the location returned by our
                // inclusion function.
                else
                    visible[includes][0].push(contact.id);
            });

            // set our state to properly work for the code to follow.
            this.setState({
                lastNamesVisible: visible
            });
        }

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

        // if we have no results, display the "no results" message.
        if (this.state.noResults === 'true') {
            names.push(<div className='suggestion noResults' key='0'>No results found.</div>);
        }
        // otherwise, display our suggestions.
        else {
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
        }

        return (
            <div id='start'>
                <form id='suggestions' onSubmit={this.handleSubmit}>
                    <input type='text' placeholder='Please enter a last name...' value={this.state.value} onChange={this.handleChange} />
                    <div id='names'>
                        {names}
                    </div>
                </form>
            </div>
        );
    }
};

export default Start;