import React from 'react';
import './Checkin.css';

class Checkin extends React.Component {
    componentDidMount() {
        console.log('entered the checkin page. Arguments passed to the URL are ' + this.props.location.state.id);
    }

    render() {
        return (
            <div className='checkin'>
                Welcome, {this.props.location.state.id}!
            </div>
        );
    }
}

export default Checkin;