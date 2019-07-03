import React from 'react';
import './Checkin.css';
import queryString from 'query-string';

const API_KEY = process.env.WILDAPRICOT_KEY;

class Checkin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userID: ''
        };
    }

    componentDidMount() {
        this.setState({userID: queryString.parse(this.props.location.search).id});
        console.log('entered the checkin page. Arguments passed to the URL are ' + this.state.userID);
        console.log(API_KEY);
    }

    render() {
        return (
            <div className='checkin'>
                This is the check in page. Searching for id {this.state.userID}
            </div>
        );
    }
}

export default Checkin;