import React from 'react';
import './Checkin.css';
import queryString from 'query-string';

class Checkin extends React.Component {
    constructor(props) {
        super(props);

        var uid = queryString.parse(this.props.location.search).id;

        this.state = {
            id: uid
        };
    }

    componentDidMount() {
        console.log('entered the checkin page. Arguments passed to the URL are ' + this.state.id);
    }

    render() {
        return (
            <div className='checkin'>
                Welcome, {this.state.id}!
            </div>
        );
    }
}

export default Checkin;