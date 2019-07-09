import React from 'react';
import { Redirect } from 'react-router-dom';
import './SetPin.css';

class SetPin extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {
        console.log(e.target.value);
    }

    render() {
        return (
            <h1>TEMPORARY</h1>
        );
    }
};

export default SetPin;