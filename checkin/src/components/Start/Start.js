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

    handleChange(event) {
        this.setState({value: event.target.value});

        if (event.target.value === SEARCHMIN) {
            // fetch data from the API
            const data = [
                {
                    'Id': 0,
                    'Name': 'string',
                    'Description': 'string',
                    'ContactIds': [
                        0
                    ]
                }
            ];
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
        this.state.lastNamesVisible.forEach((name) => {
            names.push(<div className='suggestion' onClick={this.click} key={name.uid}>{name}</div>)
        });

        return(
            <div id='suggestions'>
                <div id='input'>
                    <input type='text' name='name' value={this.state.value} onChange={this.handleChange} />
                </div>
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
                <p>Please enter your last name:</p>
                <form action='/results'>
                    <Suggestions />
                </form>
            </div>
        );
    }
}

export default Start;