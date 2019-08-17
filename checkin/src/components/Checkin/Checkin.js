import React from 'react';
import './Checkin.css';
const axios = require('axios');

/* Entry
 * A row in a table that contains the name and id passed
 * to it, along with a checkmark to toggle the entry's
 * current status.
 */
function Entry(props) {
    return (
        <tr className='entry' id={props.id}>
            <td>{props.name}</td>
            <td>
                <div className='checkbox'>
                    <input type='checkbox' name={props.name} />
                    <span className='checkmark' />
                </div>
            </td>
        </tr>
    );
}

/* Counter
 * A component that counts positive integers.
 */
class Counter extends React.Component {
    constructor(props) {
        super(props);

        if (typeof this.props.name === 'undefined')
            console.log("ERROR: COUNTER COMPONENT REQUIRES A NAME PARAMETER.");

        this.state = {
            value: 0
        };
    }

    handleChange = (e) => {
        // fired on subtraction.
        if (e.target.className === 'minus') {
            // if the value is currently zero, we cannot go negative. Return early.
            if (this.state.value === 0)
                return;

            // otherwise update the state.
            this.setState({value: this.state.value - 1});
        }
        // fired on addition.
        else
            // positives are far less sanitized. Simply update the state.
            this.setState({value: this.state.value + 1});
    }

    render() {
        return (
            <div className='counter'>
                <button type='button' className='minus' onClick={this.handleChange}>-</button>
                <button name={this.props.name} type='button' className='count'>{this.state.value}</button>
                <button type='button' className='plus' onClick={this.handleChange}>+</button>
            </div>
        );
    }
};

// TODO: Add their street number for confirmation.
class Checkin extends React.Component {
    constructor(props) {
        super(props);

        const values = this.props.location.state;

        // validate the state passed to our page.
        if ((typeof values === 'undefined')
            || (typeof values.id === 'undefined')
            || (typeof values.contact === 'undefined'))
            window.location.href = '/404';

        this.state = {
            id: values.id,
            contact: values.contact,
            submissionInProgress: ''
        };
    }

    /* handleSubmit
     * Scrapes our webpage for all relevant data, then submits it to the
     * server for processing.
     */
    handleSubmit = (e) => {
        e.preventDefault();

        // stop a secondary submission from being completed in parallel.
        if (this.state.submissionInProgress === 'true')
            return;

        var requestData = {};

        // append id.
        requestData.id = this.state.id;

        // append account last name.
        requestData.lastName = this.state.contact.accountLast;

        // find and sort guests being checked in.
        requestData.parents = [];
        requestData.caregivers = [];
        requestData.children = [];
        const entries = document.getElementsByClassName('entry');
        Array.from(entries).forEach( (entry) => {
            if (entry.lastChild.firstChild.firstChild.checked === true) {
                const id = String(entry.id);
                const name = entry.firstChild.innerHTML;

                // push each entry to its respective array.
                if (id.includes('parent'))
                    requestData.parents.push(name);
                else if (id === 'thirdAdult')
                    requestData.thirdAdult = name;
                else if (id.includes('caregiver'))
                    requestData.caregivers.push(name);
                else if (id.includes('child'))
                    requestData.children.push(name);
            }
        });

        // acquire guest counts from our counters.
        var counters = document.getElementsByClassName('count');
        Array.from(counters).forEach( (counter) => {
            if (counter.name === 'adultGuests')
                requestData.adultGuests = Number(counter.innerHTML);
            else
                requestData.childGuests = Number(counter.innerHTML);
        });

        // Catch faulty or accidental submissions.
        if (requestData.parents.length === 0
            && requestData.caregivers.length === 0
            && requestData.children.length === 0) {
                alert('ERROR: No adults or children are selected');
                return;
            }
        
        // indicate to the component that we have a submission in progress that should
        // not be duplicated.
        this.setState({ submissionInProgress: 'true' });

        // submit our request with the necessary data.
        axios.post('/api/log', {
                data: requestData
        })
        // if successful, then continue to the start screen.
        .then( () => {
            window.location.href = '/';
        })
        // if the request fails, then display our error message.
        .catch( () => {
            this.setState({ submissionInProgress: 'false' });
            alert("ERROR: Logging could not be completed properly. Please wait a few seconds and try again.\nIf this message persists, then contact the administrator.");
        });
    }

    render() {
        var parents = [];
        var caregivers = [];
        var children = [];
        var i = 0;
        var parentCount = 0;
        var caregiverCount = 0;
        var childCount = 0;

        parents.push(<Entry name={String(this.state.contact.accountFirst + ' ' + this.state.contact.accountLast)} id={String('parent' + parentCount)} key={i} />);
        i++;
        parentCount++;

        // Add the second possible parent, if present.
        if (typeof this.state.contact.altFirst !== 'undefined' && typeof this.state.contact.altLast !== 'undefined') {
            parents.push(<Entry name={String(this.state.contact.altFirst + ' ' + this.state.contact.altLast)} id={String('parent' + parentCount)} key={i} />);
            i++;
            parentCount++;
        }

        // Add the third adult field.
        if (typeof this.state.contact.thirdAdult !== 'undefined') {
            parents.push(<Entry name={String(this.state.contact.thirdAdult)} id='thirdAdult' key={i} />);
            i++;
        }

        // Add the caregivers applicable.
        Array.from(this.state.contact.caregivers).forEach( (caregiverName) => {
            caregivers.push(<Entry name={caregiverName} id={String('caregiver' + caregiverCount)} key={i} />);
            i++;
            caregiverCount++;
        });

        // Add the children applicable.
        Array.from(this.state.contact.children).forEach( (childName) => {
            children.push(<Entry name={childName} id={String('child' + childCount)} key={i} />);
            i++;
            childCount++;
        });

        return (
            <div id='checkin'>
                <table className='namesTable' id='parents'>
                    <thead>
                        <tr>
                            <th>Adults</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parents}
                        {caregivers}
                    </tbody>
                </table>
                
                <table className='namesTable' id='children'>
                    <thead>
                        <tr>
                            <th>Children</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        // Render the child table only if child names are present.
                        // TODO: Make this look nicer.
                        children.length > 0 ?

                        children : <tr><td>This account has no children associated.</td></tr>
                        }
                    </tbody>
                </table>

                <table className='namesTable' id='guests'>
                    <tbody>
                        <tr>
                            <td>Adult Guests</td>
                            <td><Counter name='adultGuests' /></td>
                        </tr>
                        <tr>
                            <td>Child Guests</td>
                            <td><Counter name='childGuests' /></td>
                        </tr>
                    </tbody>
                </table>

                <input onClick={this.handleSubmit} type='button' value='Check-In' id='checkinButton' />
            </div>
        );
    }
}

export default Checkin;