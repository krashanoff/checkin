import React from 'react';
import queryString from 'query-string';
import './Results.css';

class Results extends React.Component {
    componentDidMount() {
        console.log('entered the results page');
        const values = queryString.parse(this.props.location.search);
        console.log('We were passed an argument to the URL of: ' + values.name);
    }

    render() {
        return (
        <div className='results'>
            This is the results page, for if you had some search query that needed to get sent.
        </div>
        );
    }
}

export default Results;