import React from 'react';
import './Checkin.css';

class Checkbox extends React.Component {
    render() {
        return (
            <input className='checkbox' />
        );
    }
};

function Entry(props) {
    return <tr><td>{props.name}</td><td><Checkbox /></td></tr>;
}

/* Counter
 * A component that counts positive integers.
 */
class Counter extends React.Component {
    constructor(props) {
        super(props);

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
                <button type='button' className='count'>{this.state.value}</button>
                <button type='button' className='plus' onClick={this.handleChange}>+</button>
            </div>
        );
    }
};

 // TODO: Consider creating a new component to handle the table.
 // TODO: Add their street number for confirmation.
 // TODO: Use <div>s instead of tables for formatting.
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

        this.log = this.log.bind(this);
    }

    /* log()
     * Sends a POST request to the API with our relevant data, which the
     * server then logs.
     */
    log = (e) => {
        console.log(e);
    }

    render() {
        var adults = [];
        var children = [];
        var i = 0;

        adults.push(<Entry name={String(this.state.contact.accountFirst + ' ' + this.state.contact.accountLast)} key={i} />);
        i++;

        if (typeof this.state.contact.altFirst !== 'undefined' && typeof this.state.contact.altLast !== 'undefined') {
            adults.push(<Entry name={String(this.state.contact.altFirst + ' ' + this.state.contact.altLast)} key={i} />);
            i++;
        }

        Array.from(this.state.contact.caregivers).forEach( (caregiverName) => {
            adults.push(<Entry name={caregiverName} key={i} />);
            i++;
        });

        Array.from(this.state.contact.children).forEach( (childName) => {
            children.push(<Entry name={childName} key={i} />);
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
                        {adults}
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
                        children.length > 0 ?

                        children : <div />
                        }
                    </tbody>
                </table>

                <input onClick={this.log} type='button' value='Check-In' id='checkinButton' />
            </div>
        );
    }
}

export default Checkin;