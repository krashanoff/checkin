import React from 'react';
import './Admin.css';

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.setState({ value: '' });
    }

    handleChange = (e) => {
        this.setState({ value: e.target.value });
    }

    render() {
        return (
            <div id='admin'>
                <div id='search'>
                    <input type='text' name='lastName' onChange={this.handleChange} placeholder='Search for a last name...' />
                </div>
                <div id='userInfo'>
                    INFORMATION ABOUT SELECTED USER
                </div>
                <div id='links'>
                    <a>Mail</a>
                </div>
            </div>
        );
    }
}

export default Admin;