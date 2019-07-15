import React from 'react';
import './Checkin.css';
const axios = require('axios');

/* TODO:
 * - Convert entire page to a form.
 * - Handle submission properly.
 */
function Entry(props) {
    return (
        <tr className='entry' id={props.id}>
            <td>{props.name}</td>
            <td>
                <div className='checkbox'>
                    <input type='checkbox' name={props.name} />
                    <span className='checkmark'></span>
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

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {
        if (e.target.className === 'minus') {
            if (this.state.value === 0)
                return;

            this.setState({value: this.state.value - 1});
        }
        else
            this.setState({value: this.state.value + 1});
    }

    render() {
        return(
            <div className='counter'>
                <button type='button' className='minus' onClick={this.handleChange}>-</button>
                <button name={this.props.name} type='button' className='count'>{this.state.value}</button>
                <button type='button' className='plus' onClick={this.handleChange}>+</button>
            </div>
        );
    }
};

// TODO: Add their street number for confirmation.
// TODO: Separate parents, caregivers, and children in the POST request.
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
            contact: values.contact
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /* handleSubmit
     * Scrapes our webpage for all relevant data, then submits it to the
     * server for processing.
     */
    handleSubmit = (e) => {
        e.preventDefault();

        var data = {};

        // append id.
        data.id = this.state.id;

        // append account last name.
        data.lastName = this.state.contact.accountLast;

        // find and sort guests being checked in.
        data.parents = [];
        data.caregivers = [];
        data.children = [];
        var entries = document.getElementsByClassName('entry');
        Array.from(entries).forEach( (entry) => {
            if (entry.lastChild.firstChild.firstChild.value === 'on') {
                const id = String(entry.id);
                const name = entry.firstChild.innerHTML;
                if (id.includes('parent'))
                    data.parents.push(name);
                else if (id.includes('caregiver'))
                    data.caregivers.push(name);
                else if (id.includes('child'))
                    data.children.push(name);
            }
        });

        // acquire guest counts from our counters.
        var counters = document.getElementsByClassName('count');
        Array.from(counters).forEach( (counter) => {
            if (counter.name === 'adultGuests')
                data.adultGuests = Number(counter.innerHTML);
            else
                data.childGuests = Number(counter.innerHTML);
        });

        // TODO: catch faulty or accidental submissions.

        // submit our request with the necessary data.
        axios.post('http://localhost:5000/api/log', {
            info: data
        })
        // if successful, then continue to the start screen.
        .then( (response) => {
            console.log(response);
            // window.location.href = '/';
        })
        // if the request fails, then display our error message.
        .catch( () => {
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

        if (typeof this.state.contact.altFirst !== 'undefined' && typeof this.state.contact.altLast !== 'undefined') {
            parents.push(<Entry name={String(this.state.contact.altFirst + ' ' + this.state.contact.altLast)} id={String('parent' + parentCount)} key={i} />);
            i++;
            parentCount++;
        }

        Array.from(this.state.contact.caregivers).forEach( (caregiverName) => {
            caregivers.push(<Entry name={caregiverName} id={String('caregiver' + caregiverCount)} key={i} />);
            i++;
            caregiverCount++;
        });

        Array.from(this.state.contact.children).forEach( (childName) => {
            children.push(<Entry name={childName} id={String('child' + childCount)} key={i} />);
            i++;
            childCount++;
        });

        return (
            <div id='checkin'>
                <table className='namesTable' id='parents'>
                    <caption>Adults</caption>
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parents}
                        {caregivers}
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
                
                <table className='namesTable' id='children'>
                    <caption>Children</caption>
                    <tbody>
                        {
                        // Render the child table only if child names are passed.
                        // TODO: Make this look nicer.
                        children.length > 0 ?

                        children : <div />
                        }
                    </tbody>
                </table>

                <input onClick={this.handleSubmit} type='button' value='Check-In' id='checkinButton' />
            </div>
        );
    }
}

export default Checkin;