import React from 'react';
import queryString from 'query-string';
import './Results.css';

/* Results
 * Parses the URL to lookup the ids in question and compare the first and last names
 * URL should look like: ...?ids=ID1+ID2+ID3+...
 */

 /* TODO:
  * Handle when ids is NULL
  */

class Results extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ids: ''
        };
    }

    // sets the state to reflect the ids we were passed in the URL.
    componentDidMount() {
        console.log('entered the results page');
        const values = queryString.parse(this.props.location.search);

        if (typeof values.ids === "undefined")
            window.location.href = '/404';
        
        this.setState({ids: values.ids});
    }

    render() {
        return (
        <div className='results'>
            This is the results page, for if you had some search query that needed to get sent.
            This time, we were passed the following IDs: {this.state.ids}.
        </div>
        );
    }
}

export default Results;