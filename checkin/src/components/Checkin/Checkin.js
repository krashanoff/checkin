import React from 'react';
import './Checkin.css';
import queryString from 'query-string';

class Checkin extends React.Component {
    componentDidMount() {
        const userID = queryString.parse(this.props.location.search);
        console.log('entered the checkin page. Arguments passed to the URL are ' + userID.id);
    }

    render() {
        return (
            <div className='checkin'>
                This is the check in page.
            </div>
        );
    }
}

export default Checkin;