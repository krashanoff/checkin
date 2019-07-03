import React from 'react';

class Admin extends React.Component {
    constructor(props) {
        super(props);
        
        this.props = {
            masterPass: props.masterPass,
        };
        this.state = {pass: 'Please input PIN.'};

        this.handleChange = this.handleChange.bind(this);
        this.revealTable = this.revealTable.bind(this);
    }

    revealTable() {
        console.log('1');
    }

    handleChange(event) {
        this.setState({pass: event.target.value});
        
        if (event.target.value === this.props.masterPass)
            this.revealTable();
    }

    render() {
        return (
        <div className='admin'>
            <div id='password'>
                <input type='text' name='PIN' pattern='^\d{4}$' value={this.state.pass} onChange={this.handleChange} required />
                PASSWORD GOES HERE
            </div>
        </div>
        );
    }
}

export default Admin;