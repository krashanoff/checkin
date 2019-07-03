import React from 'react';
import './Checkin.css';

class Checkin extends React.Component {
    componentDidMount() {
        console.log('entered the checkin page. Arguments passed to the URL are');
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