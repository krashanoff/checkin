import React from 'react';
import './Results.css';
import queryString from 'query-string';

/* Results
 * Parses the URL to lookup the ids in question and compare the first and last names
 * URL should look like: ...?ids=ID1+ID2+ID3+...
 */

 /* TODO:
  * Handle when ids is NULL
  * Redirect when ids is of length 1
  */

class Results extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ids: []
        };
    }

    // sets the state to reflect the ids we were passed in the URL.
    componentDidMount() {
        const values = queryString.parse(this.props.location.search);

        // if we are passed no ids, do nothing.
        if (typeof values.ids === "undefined")
            window.location.href = '/404';

        var ids = values.ids.split(' ');
        
        // otherwise, set our state to the values passed.
        this.setState({
            ids: ids
        });
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