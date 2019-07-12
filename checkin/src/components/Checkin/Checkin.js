import React from 'react';
import './Checkin.css';

function Checkbox(props) {
    return <input className='checkbox' />;
}

function Entry(props) {
    return <tr><td>{props.name}</td><td><Checkbox /></td></tr>;
}

class Counter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {
        if (e.target.id === 'minus')
            this.setState({value: this.state.value - 1});
        else
            this.setState({value: this.state.value + 1});
    }

    render() {
        return(
            <div className='counter'>
                <button type='button' id='minus' onClick={this.handleChange}>-</button>
                <p>{this.state.value}</p>
                <button type='button' id='plus' onClick={this.handleChange}>+</button>
            </div>
        );
    }
}

 // TODO: Consider creating a new component to handle the table.
 // TODO: Add their street number for confirmation.
 // TODO: Use <div>s instead of tables for formatting.
class Checkin extends React.Component {
    constructor(props) {
        super(props);

        const values = this.props.location.state;

        if ((typeof values === 'undefined')
            || (typeof values.id === 'undefined')
            || (typeof values.data === 'undefined'))
            window.location.href = '/404';

        this.setState = {
            id: values.id,
            contact: values.contact
        };

        this.log = this.log.bind(this);
    }

    /* log()
     * Logs the checkin with proper date, time, etc. to the server, where further
     * processing is carried out.
     */
    log = (e) => {
        console.log(e);
    }

    render() {
        var parents = [];
        var children = [];
        var i = 0;

        Array.from(this.state.contact.accountFirst).forEach( (parent) => {
            console.log(parent);
            parents.push(
                <Entry key={i} name={parent} />
            );
            i++;
        });

        Array.from(this.state.childNames).forEach( (child) => {
            console.log(child);
            children.push(
                <Entry key={i} name={child} />
            );
            i++;
        });

        Array.from(this.state.caregiverNames).forEach( (caregiver) => {
            console.log(caregiver);
            parents.push(
                <Entry key={i} name={caregiver} />
            );
            i++;
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
                    </tbody>
                </table>

                <table className='namesTable' id='guests'>
                    <tbody>
                        <tr>
                            <td>Adult Guests</td>
                            <td><Counter /></td>
                        </tr>
                        <tr>
                            <td>Child Guests</td>
                            <td><Counter /></td>
                        </tr>
                    </tbody>
                </table>
                
                <table className='namesTable' id='children'>
                    <caption>Children</caption>
                    <tbody>
                        {
                        // Render the child table only if child names are passed.
                        // TODO: Make this look nicer.
                        this.state.childNames.length > 0 ?

                        children : <div />
                        }
                    </tbody>
                </table>

                <input onSubmit={this.log} type='button' value='Check-In' id='checkinButton' />
            </div>
        );
    }
}

export default Checkin;