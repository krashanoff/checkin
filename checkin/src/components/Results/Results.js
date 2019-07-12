import React from 'react';
import { Link, Redirect } from 'react-router-dom';
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

        console.log(values.ids);

        // the state contains redir<bool, desiredLink>
        this.state = {
            redir: []
        };

        this.handleClick = this.handleClick.bind(this);
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

        // create table entries for each id we are passed.
        var entries = [];
        Array.from(this.props.location.state.ids).forEach( (id) => {
            Array.from(this.props.location.state.data).forEach( (contact) => {
                if (contact.id === id) {
                    entries.push(
                        <tr className='contactEntry' key={id}>
                            <td><Link to={{
                                pathname:'/checkin',
                                state: {
                                    id: id,
                                    contact: contact
                                }
                            }}>{contact.accountLast}</Link></td>
                            <td>{contact.accountFirst}</td>
                            <td>{contact.spouseFirst}</td>
                        </tr>
                    );
                }
            });
        });

        return (
            <table id='results'>
                <thead>
                    <tr>
                        <th>Last Name</th>
                        <th>First Name</th>
                        <th>Spouse Name</th>
                    </tr>
                </thead>
                <tbody>
                    {entries}
                </tbody>
            </table>
        );
    }
}

export default Results;