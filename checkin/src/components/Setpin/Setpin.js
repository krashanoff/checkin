import React from 'react';
import './Setpin.css';

class Setpin extends React.Component {
    constructor(props) {
        super(props);

        const values = this.props.location.state;

        // check that we were passed a proper state.
        if ((typeof values === 'undefined') || (typeof values.id === 'undefined'))
            window.location.href = '/404';

        this.state = {
            value: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    // on form submission, leverage the ID we were passed through the constructor
    // to determine which ID to request an update of.
    handleSubmit = () => {
        // make AJAX request.
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/setpin', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        // send the request.
        xhr.onreadystatechange = () => {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                xhr.send('id=' + this.props.location.state.id + '&pin=' + this.state.value);
            }
        }        
    }

    // simply update the contents of the pin field to match the state,
    // and catch if we have a desired submission.
    handleChange = (e) => {
        const value = e.target.value;

        this.setState({
            value: value
        });

        // submit if we have reached the desired length.
        if (e.target.value.length === 4)
            this.handleSubmit();
    }

    render() {
        return (
            <form className='pinput' onSubmit={this.handleSubmit}>
                <input type='password' name='pin' minlength='4' maxlength='4' placeholder='Your PIN' onChange={this.handleChange} value={this.state.value} required />
            </form>
        );
    }
};

export default Setpin;