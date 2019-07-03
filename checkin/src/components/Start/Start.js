import React from 'react';
import './Start.css';

/* TODO:
 *  - Reduce number of API requests made overall.
 */
class Suggestions extends React.Component {
    constructor(props) {
        super(props);

        this.lastname = props.lastName;

        this.click = this.click.bind(this);
    }

    click(event) {
        window.location.href = '/checkin?id=' + event.target.uid;
    }

    render() {
        console.log('rendered');

        var names = [];
        // acquire data from API
        const data = [
            {'uid':20, 'lastName':'cat'},
            {'uid':10, 'lastName':'dog'}
        ];

        data.forEach((entry) => {
            names.push(<div className='suggestion' onClick={this.click} key={entry.uid}>{entry.lastName}</div>);
        });

        return (
            // For each match, create a suggestion.
            <div id='suggestions'>
                {names}
            </div>
        );
    }
}

class Start extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        return (
            <div className='Start'>
                <p>Please enter your last name:</p>
                <form action='/results'>
                    <input type='text' name='name' value={this.state.value} onChange={this.handleChange} />
                </form>
                {
                    this.state.value.length >= 3 ?

                    <Suggestions lastName={this.state.value} />

                    : <div />
                }
            </div>
        );
    }
}

export default Start;