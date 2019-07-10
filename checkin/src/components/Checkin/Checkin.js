import React from 'react';
import './Checkin.css';

 // TODO: Consider creating a new component to handle the table.
 // TODO: Add their street number for confirmation.
 // TODO: Use <div>s instead of tables for formatting.
class Checkin extends React.Component {
    constructor(props) {
        super(props);

        const values = this.props.location.state;

        // check for proper state passed by the previous page.
        // if ((typeof values === 'undefined')
        //     || (typeof values.id === 'undefined')
        //     || (typeof values.parentNames === 'undefined')
        //     || (typeof values.childNames === 'undefined')
        //     || (typeof values.caregiverNames === 'undefined'))
        //     window.location.href = '/404';

        // sample data below
        this.state = {
            id: '25',
            parentNames: ['SampleFirst1 SampleLast1', 'SampleFirst2 SampleLast2'],
            childNames: ['Sample1', 'Sample2'],
            caregiverNames: ['CaregiverFirst1 CaregiverLast1']
        };

        // this.setState = {
        //     id: values.id,
        //     parentNames: values.parentNames,
        //     childNames: values.childNames,
        //     caregiverNames: values.caregiverNames
        // };

        this.log = this.log.bind(this);
    }

    /* log()
     * Logs the checkin with proper date, time, etc. to the server, where further
     * processing is carried out.
     */
    log = (e) => {
        console.log(e);
    }

    render() {
        var parents = [];
        var children = [];
        var caregivers = [];

        Array.from(this.state.parentNames).forEach( (parent) => {
            console.log(parent);
            parents.push(
                <tr>
                    <td>{parent}</td>
                    <td>Check</td>
                </tr>
            );
        });

        Array.from(this.state.childNames).forEach( (child) => {
            console.log(child);
            children.push(
                <tr>
                    <td>{child}</td>
                    <td>Check</td>
                </tr>
            );
        });

        Array.from(this.state.caregiverNames).forEach( (caregiver) => {
            console.log(caregiver);
        });

        return (
            <div id='checkin'>
                <table className='namesTable' id='parents'>
                    <thead>
                        <caption>Parents</caption> 
                        <tr>
                            <th>Name</th>
                            <th>BUTTON</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parents}
                    </tbody>
                </table>

                {
                // Render the child table only if child names are passed.
                this.state.childNames.length > 0 ?

                <table className='namesTable' id='children'>
                    <thead>
                        <caption>Children</caption>
                        <th>Children</th>
                    </thead>
                    <tbody>
                        {children}
                    </tbody>
                </table>

                : <table />
                }
                
                {
                // Similarly, render the caregiver table only if caregivers are passed
                // as an option.
                this.state.caregiverNames.length > 0 ?

                <table className='namesTable' id='caregivers'>
                    <thead>
                        <caption>Other Caregivers</caption>
                        <th>Caregivers</th>
                    </thead>
                </table>

                : <table />
                }

                <input onSubmit={this.log} type='button' value='Check In' id='checkinButton' />
            </div>
        );
    }
}

export default Checkin;