import React from 'react';
import './Admin.css';
import Axios from 'axios';

/* TODO:
 *  - Implement some sort of lazy loading functionality for the table.
 */

class UserInfo extends React.Component {
    constructor(props) {
        super(props);

        if (typeof this.props.data === 'undefined')
            console.log('NO DATA PROVIDED');
    }
    
    render() {
        return (
            <div className='userInfo'>
                <p>Family Name: {this.props.data.lastName}</p>
            </div>
        );
    }
}

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };
    }

    handleChange = (e) => {
        this.setState({ value: e.target.value });
    }

    render() {
        var currentData = [];

        // TODO: Populate the current data.

        return (
            <div id='admin'>
                <div id='masterTable'>
                    <input type='text' name='lastName' onChange={this.handleChange} value={this.state.value} placeholder='Search for a last name...' />

                    <table id='masterTable'>
                        <thead>
                            <tr>
                                <th>Last Name</th>
                                <th>First Name</th>
                                <th>Spouse/Partner</th>
                            </tr>
                        </thead>
                        <tbody>
                            { currentData }
                        </tbody>
                    </table>
                </div>

                {
                    this.state.value.length === 3 ?

                    <UserInfo uid='2' />

                    : <UserInfo uid='null' />
                }
            </div>
        );
    }
}

export default Admin;