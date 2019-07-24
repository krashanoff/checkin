import React from 'react';
import './Admin.css';
import Axios from 'axios';

/* TODO:
 *  - Implement some sort of lazy loading functionality for the table.
 */

class UserInfo extends React.Component {
    constructor(props) {
        super(props);

        this.setState({
            contactInfo: {}
        });

        Axios.get('/api/userInfo/' + this.props.uid)
        .then( (response) => {
            this.setState({
                contactInfo: response
            });
        })
        .catch( () => {
            alert('Data could not be fetched from the server. If this problem persists, please contact the administrator.');
        });
    }

    render() {
        return (
            <div className='userInfo'>
                <h1>NAME</h1>
            </div>
        );
    }
}

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.setState({ value: '' });
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

                <UserInfo uid='2' />
            </div>
        );
    }
}

export default Admin;