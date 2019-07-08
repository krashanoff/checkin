import React from 'react';
import { Redirect } from 'react-router-dom';
import './Results.css';

/* Results
 * Renders relevant information from contact info passed to it as props
 * to help the user pick their name out.
 */
class Results extends React.Component {
    constructor(props) {
        super(props);

        const values = this.props.location.state;

        // if we are missing props, or have no ids passed, then return the 404 page.
        if ((typeof values === 'undefined') || (typeof values.ids === "undefined"))
            window.location.href = '/404';
    }

    render() {
        // if we have only one id passed, then just redirect to the proper checkin page.
        if (this.props.location.state.ids.length === 1) {
            return (
                <Redirect to={{
                    pathname: '/checkin',
                    state: {
                        id: this.props.location.state.ids[0]
                    }
                }} />
            );
        }

        return (
            <div className='results'>
                This is the results page, for if you had some search query that needed to get sent.
                This time, we were passed the following IDs: {this.props.location.state.ids}.
            </div>
        );
    }
}

export default Results;