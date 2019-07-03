import React from 'react';
import './Start.css';

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

        // check and query API, then update #suggestions
        if (event.target.value.length === 3)
            console.log('things');
    }

    render() {
        return (
            <div className='Start'>
                <p>Please enter your last name:</p>
                <form action='/results'>
                    <input type='text' name='search' value={this.state.value} onChange={this.handleChange} />
                    <div id='suggestions' />
                </form>
            </div>
        );
    }
}

export default Start;