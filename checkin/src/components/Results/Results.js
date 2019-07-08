import React from 'react';
import './Results.css';

/* Results
 * Renders relevant information from contact info passed to it as props
 * to help the user pick their name out.
 */
class Results extends React.Component {
    constructor(props) {
        super(props);

        const values = this.props.location.state;

        // if we are passed no ids, return a 404.
        if (typeof values.ids === "undefined")
            window.location.href = '/404';

        console.log(values.ids);
    }

    render() {
        return (
        <div className='results'>
            This is the results page, for if you had some search query that needed to get sent.
            This time, we were passed the following IDs: {this.props.location.state.ids}.
        </div>
        );
    }
}

export default Results;