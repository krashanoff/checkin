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
    componentDidMount() {
        console.log('entered the results page');
        const values = queryString.parse(this.props.location.search);

        if (typeof values.ids === "undefined")
            window.location.href = '/404';
            
        console.log('We were passed an argument to the URL of: ' + values.ids);
        const all = values.ids.split('+');
        for (var i = 0; i < all.length; i++)
            console.log(all[i]);
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