import React from 'react';
import './Checkin.css';
import queryString from 'query-string';

const API_KEY = process.env.WILDAPRICOT_KEY;

class Checkin extends React.Component {
    constructor(props) {
        super(props);

        this.userID = '';
    }

    componentDidMount() {
        this.setState({userID: queryString.parse(this.props.location.search).id});
        console.log('entered the checkin page. Arguments passed to the URL are ' + this.state.userID);
        console.log(API_KEY);
    }

    render() {
        const data = 'apiinformation';
        
        return (
            <div className='checkin'>
                Welcome, {this.state.userID}!
            </div>
        );
    }
}

export default Checkin;